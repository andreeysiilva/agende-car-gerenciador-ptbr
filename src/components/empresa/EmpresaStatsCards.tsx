
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Calendar, DollarSign } from 'lucide-react';
import { Empresa } from '@/types/empresa';

interface EmpresaStatsCardsProps {
  empresas: Empresa[];
}

const EmpresaStatsCards: React.FC<EmpresaStatsCardsProps> = ({ empresas }) => {
  const totalEmpresas = empresas?.length || 0;
  const empresasAtivas = empresas?.filter(emp => emp.status === 'Ativo').length || 0;
  const empresasPendentes = empresas?.filter(emp => emp.status === 'Pendente').length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmpresas}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{empresasAtivas}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Empresas Pendentes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{empresasPendentes}</div>
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
  );
};

export default EmpresaStatsCards;
