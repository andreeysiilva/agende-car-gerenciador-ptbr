
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { Empresa } from '@/types/empresa';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useEmpresaModals } from '@/hooks/useEmpresaModals';
import EmpresaForm from '@/components/forms/EmpresaForm';
import EmpresaList from '@/components/empresa/EmpresaList';
import EditarEmpresaModal from '@/components/empresa/EditarEmpresaModal';
import VisualizarEmpresaModal from '@/components/empresa/VisualizarEmpresaModal';
import ExcluirEmpresaDialog from '@/components/empresa/ExcluirEmpresaDialog';
import EmpresaStatsCards from '@/components/empresa/EmpresaStatsCards';
import DebugPermissions from '@/components/admin/DebugPermissions';
import { toast } from 'sonner';

const Empresas: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isCreatingEmpresa, setIsCreatingEmpresa] = useState(false);
  const [isDeletingEmpresa, setIsDeletingEmpresa] = useState(false);
  const {
    empresas,
    isLoading,
    criarEmpresa,
    atualizarEmpresa,
    deletarEmpresa,
    buscarEmpresaPorId,
    renovarPlanoEmpresa,
    recarregarEmpresas,
    reenviarCredenciais
  } = useEmpresas();

  const {
    empresaSelecionada,
    visualizarModalOpen,
    editarModalOpen,
    excluirDialogOpen,
    openVisualizarModal,
    openEditarModal,
    openExcluirDialog,
    closeVisualizarModal,
    closeEditarModal,
    closeExcluirDialog
  } = useEmpresaModals();

  // Planos mock - em uma implementação real, isso viria de um hook ou service
  const planos = [
    { nome: 'Básico', preco: 49.90 },
    { nome: 'Profissional', preco: 99.90 },
    { nome: 'Empresarial', preco: 199.90 }
  ];

  const handleCreateEmpresa = async (dadosEmpresa: any) => {
    setIsCreatingEmpresa(true);
    try {
      const result = await criarEmpresa(dadosEmpresa);
      if (result) {
        setShowForm(false);
        toast.success('Empresa criada com sucesso!');
      }
    } finally {
      setIsCreatingEmpresa(false);
    }
  };

  const handleVisualizarEmpresa = async (empresaId: string) => {
    const empresa = await buscarEmpresaPorId(empresaId);
    if (empresa) {
      openVisualizarModal(empresa);
    }
  };

  const handleEditarEmpresa = (empresa: Empresa) => {
    openEditarModal(empresa);
  };

  const handleSalvarEdicao = async (empresaId: string, dadosAtualizados: Partial<Empresa>) => {
    const empresaAtualizada = await atualizarEmpresa(empresaId, dadosAtualizados);
    if (empresaAtualizada) {
      closeEditarModal();
      toast.success('Empresa atualizada com sucesso!');
    }
  };

  const handleExcluirEmpresa = (empresa: Empresa) => {
    openExcluirDialog(empresa);
  };

  const handleConfirmarExclusao = async () => {
    if (empresaSelecionada) {
      setIsDeletingEmpresa(true);
      try {
        const sucesso = await deletarEmpresa(empresaSelecionada.id);
        if (sucesso) {
          closeExcluirDialog();
          toast.success('Empresa excluída com sucesso!');
        }
      } finally {
        setIsDeletingEmpresa(false);
      }
    }
  };

  const handleRenovarPlano = async (empresa: Empresa) => {
    const sucesso = await renovarPlanoEmpresa(empresa.id);
    if (sucesso) {
      toast.success('Plano renovado com sucesso!');
    }
  };

  const handleReenviarCredenciais = async (empresa: Empresa) => {
    const sucesso = await reenviarCredenciais(empresa.id);
    if (sucesso) {
      toast.success('Credenciais reenviadas com sucesso!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Empresas</h1>
            <p className="text-gray-600 mt-1">Administre todas as empresas do sistema</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancelar' : 'Nova Empresa'}
          </Button>
        </div>

        <DebugPermissions />

        <EmpresaStatsCards empresas={empresas} />

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Empresa</CardTitle>
              <CardDescription>
                Preencha os dados para criar uma nova empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmpresaForm 
                onSubmit={handleCreateEmpresa} 
                isLoading={isCreatingEmpresa}
                planos={planos}
              />
            </CardContent>
          </Card>
        )}

        <EmpresaList
          empresas={empresas}
          onVisualizarEmpresa={handleVisualizarEmpresa}
          onEditarEmpresa={handleEditarEmpresa}
          onExcluirEmpresa={handleExcluirEmpresa}
          onCreateEmpresa={() => setShowForm(true)}
        />

        <VisualizarEmpresaModal
          empresa={empresaSelecionada}
          isOpen={visualizarModalOpen}
          onClose={closeVisualizarModal}
          onEdit={handleEditarEmpresa}
          onDelete={handleExcluirEmpresa}
          onReenviarCredenciais={handleReenviarCredenciais}
        />

        <EditarEmpresaModal
          empresa={empresaSelecionada}
          isOpen={editarModalOpen}
          onClose={closeEditarModal}
          onSave={handleSalvarEdicao}
          isLoading={false}
        />

        <ExcluirEmpresaDialog
          empresa={empresaSelecionada}
          isOpen={excluirDialogOpen}
          onClose={closeExcluirDialog}
          onConfirm={handleConfirmarExclusao}
          isLoading={isDeletingEmpresa}
        />
      </div>
    </div>
  );
};

export default Empresas;
