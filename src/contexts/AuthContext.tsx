
import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface para definir o tipo do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // Verificar se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Função para realizar o login do administrador
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Tentando fazer login com:', { email, password });
    
    // Validação hardcoded para o administrador - credenciais atualizadas para AgendiCar
    if (email === 'admin@agendicar.com' && password === 'admin123') {
      const userData = { email };
      
      // Salvar dados de autenticação no localStorage
      localStorage.setItem('admin_token', 'admin_authenticated');
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      console.log('Login realizado com sucesso');
      return true;
    }
    
    console.log('Credenciais inválidas');
    return false;
  };

  // Função para realizar o logout
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
    console.log('Logout realizado com sucesso');
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
