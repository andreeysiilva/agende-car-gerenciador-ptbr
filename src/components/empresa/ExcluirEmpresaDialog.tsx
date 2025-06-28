
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Empresa } from '@/types/empresa';

interface ExcluirEmpresaDialogProps {
  empresa: Empresa | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (empresaId: string) => void;
  isLoading: boolean;
}

const ExcluirEmpresaDialog: React.FC<ExcluirEmpresaDialogProps> = ({
  empresa,
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  if (!empresa) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir a empresa <strong>{empresa.nome}</strong>?
            </p>
            <p className="text-sm text-red-600">
              ⚠️ Esta ação não pode ser desfeita. Todos os dados relacionados à empresa,
              incluindo agendamentos, usuários e configurações serão permanentemente removidos.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(empresa.id)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Excluindo...' : 'Excluir Empresa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExcluirEmpresaDialog;
