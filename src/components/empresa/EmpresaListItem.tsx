
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Eye, Edit, Trash2 } from 'lucide-react';
import { Empresa } from '@/types/empresa';

interface EmpresaListItemProps {
  empresa: Empresa;
  onVisualizarEmpresa: (empresaId: string) => void;
  onEditarEmpresa: (empresa: Empresa) => void;
  onExcluirEmpresa: (empresa: Empresa) => void;
}

const EmpresaListItem: React.FC<EmpresaListItemProps> = ({
  empresa,
  onVisualizarEmpresa,
  onEditarEmpresa,
  onExcluirEmpresa
}) => {
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

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
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
          onClick={() => onVisualizarEmpresa(empresa.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEditarEmpresa(empresa)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-700"
          onClick={() => onExcluirEmpresa(empresa)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmpresaListItem;
