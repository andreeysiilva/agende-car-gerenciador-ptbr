
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboardUrl } from '@/utils/linkUtils';

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
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return null;
      }

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

  // Função de login com redirecionamento inteligente
  const signIn = async (email: string, password: string) => {
    try {
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

      // Aguardar um momento para o perfil ser carregado
      setTimeout(async () => {
        try {
          await updateLastAccess();
          
          // Carregar perfil para determinar redirecionamento
          const userProfile = await loadUserProfile(data.user.id);
          if (userProfile) {
            // Redirecionar baseado no tipo de usuário
            if (userProfile.empresa_id === null && (userProfile.role === 'admin' || userProfile.role === 'super_admin')) {
              // Admin global - redirecionar para dashboard admin
              window.location.href = getAdminDashboardUrl();
            } else if (userProfile.empresa_id !== null) {
              // Usuário de empresa - redirecionar para dashboard da empresa
              window.location.href = '/app/dashboard';
            }
          }
        } catch (error) {
          console.error('Erro no pós-login:', error);
        }
      }, 1000);

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
        // Redirecionar para a página de login
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      toast.error('Erro inesperado ao sair');
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Carregar perfil do usuário
          setTimeout(async () => {
            const userProfile = await loadUserProfile(session.user.id);
            setProfile(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id).then((userProfile) => {
          setProfile(userProfile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Verificações de papel
  const isSuperAdmin = profile?.role === 'super_admin' && profile?.nivel_acesso === 'super_admin' && profile?.empresa_id === null;
  const isGlobalAdmin = (profile?.role === 'admin' || profile?.role === 'super_admin') && profile?.empresa_id === null;
  const isCompanyUser = profile?.empresa_id !== null;
  const isAuthenticated = !!user && !!profile;
  const needsPasswordChange = profile?.primeiro_acesso_concluido === false && isCompanyUser;

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
