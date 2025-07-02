
import { useState } from 'react';
import { Empresa } from '@/types/empresa';

export function useEmpresaModals() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [excluirDialogOpen, setExcluirDialogOpen] = useState(false);

  const openCreateDialog = () => setDialogOpen(true);
  const closeCreateDialog = () => setDialogOpen(false);

  const openVisualizarModal = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    setVisualizarModalOpen(true);
  };

  const closeVisualizarModal = () => {
    setVisualizarModalOpen(false);
    setEmpresaSelecionada(null);
  };

  const openEditarModal = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    setEditarModalOpen(true);
    setVisualizarModalOpen(false);
  };

  const closeEditarModal = () => {
    setEditarModalOpen(false);
    setEmpresaSelecionada(null);
  };

  const openExcluirDialog = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    setExcluirDialogOpen(true);
    setVisualizarModalOpen(false);
  };

  const closeExcluirDialog = () => {
    setExcluirDialogOpen(false);
    setEmpresaSelecionada(null);
  };

  return {
    // Estado
    dialogOpen,
    empresaSelecionada,
    visualizarModalOpen,
    editarModalOpen,
    excluirDialogOpen,
    
    // Ações
    openCreateDialog,
    closeCreateDialog,
    openVisualizarModal,
    closeVisualizarModal,
    openEditarModal,
    closeEditarModal,
    openExcluirDialog,
    closeExcluirDialog
  };
}
