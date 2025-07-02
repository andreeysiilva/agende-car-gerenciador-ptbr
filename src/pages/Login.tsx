
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { getClientLoginUrl } from '@/utils/linkUtils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, isAuthenticated, isGlobalAdmin, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirecionar usuários já autenticados
  useEffect(() => {
    console.log('🔍 Login useEffect - Auth state:', { 
      authLoading, 
      isAuthenticated, 
      isGlobalAdmin, 
      hasProfile: !!profile,
      profileRole: profile?.role,
      profileEmail: profile?.email
    });
    
    if (!authLoading && isAuthenticated && isGlobalAdmin && profile) {
      console.log('✅ Redirecionando admin global para dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, isGlobalAdmin, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Tentando fazer login...');
      const { error } = await signIn(email.trim(), password);
      
      if (error) {
        console.error('❌ Erro no login:', error);
        toast.error(error);
      } else {
        console.log('✅ Login bem-sucedido, aguardando carregamento do perfil...');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      toast.error('Erro interno do sistema. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
              <Car className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-text-primary">
              Painel Administrativo
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Acesse o painel de administração do AgendiCar
            </CardDescription>
            
            {/* Status do Sistema */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Sistema pronto</span>
            </div>
            
            {/* Debug Info apenas quando necessário */}
            {authLoading && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-left">
                <p className="font-semibold text-blue-700 mb-2">Carregando sistema...</p>
                <div className="space-y-1 text-blue-600">
                  <p>• Auth Loading: {authLoading ? '✓' : '✗'}</p>
                  <p>• Usuário Autenticado: {isAuthenticated ? '✓' : '✗'}</p>
                  <p>• Perfil Carregado: {!!profile ? '✓' : '✗'}</p>
                  {profile && <p>• Papel: {profile.role}</p>}
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
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
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Carregando sistema...
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-center space-y-2">
                <Button
                  variant="link"
                  className="text-sm text-secondary hover:text-secondary-hover underline p-0"
                  onClick={() => navigate(getClientLoginUrl())}
                >
                  Acessar como empresa/cliente
                </Button>
                <br />
                <Button
                  variant="link"
                  className="text-sm text-text-secondary hover:text-text-primary underline p-0"
                  onClick={() => navigate('/')}
                >
                  Voltar ao site
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
