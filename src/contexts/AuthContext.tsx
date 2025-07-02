
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
  const [retryCount, setRetryCount] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Carregar perfil com retry e fallback
  const loadUserProfile = async (userId: string, attempt: number = 1): Promise<UserProfile | null> => {
    const maxRetries = 3;
    const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff

    try {
      console.log(`🔍 Tentativa ${attempt} de carregamento do perfil para usuário:`, userId);
      
      // Primeiro, tentar carregar o perfil normalmente
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();

      if (error) {
        console.error(`❌ Erro na tentativa ${attempt}:`, error);
        
        if (attempt < maxRetries) {
          console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return loadUserProfile(userId, attempt + 1);
        }
        
        // Se todas as tentativas falharam, tentar modo de emergência
        console.log('🚨 Tentando modo de emergência...');
        return tryEmergencyProfileLoad(userId);
      }

      if (!data) {
        console.log('⚠️ Nenhum perfil encontrado, tentando modo de emergência...');
        return tryEmergencyProfileLoad(userId);
      }

      console.log('✅ Perfil carregado com sucesso:', data);
      setRetryCount(0); // Reset retry count on success
      return data as UserProfile;

    } catch (error) {
      console.error(`❌ Erro inesperado na tentativa ${attempt}:`, error);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return loadUserProfile(userId, attempt + 1);
      }
      
      return tryEmergencyProfileLoad(userId);
    }
  };

  // Modo de emergência - criar perfil temporário para super admin
  const tryEmergencyProfileLoad = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🚨 Ativando modo de emergência...');
      
      // Verificar se o usuário logado é o super admin pelo email
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser?.email === 'andreey.siilva@icloud.com') {
        console.log('🛡️ Super admin detectado, criando perfil de emergência...');
        
        const emergencyProfile: UserProfile = {
          id: userId,
          nome: 'Administrador Principal (Emergência)',
          email: authUser.email,
          role: 'super_admin',
          nivel_acesso: 'super_admin',
          empresa_id: null,
          ativo: true,
          ultimo_acesso: new Date().toISOString(),
          primeiro_acesso_concluido: true
        };
        
        setEmergencyMode(true);
        toast.warning('Modo de emergência ativado - Algumas funcionalidades podem estar limitadas');
        
        return emergencyProfile;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Falha no modo de emergência:', error);
      return null;
    }
  };

  // Atualizar último acesso
  const updateLastAccess = async () => {
    if (emergencyMode) {
      console.log('⚠️ Modo de emergência - pulando atualização de último acesso');
      return;
    }
    
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
    if (emergencyMode) {
      console.log('⚠️ Modo de emergência - pulando marcação de primeiro acesso');
      return;
    }
    
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

  // Função de login melhorada
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login para:', email);
      setRetryCount(0);
      setEmergencyMode(false);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro de autenticação:', error);
        
        // Mensagens de erro mais específicas
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
      setEmergencyMode(false);
      setRetryCount(0);
      
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

    // Timeout de segurança mais longo
    const setLoadingTimeout = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      loadingTimeout = setTimeout(() => {
        if (mounted) {
          console.log('⏰ Timeout de loading atingido');
          setIsLoading(false);
        }
      }, 15000); // 15 segundos timeout
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
          setLoadingTimeout();
          
          try {
            const userProfile = await loadUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
              console.log('✅ Perfil carregado:', userProfile);
              
              // Atualizar último acesso apenas no login
              if (event === 'SIGNED_IN' && userProfile && !emergencyMode) {
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
          setEmergencyMode(false);
          setRetryCount(0);
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
        setLoadingTimeout();
        
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

  // Verificações de papel - melhoradas com fallbacks
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
    authUserId: user?.id,
    emergencyMode,
    retryCount
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
