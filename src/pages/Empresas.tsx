
import React, { useState } from 'react';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useEmpresaModals } from '@/hooks/useEmpresaModals';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EmpresaForm from '@/components/forms/EmpresaForm';
import VisualizarEmpresaModal from '@/components/empresa/VisualizarEmpresaModal';
import EditarEmpresaModal from '@/components/empresa/EditarEmpresaModal';
import ExcluirEmpresaDialog from '@/components/empresa/ExcluirEmpresaDialog';
import EmpresaStatsCards from '@/components/empresa/EmpresaStatsCards';
import EmpresaList from '@/components/empresa/EmpresaList';
import { Empresa } from '@/types/empresa';

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
    recarregarEmpresas,
    reenviarCredenciais
  } = useEmpresas();
  
  const {
    dialogOpen,
    empresaSelecionada,
    visualizarModalOpen,
    editarModalOpen,
    excluirDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    openVisualizarModal,
    closeVisualizarModal,
    openEditarModal,
    closeEditarModal,
    openExcluirDialog,
    closeExcluirDialog
  } = useEmpresaModals();
  
  // Estados para loading
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReenviandoCredenciais, setIsReenviandoCredenciais] = useState(false);

  const handleCriarEmpresa = async (dadosEmpresa: any) => {
    setIsCreating(true);
    try {
      const result = await criarEmpresa(dadosEmpresa);
      if (result) {
        closeCreateDialog();
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
      openVisualizarModal(empresa);
    }
  };

  const handleSalvarEdicao = async (empresaId: string, dadosAtualizados: Partial<Empresa>) => {
    setIsEditing(true);
    try {
      const empresaAtualizada = await atualizarEmpresa(empresaId, dadosAtualizados);
      if (empresaAtualizada) {
        closeEditarModal();
        await recarregarEmpresas();
      }
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleConfirmarExclusao = async (empresaId: string) => {
    setIsDeleting(true);
    try {
      const success = await deletarEmpresa(empresaId);
      if (success) {
        closeExcluirDialog();
        await recarregarEmpresas();
      }
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReenviarCredenciais = async (empresa: Empresa) => {
    setIsReenviandoCredenciais(true);
    try {
      const success = await reenviarCredenciais(empresa.id);
      if (success) {
        // Sucesso já é tratado no serviço com toast
      }
    } catch (error) {
      console.error('Erro ao reenviar credenciais:', error);
    } finally {
      setIsReenviandoCredenciais(false);
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
        
        <Dialog open={dialogOpen} onOpenChange={closeCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover" onClick={openCreateDialog}>
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

      <EmpresaStatsCards empresas={empresas} />

      <EmpresaList
        empresas={empresas}
        onVisualizarEmpresa={handleVisualizarEmpresa}
        onEditarEmpresa={openEditarModal}
        onExcluirEmpresa={openExcluirDialog}
        onCreateEmpresa={openCreateDialog}
      />

      <VisualizarEmpresaModal
        empresa={empresaSelecionada}
        isOpen={visualizarModalOpen}
        onClose={closeVisualizarModal}
        onEdit={openEditarModal}
        onDelete={openExcluirDialog}
        onReenviarCredenciais={handleReenviarCredenciais}
        isReenviandoCredenciais={isReenviandoCredenciais}
      />

      <EditarEmpresaModal
        empresa={empresaSelecionada}
        isOpen={editarModalOpen}
        onClose={closeEditarModal}
        onSave={handleSalvarEdicao}
        isLoading={isEditing}
      />

      <ExcluirEmpresaDialog
        empresa={empresaSelecionada}
        isOpen={excluirDialogOpen}
        onClose={closeExcluirDialog}
        onConfirm={handleConfirmarExclusao}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Empresas;
