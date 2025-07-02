import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Empresa } from '@/types/empresa';
import { Edit, Trash2, Building, Mail } from 'lucide-react';

interface VisualizarEmpresaModalProps {
  empresa: Empresa | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (empresa: Empresa) => void;
  onDelete: (empresa: Empresa) => void;
  onReenviarCredenciais: (empresa: Empresa) => void;
  isReenviandoCredenciais?: boolean;
}

const VisualizarEmpresaModal: React.FC<VisualizarEmpresaModalProps> = ({
  empresa,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onReenviarCredenciais,
  isReenviandoCredenciais = false
}) => {
  if (!empresa) return null;

  const formatCnpjCpf = (value: string) => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Detalhes da Empresa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com nome e status */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{empresa.nome}</h2>
              <p className="text-gray-600">{empresa.email}</p>
            </div>
            {getStatusBadge(empresa.status)}
          </div>

          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <p className="text-gray-900">{empresa.telefone}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">CNPJ/CPF</label>
              <p className="text-gray-900">{formatCnpjCpf(empresa.cnpj_cpf)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Subdomínio</label>
              <p className="text-gray-900">{empresa.subdominio}.agendicar.com.br</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Data de Ativação</label>
              <p className="text-gray-900">
                {empresa.data_ativacao 
                  ? new Date(empresa.data_ativacao).toLocaleDateString('pt-BR')
                  : 'Não definida'
                }
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Data de Vencimento</label>
              <p className="text-gray-900">
                {empresa.data_vencimento 
                  ? new Date(empresa.data_vencimento).toLocaleDateString('pt-BR')
                  : 'Não definida'
                }
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Data de Criação</label>
              <p className="text-gray-900">
                {empresa.created_at 
                  ? new Date(empresa.created_at).toLocaleDateString('pt-BR')
                  : 'Não disponível'
                }
              </p>
            </div>
          </div>

          {/* Endereço */}
          {empresa.endereco && (
            <div>
              <label className="text-sm font-medium text-gray-500">Endereço</label>
              <p className="text-gray-900">{empresa.endereco}</p>
            </div>
          )}

          {/* Informações técnicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Primeiro Acesso</label>
              <p className="text-gray-900">
                {empresa.primeiro_acesso_concluido ? 'Concluído' : 'Pendente'}
              </p>
            </div>

            {empresa.telegram_chat_id && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telegram Chat ID</label>
                <p className="text-gray-900">{empresa.telegram_chat_id}</p>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onReenviarCredenciais(empresa)}
              disabled={isReenviandoCredenciais}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isReenviandoCredenciais ? 'Reenviando...' : 'Reenviar Credenciais'}
            </Button>
            <Button variant="outline" onClick={() => onEdit(empresa)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(empresa)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizarEmpresaModal;
