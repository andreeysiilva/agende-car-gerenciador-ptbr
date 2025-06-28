
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Shield } from 'lucide-react';

const AdminConfiguracoes: React.FC = () => {
  const { profile } = useAuth();

  const getRoleLabel = (role: string, nivelAcesso?: string) => {
    if (role === 'super_admin' || nivelAcesso === 'super_admin') return 'Super Admin';
    if (role === 'admin' || nivelAcesso === 'admin') return 'Administrador';
    if (role === 'moderador' || nivelAcesso === 'moderador') return 'Moderador';
    if (role === 'suporte' || nivelAcesso === 'suporte') return 'Suporte';
    return 'Funcionário';
  };

  const getRoleBadgeVariant = (role: string, nivelAcesso?: string) => {
    if (role === 'super_admin' || nivelAcesso === 'super_admin') return 'destructive';
    if (role === 'admin' || nivelAcesso === 'admin') return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Configurações do sistema e perfil administrativo</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Perfil do Administrador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Administrador
            </CardTitle>
            <CardDescription>
              Informações do seu perfil administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <p className="text-gray-900">{profile?.nome}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{profile?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Nível de Acesso</label>
              <div className="mt-1">
                <Badge variant={getRoleBadgeVariant(profile?.role || '', profile?.nivel_acesso)}>
                  {getRoleLabel(profile?.role || '', profile?.nivel_acesso)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <Badge variant={profile?.ativo ? "default" : "secondary"}>
                  {profile?.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissões de Acesso
            </CardTitle>
            <CardDescription>
              Suas permissões atuais no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Gerenciar Empresas</span>
              <Badge variant="default">Permitido</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Gerenciar Planos</span>
              <Badge variant="default">Permitido</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Relatórios Financeiros</span>
              <Badge variant="default">Permitido</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Gerenciar Administradores</span>
              <Badge variant={profile?.nivel_acesso === 'super_admin' ? "default" : "secondary"}>
                {profile?.nivel_acesso === 'super_admin' ? 'Permitido' : 'Negado'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>
              Configurações gerais do AgendiCar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Versão do Sistema</label>
                  <p className="text-gray-900">v1.0.0</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Última Atualização</label>
                  <p className="text-gray-900">27/06/2025</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Para mais configurações avançadas ou suporte técnico, entre em contato com a equipe de desenvolvimento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
