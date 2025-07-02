
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Plus } from 'lucide-react';
import { Empresa } from '@/types/empresa';
import EmpresaListItem from './EmpresaListItem';

interface EmpresaListProps {
  empresas: Empresa[];
  onVisualizarEmpresa: (empresaId: string) => void;
  onEditarEmpresa: (empresa: Empresa) => void;
  onExcluirEmpresa: (empresa: Empresa) => void;
  onCreateEmpresa: () => void;
}

const EmpresaList: React.FC<EmpresaListProps> = ({
  empresas,
  onVisualizarEmpresa,
  onEditarEmpresa,
  onExcluirEmpresa,
  onCreateEmpresa
}) => {
  return (
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
              <EmpresaListItem
                key={empresa.id}
                empresa={empresa}
                onVisualizarEmpresa={onVisualizarEmpresa}
                onEditarEmpresa={onEditarEmpresa}
                onExcluirEmpresa={onExcluirEmpresa}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma empresa cadastrada</h3>
            <p className="text-gray-600 mb-4">Crie sua primeira empresa para começar</p>
            <Button onClick={onCreateEmpresa}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Empresa
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmpresaList;
