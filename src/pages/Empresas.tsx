
import React, { useState } from 'react';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Building, Users, Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EmpresaForm from '@/components/forms/EmpresaForm';
import VisualizarEmpresaModal from '@/components/empresa/VisualizarEmpresaModal';
import EditarEmpresaModal from '@/components/empresa/EditarEmpresaModal';
import ExcluirEmpresaDialog from '@/components/empresa/ExcluirEmpresaDialog';
import { Empresa } from '@/types/empresa';
import { toast } from 'sonner';

// Mock data for planos - em produção viria do backend
const mockPlanos = [
  { nome: 'Básico', preco: 29.90 },
  { nome: 'Profissional', preco: 59.90 },
  { nome: 'Premium', preco: 99.90 },
  { nome: 'Enterprise', preco: 199.90 }
];

const Empresas: React.FC = () => {
  const { 
    empresas, 
    isLoading, 
    criarEmpresa, 
    atualizarEmpresa, 
    deletarEmpresa, 
    buscarEmpresaPorId, 
    recarregarEmpresas 
  } = useEmpresas();
  
  // Estados para modais
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [excluirDialogOpen, setExcluirDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCriarEmpresa = async (dadosEmpresa: any) => {
    setIsCreating(true);
    try {
      const result = await criarEmpresa(dadosEmpresa);
      if (result) {
        setDialogOpen(false);
        await recarregarEmpresas();
      }
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleVisualizarEmpresa = async (empresaId: string) => {
    const empresa = await buscarEmpresaPorId(empresaId);
    if (empresa) {
      setEmpresaSelecionada(empresa);
      setVisualizarModalOpen(true);
    }
  };

  const handleEditarEmpresa = async (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    setEditarModalOpen(true);
    setVisualizarModalOpen(false);
  };

  const handleSalvarEdicao = async (empresaId: string, dadosAtualizados: Partial<Empresa>) => {
    setIsEditing(true);
    try {
      const empresaAtualizada = await atualizarEmpresa(empresaId, dadosAtualizados);
      if (empresaAtualizada) {
        setEditarModalOpen(false);
        setEmpresaSelecionada(null);
        await recarregarEmpresas();
      }
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleExcluirEmpresa = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    setExcluirDialogOpen(true);
    setVisualizarModalOpen(false);
  };

  const handleConfirmarExclusao = async (empresaId: string) => {
    setIsDeleting(true);
    try {
      const success = await deletarEmpresa(empresaId);
      if (success) {
        setExcluirDialogOpen(false);
        setEmpresaSelecionada(null);
        await recarregarEmpresas();
      }
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge variant="default">Ativo</Badge>;
      case 'Inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'Pendente':
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCnpjCpf = (value: string) => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      // CPF: 000.000.000-00
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600">Gerencie as empresas cadastradas no sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Empresa</DialogTitle>
            </DialogHeader>
            <EmpresaForm
              onSubmit={handleCriarEmpresa}
              isLoading={isCreating}
              planos={mockPlanos}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresas?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {empresas?.filter(emp => emp.status === 'Ativo').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {empresas?.filter(emp => emp.status === 'Pendente').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.847</div>
            <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
          </CardContent>
        </Card>
      </div>

      {/* Empresas List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as empresas cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {empresas && empresas.length > 0 ? (
            <div className="space-y-4">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{empresa.nome}</h3>
                        {getStatusBadge(empresa.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>E-mail:</strong> {empresa.email}</p>
                        <p><strong>Telefone:</strong> {empresa.telefone}</p>
                        {empresa.cnpj_cpf && (
                          <p><strong>CNPJ/CPF:</strong> {formatCnpjCpf(empresa.cnpj_cpf)}</p>
                        )}
                        <p><strong>Subdomínio:</strong> {empresa.subdominio}.agendicar.com.br</p>
                        {empresa.data_vencimento && (
                          <p><strong>Vencimento:</strong> {new Date(empresa.data_vencimento).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVisualizarEmpresa(empresa.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditarEmpresa(empresa)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleExcluirEmpresa(empresa)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma empresa cadastrada</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira empresa para começar</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Empresa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <VisualizarEmpresaModal
        empresa={empresaSelecionada}
        isOpen={visualizarModalOpen}
        onClose={() => {
          setVisualizarModalOpen(false);
          setEmpresaSelecionada(null);
        }}
        onEdit={handleEditarEmpresa}
        onDelete={handleExcluirEmpresa}
      />

      <EditarEmpresaModal
        empresa={empresaSelecionada}
        isOpen={editarModalOpen}
        onClose={() => {
          setEditarModalOpen(false);
          setEmpresaSelecionada(null);
        }}
        onSave={handleSalvarEdicao}
        isLoading={isEditing}
      />

      <ExcluirEmpresaDialog
        empresa={empresaSelecionada}
        isOpen={excluirDialogOpen}
        onClose={() => {
          setExcluirDialogOpen(false);
          setEmpresaSelecionada(null);
        }}
        onConfirm={handleConfirmarExclusao}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Empresas;
