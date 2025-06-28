
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
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, userData?: { name: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isGlobalAdmin: boolean;
  isCompanyUser: boolean;
  updateLastAccess: () => Promise<void>;
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

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Atualizar último acesso após login bem-sucedido
      if (data.user) {
        setTimeout(() => updateLastAccess(), 1000);
      }

      return { error: null };
    } catch (error) {
      return { error: 'Erro inesperado no login' };
    }
  };

  // Função de registro
  const signUp = async (email: string, password: string, userData?: { name: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData || {}
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Erro inesperado no registro' };
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

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    isSuperAdmin,
    isGlobalAdmin,
    isCompanyUser,
    updateLastAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
