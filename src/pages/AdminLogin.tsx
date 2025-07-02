
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Lock, Mail, UserCog, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isAuthenticated, isLoading, clearSession } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing session when component mounts
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('✅ Admin authenticated, redirecting to dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    console.log('🔐 Initiating admin login...', { email });
    const { error } = await signIn(email.trim(), password);
    
    if (error) {
      console.error('❌ Admin login error:', error);
      toast.error(error);
    } else {
      console.log('✅ Admin login successful!');
      toast.success('Login administrativo realizado com sucesso!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Verificando autenticação administrativa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <Link
              to="/"
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCog className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </CardTitle>
            <CardDescription className="text-gray-600">
              Acesso restrito aos administradores do sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail Administrativo
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@agendicar.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha Administrativa
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha administrativa"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-10"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  'Acessar Painel Administrativo'
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-2">
                Acesso empresarial?
              </p>
              <Link
                to="/app/login"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Fazer login como empresa
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
