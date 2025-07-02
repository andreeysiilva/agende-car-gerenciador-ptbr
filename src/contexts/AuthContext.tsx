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
  forceReloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Timeout para carregamento de perfil
const PROFILE_LOAD_TIMEOUT = 10000; // 10 segundos

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar perfil com timeout e retry
  const loadUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    try {
      console.log(`🔍 Tentativa ${retryCount + 1} de carregamento do perfil para usuário:`, userId);
      
      // Timeout de 5 segundos para a query
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na consulta do perfil')), 5000);
      });

      const profilePromise = supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

      if (error) {
        console.error('❌ Erro ao carregar perfil:', error);
        
        // Se for super admin e não encontrar perfil, criar modo de emergência
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser?.email === 'andreey.siilva@icloud.com' && retryCount < 2) {
          console.log('🛡️ Tentando modo de emergência para super admin...');
          
          // Tentar criar o registro se não existir
          const { error: insertError } = await supabase
            .from('usuarios')
            .upsert({
              nome: 'Administrador Principal',
              email: authUser.email,
              role: 'super_admin',
              nivel_acesso: 'super_admin',
              empresa_id: null,
              ativo: true,
              primeiro_acesso_concluido: true,
              auth_user_id: userId
            }, { onConflict: 'email' });

          if (!insertError) {
            console.log('✅ Registro criado, tentando carregar novamente...');
            // Esperar um pouco e tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000));
            return await loadUserProfile(userId, retryCount + 1);
          }
        }
        
        return null;
      }

      console.log('✅ Perfil carregado com sucesso:', data);
      return data as UserProfile;

    } catch (error) {
      console.error('❌ Erro inesperado ao carregar perfil:', error);
      
      // Se timeout e é super admin, usar modo de emergência
      if (error instanceof Error && error.message.includes('Timeout')) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser?.email === 'andreey.siilva@icloud.com') {
          console.log('🛡️ Timeout detectado, usando perfil de emergência...');
          
          const emergencyProfile: UserProfile = {
            id: userId,
            nome: 'Administrador Principal',
            email: authUser.email,
            role: 'super_admin',
            nivel_acesso: 'super_admin',
            empresa_id: null,
            ativo: true,
            ultimo_acesso: new Date().toISOString(),
            primeiro_acesso_concluido: true
          };
          
          toast.warning('Sistema carregado em modo de emergência');
          return emergencyProfile;
        }
      }
      
      return null;
    }
  };

  // Função para forçar recarga do perfil
  const forceReloadProfile = async () => {
    if (user) {
      setIsLoading(true);
      const updatedProfile = await loadUserProfile(user.id);
      setProfile(updatedProfile);
      setIsLoading(false);
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
        
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou senha incorretos. Verifique suas credenciais.' };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: 'Email não confirmado. Verifique sua caixa de entrada.' };
        } else if (error.message.includes('Too many requests')) {
          return { error: 'Muitas tentativas de login. Aguarde alguns minutos.' };
        }
        
        return { error: 'Erro na autenticação. Tente novamente.' };
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
    let loadingTimeout: NodeJS.Timeout | null = null;

    // Timeout global de loading
    const setLoadingTimeout = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      loadingTimeout = setTimeout(() => {
        if (mounted) {
          console.log('⏰ Timeout de loading atingido');
          setIsLoading(false);
        }
      }, PROFILE_LOAD_TIMEOUT);
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
          setIsLoading(true);
          
          // Definir timeout
          setLoadingTimeout();
          
          // Carregar perfil
          const userProfile = await loadUserProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            setIsLoading(false);
            
            if (loadingTimeout) {
              clearTimeout(loadingTimeout);
              loadingTimeout = null;
            }
            
            console.log('✅ Perfil carregado:', userProfile);
            
            // Atualizar último acesso apenas no login
            if (event === 'SIGNED_IN' && userProfile) {
              setTimeout(() => updateLastAccess(), 1000);
            }
          }
        } else {
          console.log('🚪 Sessão removida, limpando estados...');
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
          }
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
        setIsLoading(true);
        
        // Definir timeout
        setLoadingTimeout();
        
        const userProfile = await loadUserProfile(session.user.id);
        if (mounted) {
          setProfile(userProfile);
          setIsLoading(false);
          
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
          }
          
          console.log('✅ Perfil carregado na inicialização:', userProfile);
        }
      } else {
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      subscription.unsubscribe();
    };
  }, []);

  // Verificações de papel
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
    forceReloadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
