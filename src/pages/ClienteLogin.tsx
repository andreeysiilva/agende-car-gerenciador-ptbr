
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

// Página de login para clientes (empresas)
const ClienteLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needPasswordReset, setNeedPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verificar credenciais demo
      if (email === 'demonstracao' && password === 'demo1234') {
        toast.success('Login demo realizado com sucesso!');
        navigate('/cliente');
        return;
      }

      // Simular verificação de senha temporária
      if (password.length === 6 && /^\d+$/.test(password)) {
        toast.success('Senha temporária aceita! Configure sua nova senha.');
        setNeedPasswordReset(true);
        return;
      }

      // Login normal (seria integrado com Supabase)
      toast.error('Credenciais inválidas. Verifique email e senha.');
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para redefinir senha
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      // Aqui seria implementada a integração com Supabase
      console.log('Nova senha definida:', newPassword);
      toast.success('Senha alterada com sucesso!');
      navigate('/cliente');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
              AgendiCar
            </CardTitle>
            <CardDescription className="text-text-secondary">
              {needPasswordReset ? 'Configure sua nova senha' : 'Acesse o painel da sua empresa'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!needPasswordReset ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-primary font-medium">
                    E-mail ou Nome de Usuário
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="seu@email.com ou demonstracao"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-text-primary font-medium">
                    Senha ou Código Temporário
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha ou código de 6 dígitos"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10"
                      disabled={isLoading}
                    />
                  </div>
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
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-text-primary font-medium">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Digite sua nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-11 pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-text-primary font-medium">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-secondary hover:bg-secondary-hover text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Alterando...
                    </div>
                  ) : (
                    'Alterar Senha'
                  )}
                </Button>
              </form>
            )}
            
            <div className="mt-8 pt-6 border-t border-border">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">Acesso Demo:</h4>
                <p className="text-sm text-text-secondary">
                  <strong>Usuário:</strong> demonstracao<br />
                  <strong>Senha:</strong> demo1234
                </p>
              </div>
              
              {!needPasswordReset && (
                <div className="mt-4 text-center space-y-2">
                  <p className="text-xs text-text-secondary">
                    Recebeu um código de 6 dígitos via Telegram? Use-o como senha.
                  </p>
                  <a 
                    href="/login"
                    className="text-sm text-primary hover:text-primary-hover underline block"
                  >
                    Acessar como administrador
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClienteLogin;
