
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCompanyAuth } from '@/contexts/CompanyAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Lock, Mail, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import FirstAccessPasswordChange from '@/components/auth/FirstAccessPasswordChange';

const CompanyLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isAuthenticated, isLoading, clearSession, needsPasswordChange, markFirstAccessComplete } = useCompanyAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing session when component mounts
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (isAuthenticated && !isLoading && !needsPasswordChange) {
      console.log('✅ Company user authenticated, redirecting to dashboard');
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, needsPasswordChange, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    console.log('🔐 Initiating company login...', { email });
    const { error } = await signIn(email.trim(), password);
    
    if (error) {
      console.error('❌ Company login error:', error);
      toast.error(error);
    } else {
      console.log('✅ Company login successful!');
      toast.success('Login realizado com sucesso!');
    }
  };

  const handlePasswordChangeSuccess = async () => {
    await markFirstAccessComplete();
    toast.success('Bem-vindo! Senha alterada com sucesso.');
    navigate('/app/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Verificando acesso da empresa...</p>
        </div>
      </div>
    );
  }

  if (needsPasswordChange) {
    return <FirstAccessPasswordChange onSuccess={handlePasswordChangeSuccess} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
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
            
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Acesso Empresarial
            </CardTitle>
            <CardDescription className="text-gray-600">
              Entre com suas credenciais empresariais
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
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
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
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
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-2">
                Recebeu credenciais por e-mail? Use-as para fazer login.
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Acesso administrativo?
              </p>
              <Link
                to="/admin/login"
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Fazer login como administrador
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyLogin;
