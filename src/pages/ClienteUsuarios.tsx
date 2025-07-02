
import React, { useState } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types/usuario';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Users, Shield, Eye, Edit, Trash2, RotateCcw } from 'lucide-react';
import UsuarioForm from '@/components/forms/UsuarioForm';
import { toast } from 'sonner';

const ClienteUsuarios: React.FC = () => {
  const {
    usuarios,
    isLoading,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    resetarSenha,
    recarregarUsuarios
  } = useUsuarios();

  // Estados para modais
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState<string | null>(null);

  const handleCriarUsuario = async (dadosUsuario: any) => {
    setIsCreating(true);
    try {
      const result = await criarUsuario(dadosUsuario);
      if (result) {
        setDialogOpen(false);
        // Mostrar a senha temporária para o administrador
        toast.success(
          `Usuário criado! Senha temporária: ${result.senhaTemporaria}`,
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleExcluirUsuario = async (usuario: Usuario) => {
    setIsDeleting(true);
    try {
      const success = await deletarUsuario(usuario.id);
      if (success) {
        setUsuarioParaExcluir(null);
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetarSenha = async (usuario: Usuario) => {
    setIsResettingPassword(usuario.id);
    try {
      await resetarSenha(usuario.email);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
    } finally {
      setIsResettingPassword(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'admin_empresa': { label: 'Admin', variant: 'default' as const },
      'gerente': { label: 'Gerente', variant: 'secondary' as const },
      'funcionario': { label: 'Funcionário', variant: 'outline' as const },
      'atendente': { label: 'Atendente', variant: 'outline' as const },
      'visualizador': { label: 'Visualizador', variant: 'secondary' as const }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || 
                  { label: role, variant: 'outline' as const };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (ativo: boolean, primeiroAcesso: boolean) => {
    if (!ativo) {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    if (!primeiroAcesso) {
      return <Badge variant="outline">Pendente</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários da sua empresa</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <UsuarioForm
              onSubmit={handleCriarUsuario}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usuarios.filter(u => u.ativo && u.primeiro_acesso_concluido).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primeiro Acesso Pendente</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usuarios.filter(u => u.ativo && !u.primeiro_acesso_concluido).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usuarios && usuarios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Nível de Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{getRoleBadge(usuario.role_empresa)}</TableCell>
                    <TableCell>
                      {getStatusBadge(usuario.ativo, usuario.primeiro_acesso_concluido)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResetarSenha(usuario)}
                          disabled={isResettingPassword === usuario.id}
                          title="Resetar senha"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        
                        {usuario.role_empresa !== 'admin_empresa' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setUsuarioParaExcluir(usuario)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong>?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleExcluirUsuario(usuario)}
                                  disabled={isDeleting}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário cadastrado</h3>
              <p className="text-gray-600 mb-4">Crie o primeiro usuário da sua equipe</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Usuário
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteUsuarios;
