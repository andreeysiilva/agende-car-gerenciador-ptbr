
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface CompanyProfile {
  id: string;
  auth_user_id: string;
  nome: string;
  email: string;
  role: 'admin' | 'funcionario';
  nivel_acesso: 'admin' | 'moderador' | 'suporte';
  empresa_id: string;
  ativo: boolean;
  primeiro_acesso_concluido: boolean;
}

interface CompanyAuthContextType {
  user: User | null;
  profile: CompanyProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  clearSession: () => Promise<void>;
  needsPasswordChange: boolean;
  markFirstAccessComplete: () => Promise<void>;
}

const CompanyAuthContext = createContext<CompanyAuthContextType | undefined>(undefined);

export const useCompanyAuth = () => {
  const context = useContext(CompanyAuthContext);
  if (context === undefined) {
    throw new Error('useCompanyAuth must be used within a CompanyAuthProvider');
  }
  return context;
};

export const CompanyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
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

  const loadCompanyProfile = async (userId: string): Promise<CompanyProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .not('empresa_id', 'is', null)
        .single();

      if (error || !data) {
        console.error('User is not a company user:', error);
        await clearSession();
        return null;
      }

      return data as CompanyProfile;
    } catch (error) {
      console.error('Error loading company profile:', error);
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
          return { error: 'Email ou senha incorretos.' };
        }
        
        return { error: 'Erro na autenticação.' };
      }

      if (!data.user) {
        setIsLoading(false);
        return { error: 'Erro na autenticação do usuário.' };
      }

      // Verify user belongs to a company
      const companyProfile = await loadCompanyProfile(data.user.id);
      if (!companyProfile) {
        await clearSession();
        setIsLoading(false);
        return { error: 'Usuário não pertence a nenhuma empresa.' };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error in company login:', error);
      setIsLoading(false);
      return { error: 'Erro interno do sistema.' };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await clearSession();
    } catch (error) {
      console.error('Error in company logout:', error);
      toast.error('Erro ao sair do sistema');
    } finally {
      setIsLoading(false);
    }
  };

  const markFirstAccessComplete = async () => {
    try {
      const { error } = await supabase.rpc('marcar_primeiro_acesso_concluido');
      if (error) {
        console.error('Error marking first access:', error);
      } else if (user) {
        const updatedProfile = await loadCompanyProfile(user.id);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Unexpected error marking first access:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Company Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          const companyProfile = await loadCompanyProfile(session.user.id);
          if (mounted && companyProfile) {
            setProfile(companyProfile);
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
        const companyProfile = await loadCompanyProfile(session.user.id);
        if (mounted && companyProfile) {
          setProfile(companyProfile);
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
  const needsPasswordChange = profile?.primeiro_acesso_concluido === false && isAuthenticated;

  console.log('👤 Company Auth State:', {
    email: profile?.email,
    role: profile?.role,
    empresa_id: profile?.empresa_id,
    isAuthenticated,
    needsPasswordChange
  });

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    clearSession,
    needsPasswordChange,
    markFirstAccessComplete,
  };

  return <CompanyAuthContext.Provider value={value}>{children}</CompanyAuthContext.Provider>;
};
