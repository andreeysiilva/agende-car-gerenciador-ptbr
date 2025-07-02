
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Tipos simplificados
interface UserProfile {
  id: string;
  auth_user_id: string;
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
  selectedEmpresaId: string | null;
  selectEmpresa: (empresaId: string) => Promise<void>;
  availableEmpresas: any[];
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
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);
  const [availableEmpresas, setAvailableEmpresas] = useState<any[]>([]);

  // Função para verificar permissões robustamente
  const checkUserPermissions = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('debug_user_permissions', {
        p_email: null
      });

      if (error) {
        console.error('Erro ao verificar permissões:', error);
        return false;
      }

      console.log('🔍 Debug permissões:', data);
      return data?.[0]?.is_super_admin || false;
    } catch (error) {
      console.error('Erro inesperado ao verificar permissões:', error);
      return false;
    }
  };

  // Carregar perfil do usuário
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao carregar perfil:', error);
        return null;
      }

      // Verificar permissões após carregar perfil
      if (data.role === 'super_admin') {
        await checkUserPermissions(userId);
      }

      return data as UserProfile;
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar perfil:', error);
      return null;
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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

  // Carregar empresas disponíveis para super admin
  const loadAvailableEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, email, status')
        .eq('status', 'Ativo')
        .order('nome');

      if (error) {
        console.error('Erro ao carregar empresas:', error);
        return;
      }

      setAvailableEmpresas(data || []);
    } catch (error) {
      console.error('Erro inesperado ao carregar empresas:', error);
    }
  };

  // Selecionar empresa como super admin
  const selectEmpresa = async (empresaId: string) => {
    try {
      const { error } = await supabase.rpc('select_empresa_as_admin', {
        p_empresa_id: empresaId
      });

      if (error) {
        console.error('Erro ao selecionar empresa:', error);
        toast.error('Erro ao selecionar empresa');
        return;
      }

      setSelectedEmpresaId(empresaId);
      toast.success('Empresa selecionada com sucesso');
    } catch (error) {
      console.error('Erro inesperado ao selecionar empresa:', error);
      toast.error('Erro inesperado');
    }
  };

  // Carregar empresa selecionada para super admin
  const loadSelectedEmpresa = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_selected_empresa_id');
      
      if (error) {
        console.error('Erro ao carregar empresa selecionada:', error);
        return;
      }

      setSelectedEmpresaId(data);
    } catch (error) {
      console.error('Erro inesperado ao carregar empresa selecionada:', error);
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Carregar perfil
          const userProfile = await loadUserProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            
            // Atualizar último acesso apenas no login inicial
            if (event === 'SIGNED_IN' && userProfile) {
              setTimeout(() => updateLastAccess(), 100);
            }
          }
        } else {
          setUser(null);
          setProfile(null);
          setSelectedEmpresaId(null);
          setAvailableEmpresas([]);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
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

  // Verificações de papel com logging melhorado
  const isSuperAdmin = profile?.role === 'super_admin' && profile?.nivel_acesso === 'super_admin';
  const isCompanyUser = profile ? (profile.empresa_id !== null || isSuperAdmin) : false;
  const isAuthenticated = !!user && !!profile;
  const needsPasswordChange = profile?.primeiro_acesso_concluido === false && isAuthenticated;

  console.log('👤 Auth State:', {
    email: profile?.email,
    role: profile?.role,
    nivel_acesso: profile?.nivel_acesso,
    empresa_id: profile?.empresa_id,
    isSuperAdmin,
    isCompanyUser,
    isAuthenticated
  });

  // Carregar dados específicos para super admin
  useEffect(() => {
    if (isSuperAdmin) {
      loadAvailableEmpresas();
      loadSelectedEmpresa();
    }
  }, [isSuperAdmin]);

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
    selectedEmpresaId,
    selectEmpresa,
    availableEmpresas,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
