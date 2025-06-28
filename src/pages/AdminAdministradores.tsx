
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Key, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Administrator {
  id: string;
  nome: string;
  email: string;
  role: string;
  nivel_acesso: string;
  ativo: boolean;
  ultimo_acesso: string | null;
  created_at: string;
}

const AdminAdministradores: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    nivel_acesso: 'admin',
    ativo: true
  });

  // Verificar se é super admin
  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Apenas super administradores podem acessar esta seção.</p>
        </div>
      </div>
    );
  }

  // Carregar administradores
  const loadAdministrators = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .is('empresa_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar administradores:', error);
        toast.error('Erro ao carregar administradores');
        return;
      }

      setAdministrators(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdministrators();
  }, []);

  // Filtrar administradores
  const filteredAdministrators = administrators.filter(admin => {
    const matchesSearch = admin.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || admin.nivel_acesso === filterLevel;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && admin.ativo) ||
                         (filterStatus === 'inactive' && !admin.ativo);
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Criar/Editar administrador
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAdmin) {
        // Editar administrador existente
        const { error } = await supabase
          .from('usuarios')
          .update({
            nome: formData.nome,
            email: formData.email,
            nivel_acesso: formData.nivel_acesso,
            role: formData.nivel_acesso === 'super_admin' ? 'super_admin' : 'admin',
            ativo: formData.ativo
          })
          .eq('id', editingAdmin.id);

        if (error) throw error;
        toast.success('Administrador atualizado com sucesso!');
      } else {
        // Criar novo administrador
        const { error } = await supabase
          .from('usuarios')
          .insert({
            nome: formData.nome,
            email: formData.email,
            nivel_acesso: formData.nivel_acesso,
            role: formData.nivel_acesso === 'super_admin' ? 'super_admin' : 'admin',
            ativo: formData.ativo,
            empresa_id: null
          });

        if (error) throw error;
        toast.success('Administrador criado com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      loadAdministrators();
    } catch (error: any) {
      console.error('Erro ao salvar administrador:', error);
      toast.error(`Erro ao salvar: ${error.message}`);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      password: '',
      nivel_acesso: 'admin',
      ativo: true
    });
    setEditingAdmin(null);
  };

  // Editar administrador
  const handleEdit = (admin: Administrator) => {
    setEditingAdmin(admin);
    setFormData({
      nome: admin.nome,
      email: admin.email,
      password: '',
      nivel_acesso: admin.nivel_acesso,
      ativo: admin.ativo
    });
    setIsDialogOpen(true);
  };

  // Deletar administrador
  const handleDelete = async (admin: Administrator) => {
    if (!confirm('Tem certeza que deseja deletar este administrador?')) return;

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', admin.id);

      if (error) throw error;
      
      toast.success('Administrador deletado com sucesso!');
      loadAdministrators();
    } catch (error: any) {
      console.error('Erro ao deletar administrador:', error);
      toast.error(`Erro ao deletar: ${error.message}`);
    }
  };

  // Toggle status
  const toggleStatus = async (admin: Administrator) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: !admin.ativo })
        .eq('id', admin.id);

      if (error) throw error;
      
      toast.success(`Administrador ${!admin.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      loadAdministrators();
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      toast.error(`Erro ao alterar status: ${error.message}`);
    }
  };

  const getNivelBadge = (nivel: string) => {
    const variants = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-blue-100 text-blue-800',
      moderador: 'bg-yellow-100 text-yellow-800',
      suporte: 'bg-green-100 text-green-800'
    };

    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      moderador: 'Moderador',
      suporte: 'Suporte'
    };

    return (
      <Badge className={variants[nivel as keyof typeof variants]}>
        {labels[nivel as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administradores</h1>
          <p className="text-gray-600">Gerencie administradores do sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAdmin ? 'Editar Administrador' : 'Novo Administrador'}
              </DialogTitle>
              <DialogDescription>
                {editingAdmin 
                  ? 'Edite as informações do administrador'
                  : 'Preencha os dados para criar um novo administrador'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nivel_acesso">Nível de Acesso</Label>
                <Select value={formData.nivel_acesso} onValueChange={(value) => setFormData({...formData, nivel_acesso: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderador">Moderador</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAdmin ? 'Salvar Alterações' : 'Criar Administrador'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="filterLevel">Nível</Label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderador">Moderador</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filterStatus">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de administradores */}
      <Card>
        <CardHeader>
          <CardTitle>Administradores ({filteredAdministrators.length})</CardTitle>
          <CardDescription>
            Lista de todos os administradores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdministrators.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.nome}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getNivelBadge(admin.nivel_acesso)}</TableCell>
                    <TableCell>
                      <Badge variant={admin.ativo ? "default" : "secondary"}>
                        {admin.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.ultimo_acesso 
                        ? format(new Date(admin.ultimo_acesso), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        : 'Nunca'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(admin)}
                        >
                          {admin.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(admin)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!isLoading && filteredAdministrators.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum administrador encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdministradores;
