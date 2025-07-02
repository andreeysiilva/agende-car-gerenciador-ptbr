
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

  // Carregar perfil do usuário
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return null;
      }

      console.log('Perfil carregado:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Erro inesperado ao carregar perfil:', error);
      return null;
    }
  };

  // Atualizar último acesso
  const updateLastAccess = async () => {
    try {
      await supabase.rpc('update_last_access');
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error);
    }
  };

  // Marcar primeiro acesso como concluído
  const markFirstAccessComplete = async () => {
    try {
      await supabase.rpc('marcar_primeiro_acesso_concluido');
      // Recarregar perfil para atualizar estado
      if (user) {
        const updatedProfile = await loadUserProfile(user.id);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Erro ao marcar primeiro acesso:', error);
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de autenticação:', error);
        return { error: 'Credenciais inválidas. Verifique seu email e senha.' };
      }

      if (!data.user) {
        return { error: 'Erro na autenticação do usuário.' };
      }

      console.log('Login bem-sucedido para:', data.user.email);

      // O carregamento do perfil será feito pelo onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
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
        // Os estados serão limpos pelo onAuthStateChange
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      toast.error('Erro inesperado ao sair');
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (session?.user) {
          console.log('Sessão ativa, carregando perfil...');
          setSession(session);
          setUser(session.user);
          
          // Carregar perfil imediatamente sem delay
          try {
            const userProfile = await loadUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
              console.log('Perfil definido:', userProfile);
              
              // Atualizar último acesso apenas no login
              if (event === 'SIGNED_IN') {
                setTimeout(() => updateLastAccess(), 1000);
              }
            }
          } catch (error) {
            console.error('Erro ao carregar perfil:', error);
          } finally {
            if (mounted) {
              setIsLoading(false);
            }
          }
        } else {
          console.log('Sessão removida, limpando estados...');
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('Verificando sessão existente:', session?.user?.email);
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        
        try {
          const userProfile = await loadUserProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            console.log('Perfil carregado na inicialização:', userProfile);
          }
        } catch (error) {
          console.error('Erro ao carregar perfil na inicialização:', error);
        }
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Verificações de papel - só calculadas quando profile existe
  const isSuperAdmin = profile?.role === 'super_admin' && profile?.nivel_acesso === 'super_admin' && profile?.empresa_id === null;
  const isGlobalAdmin = profile ? (profile.role === 'admin' || profile.role === 'super_admin') && profile.empresa_id === null : false;
  const isCompanyUser = profile?.empresa_id !== null;
  const isAuthenticated = !!user && !!profile;
  const needsPasswordChange = profile?.primeiro_acesso_concluido === false && isCompanyUser;

  // Log para debug
  console.log('Auth state:', {
    isAuthenticated,
    isLoading,
    isSuperAdmin,
    isGlobalAdmin,
    isCompanyUser,
    profileRole: profile?.role,
    profileEmpresaId: profile?.empresa_id
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
