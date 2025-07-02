
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Tipos simplificados
interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: 'super_admin' | 'admin' | 'funcionario' | 'moderador' | 'suporte';
  nivel_acesso: 'super_admin' | 'admin' | 'moderador' | 'suporte';
  empresa_id: string | null;
  ativo: boolean;
  primeiro_acesso_concluido: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isCompanyUser: boolean;
  updateLastAccess: () => Promise<void>;
  markFirstAccessComplete: () => Promise<void>;
  needsPasswordChange: boolean;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Carregar perfil do usuário
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Carregando perfil para usuário:', userId);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao carregar perfil:', error);
        return null;
      }

      console.log('✅ Perfil carregado:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar perfil:', error);
      return null;
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login para:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro de autenticação:', error);
        setIsLoading(false);
        
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
        setIsLoading(false);
        return { error: 'Erro na autenticação do usuário.' };
      }

      console.log('✅ Login bem-sucedido para:', data.user.email);
      // O perfil será carregado pelo listener do onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      setIsLoading(false);
      return { error: 'Erro interno do sistema. Tente novamente.' };
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        toast.error('Erro ao sair do sistema');
      } else {
        console.log('✅ Logout realizado com sucesso');
        toast.success('Logout realizado com sucesso');
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      toast.error('Erro inesperado ao sair');
    } finally {
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
      } else if (user) {
        const updatedProfile = await loadUserProfile(user.id);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Erro inesperado ao marcar primeiro acesso:', error);
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'N/A');
        
        if (!mounted) return;

        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Carregar perfil apenas quando necessário
          if (event === 'SIGNED_IN') {
            console.log('📝 Carregando perfil após login...');
            const userProfile = await loadUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
              
              // Atualizar último acesso apenas no login
              if (userProfile) {
                setTimeout(() => updateLastAccess(), 1000);
              }
            }
          }
          
          setIsLoading(false);
        } else {
          console.log('🚪 Usuário desconectado');
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('🔍 Verificando sessão existente:', session?.user?.email || 'Nenhuma');
      
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        
        console.log('📋 Carregando perfil da sessão existente...');
        const userProfile = await loadUserProfile(session.user.id);
        if (mounted) {
          setProfile(userProfile);
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

  // Verificações de papel
  const isSuperAdmin = profile 
    ? profile.role === 'super_admin' && profile.nivel_acesso === 'super_admin'
    : false;
    
  const isCompanyUser = profile 
    ? profile.empresa_id !== null
    : false;
    
  const isAuthenticated = !!user && !!profile;
  const needsPasswordChange = profile?.primeiro_acesso_concluido === false && isCompanyUser;

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    isSuperAdmin,
    isCompanyUser,
    updateLastAccess,
    markFirstAccessComplete,
    needsPasswordChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
