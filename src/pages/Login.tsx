
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Lock, Mail, UserCog, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import FirstAccessPasswordChange from '@/components/auth/FirstAccessPasswordChange';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = useState<'admin' | 'client'>('client');
  
  const { signIn, isAuthenticated, isSuperAdmin, isCompanyUser, profile, isLoading, needsPasswordChange, markFirstAccessComplete } = useAuth();
  const navigate = useNavigate();

  // Detectar tipo de login pela URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'admin') {
      setLoginType('admin');
    } else if (type === 'client') {
      setLoginType('client');
    }
  }, [searchParams]);

  // Redirecionar usuários já autenticados
  useEffect(() => {
    if (isAuthenticated && profile && !isLoading) {
      console.log('✅ Usuário já autenticado, redirecionando...', { isSuperAdmin, isCompanyUser });
      
      if (isSuperAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (isCompanyUser) {
        navigate('/app/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isSuperAdmin, isCompanyUser, profile, navigate, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    console.log('🔐 Iniciando login...', { email, loginType });
    const { error } = await signIn(email.trim(), password);
    
    if (error) {
      console.error('❌ Erro no login:', error);
      toast.error(error);
    } else {
      console.log('✅ Login realizado com sucesso!');
      toast.success('Login realizado com sucesso!');
    }
  };

  const handlePasswordChangeSuccess = async () => {
    await markFirstAccessComplete();
    toast.success('Bem-vindo! Senha alterada com sucesso.');
    navigate('/app/dashboard');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Mostrar loading durante verificação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  if (needsPasswordChange) {
    return <FirstAccessPasswordChange onSuccess={handlePasswordChangeSuccess} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-text-primary">
              AgendiCar
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Acesse sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'admin' | 'client')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Empresa
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="mt-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-text-secondary">
                    Acesse o painel da sua empresa
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-text-secondary">
                    Painel administrativo do sistema
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-primary font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={loginType === 'admin' ? 'admin@agendicar.com' : 'seu@email.com'}
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
                <Label htmlFor="password" className="text-text-primary font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
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
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-primary hover:text-primary-hover"
                  onClick={() => setShowForgotPassword(true)}
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-medium"
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
            
            {loginType === 'client' && (
              <div className="mt-6 pt-4 border-t border-border text-center">
                <p className="text-xs text-text-secondary mb-2">
                  Recebeu credenciais por e-mail? Use-as para fazer login.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
