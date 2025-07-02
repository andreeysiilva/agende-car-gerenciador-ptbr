
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AdminProfile {
  id: string;
  auth_user_id: string;
  nome: string;
  email: string;
  role: 'super_admin';
  nivel_acesso: 'super_admin';
  empresa_id: null;
  ativo: boolean;
}

interface AdminAuthContextType {
  user: User | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  clearSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  const loadAdminProfile = async (userId: string): Promise<AdminProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('role', 'super_admin')
        .eq('nivel_acesso', 'super_admin')
        .single();

      if (error || !data) {
        console.error('User is not a super admin:', error);
        await clearSession();
        return null;
      }

      return data as AdminProfile;
    } catch (error) {
      console.error('Error loading admin profile:', error);
      await clearSession();
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Clear any existing session first
      await clearSession();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou senha incorretos para administrador.' };
        }
        
        return { error: 'Erro na autenticação de administrador.' };
      }

      if (!data.user) {
        setIsLoading(false);
        return { error: 'Erro na autenticação do usuário.' };
      }

      // Verify user is admin
      const adminProfile = await loadAdminProfile(data.user.id);
      if (!adminProfile) {
        await clearSession();
        setIsLoading(false);
        return { error: 'Usuário não é um administrador do sistema.' };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error in admin login:', error);
      setIsLoading(false);
      return { error: 'Erro interno do sistema.' };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await clearSession();
    } catch (error) {
      console.error('Error in admin logout:', error);
      toast.error('Erro ao sair do sistema');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Admin Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          const adminProfile = await loadAdminProfile(session.user.id);
          if (mounted && adminProfile) {
            setProfile(adminProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        const adminProfile = await loadAdminProfile(session.user.id);
        if (mounted && adminProfile) {
          setProfile(adminProfile);
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

  const isAuthenticated = !!user && !!profile;

  console.log('👤 Admin Auth State:', {
    email: profile?.email,
    role: profile?.role,
    isAuthenticated
  });

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    clearSession,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
