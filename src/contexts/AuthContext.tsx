
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Tipos para o contexto de autenticação
interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: 'super_admin' | 'admin' | 'funcionario' | 'moderador' | 'suporte';
  nivel_acesso: 'super_admin' | 'admin' | 'moderador' | 'suporte';
  empresa_id: string | null;
  ativo: boolean;
  ultimo_acesso: string | null;
  primeiro_acesso_concluido: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsPasswordChange: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isGlobalAdmin: boolean;
  isCompanyUser: boolean;
  updateLastAccess: () => Promise<void>;
  markFirstAccessComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar perfil do usuário com melhor tratamento de erros
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Carregando perfil para usuário:', userId);
      console.log('🔍 Auth UID atual:', userId);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle(); // Usar maybeSingle() em vez de single()

      if (error) {
        console.error('❌ Erro RLS/Query ao carregar perfil:', error);
        
        // Verificar se é um erro de RLS ou de query
        if (error.code === 'PGRST116') {
          console.log('⚠️ Nenhum perfil encontrado para o usuário');
          return null;
        }
        
        // Para outros erros, log detalhado
        console.error('❌ Erro detalhado:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return null;
      }

      if (!data) {
        console.log('⚠️ Nenhum dados de perfil retornados para o usuário:', userId);
        
        // Verificar se o usuário existe na tabela sem filtro por auth_user_id
        try {
          const { data: allUsers, error: checkError } = await supabase
            .from('usuarios')
            .select('id, email, auth_user_id')
            .limit(5);
            
          console.log('🔍 Primeiros usuários na base:', allUsers);
          console.log('🔍 Erro na verificação:', checkError);
        } catch (checkErr) {
          console.log('🔍 Não foi possível verificar usuários:', checkErr);
        }
        
        return null;
      }

      console.log('✅ Perfil carregado com sucesso:', {
        id: data.id,
        email: data.email,
        role: data.role,
        nivel_acesso: data.nivel_acesso,
        empresa_id: data.empresa_id,
        auth_user_id: data.auth_user_id
      });
      
      return data as UserProfile;
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar perfil:', error);
      return null;
    }
  };

  // Atualizar último acesso
  const updateLastAccess = async () => {
    try {
      const { error } = await supabase.rpc('update_last_access');
      if (error) {
        console.error('Erro ao atualizar último acesso:', error);
      }
    } catch (error) {
      console.error('Erro inesperado ao atualizar último acesso:', error);
    }
  };

  // Marcar primeiro acesso como concluído
  const markFirstAccessComplete = async () => {
    try {
      const { error } = await supabase.rpc('marcar_primeiro_acesso_concluido');
      if (error) {
        console.error('Erro ao marcar primeiro acesso:', error);
      } else {
        // Recarregar perfil para atualizar estado
        if (user) {
          const updatedProfile = await loadUserProfile(user.id);
          setProfile(updatedProfile);
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao marcar primeiro acesso:', error);
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro de autenticação:', error);
        return { error: 'Credenciais inválidas. Verifique seu email e senha.' };
      }

      if (!data.user) {
        return { error: 'Erro na autenticação do usuário.' };
      }

      console.log('✅ Login bem-sucedido para:', data.user.email);
      return { error: null };
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      return { error: 'Erro interno do sistema. Tente novamente.' };
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        toast.error('Erro ao sair do sistema');
      } else {
        toast.success('Logout realizado com sucesso');
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      toast.error('Erro inesperado ao sair');
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    let mounted = true;
    let loadingTimeout: NodeJS.Timeout;

    // Timeout para evitar loading infinito
    const setLoadingTimeout = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      loadingTimeout = setTimeout(() => {
        if (mounted) {
          console.log('⏰ Timeout de loading atingido, forçando isLoading = false');
          setIsLoading(false);
        }
      }, 10000); // 10 segundos timeout
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (session?.user) {
          console.log('👤 Sessão ativa, carregando perfil...');
          setSession(session);
          setUser(session.user);
          setLoadingTimeout(); // Iniciar timeout
          
          try {
            const userProfile = await loadUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
              console.log('✅ Perfil carregado:', userProfile);
              
              // Atualizar último acesso apenas no login
              if (event === 'SIGNED_IN' && userProfile) {
                setTimeout(() => updateLastAccess(), 1000);
              }
            }
          } catch (error) {
            console.error('❌ Erro ao carregar perfil:', error);
          } finally {
            if (mounted) {
              clearTimeout(loadingTimeout);
              setIsLoading(false);
            }
          }
        } else {
          console.log('🚪 Sessão removida, limpando estados...');
          setSession(null);
          setUser(null);
          setProfile(null);
          clearTimeout(loadingTimeout);
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('🔍 Verificando sessão existente:', session?.user?.email);
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        setLoadingTimeout(); // Iniciar timeout
        
        try {
          const userProfile = await loadUserProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            console.log('✅ Perfil carregado na inicialização:', userProfile);
          }
        } catch (error) {
          console.error('❌ Erro ao carregar perfil na inicialização:', error);
        } finally {
          if (mounted) {
            clearTimeout(loadingTimeout);
            setIsLoading(false);
          }
        }
      } else {
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      if (loadingTimeout) clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Verificações de papel - calculadas apenas quando profile existe e carregamento terminou
  const isSuperAdmin = !isLoading && profile 
    ? profile.role === 'super_admin' && profile.nivel_acesso === 'super_admin' && profile.empresa_id === null
    : false;
    
  const isGlobalAdmin = !isLoading && profile 
    ? (profile.role === 'admin' || profile.role === 'super_admin') && profile.empresa_id === null
    : false;
    
  const isCompanyUser = !isLoading && profile 
    ? profile.empresa_id !== null
    : false;
    
  const isAuthenticated = !isLoading && !!user && !!profile;
  const needsPasswordChange = !isLoading && profile?.primeiro_acesso_concluido === false && isCompanyUser;

  // Log detalhado para debug
  console.log('🔍 Auth Debug State:', {
    isLoading,
    isAuthenticated,
    isSuperAdmin,
    isGlobalAdmin,
    isCompanyUser,
    hasUser: !!user,
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileEmpresaId: profile?.empresa_id,
    profileNivelAcesso: profile?.nivel_acesso,
    userEmail: user?.email,
    authUserId: user?.id
  });

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    needsPasswordChange,
    signIn,
    signOut,
    isSuperAdmin,
    isGlobalAdmin,
    isCompanyUser,
    updateLastAccess,
    markFirstAccessComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
