
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calendar, AlertTriangle, Download, CheckCircle, Clock, Car } from 'lucide-react';
import { toast } from 'sonner';

// Interface para pagamentos
interface Pagamento {
  id: number;
  empresaId: number;
  empresaNome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  plano: string;
  metodoPagamento?: string;
}

// Dados mock de pagamentos
const pagamentosMock: Pagamento[] = [
  {
    id: 1,
    empresaId: 1,
    empresaNome: 'Auto Lavagem Premium',
    valor: 299.90,
    dataVencimento: '2024-01-15',
    dataPagamento: '2024-01-14',
    status: 'Pago',
    plano: 'Premium',
    metodoPagamento: 'Cartão de Crédito'
  },
  {
    id: 2,
    empresaId: 2,
    empresaNome: 'Lava Car Express',
    valor: 99.90,
    dataVencimento: '2024-01-20',
    status: 'Pendente',
    plano: 'Básico'
  },
  {
    id: 3,
    empresaId: 3,
    empresaNome: 'Detailing Master',
    valor: 299.90,
    dataVencimento: '2024-01-10',
    status: 'Atrasado',
    plano: 'Premium'
  },
  {
    id: 4,
    empresaId: 1,
    empresaNome: 'Auto Lavagem Premium',
    valor: 299.90,
    dataVencimento: '2024-02-15',
    dataPagamento: '2024-02-13',
    status: 'Pago',
    plano: 'Premium',
    metodoPagamento: 'PIX'
  }
];

const AdminFinanceiro: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(pagamentosMock);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('mes');

  // Estatísticas financeiras
  const estatisticas = {
    totalReceita: pagamentos.filter(p => p.status === 'Pago').reduce((acc, p) => acc + p.valor, 0),
    pagamentosAtrasados: pagamentos.filter(p => p.status === 'Atrasado').length,
    pagamentosPendentes: pagamentos.filter(p => p.status === 'Pendente').length,
    empresasAtivas: [...new Set(pagamentos.filter(p => p.status === 'Pago').map(p => p.empresaId))].length
  };

  // Função para confirmar pagamento manual
  const confirmarPagamento = (pagamentoId: number) => {
    setPagamentos(prev => prev.map(p => 
      p.id === pagamentoId 
        ? { 
            ...p, 
            status: 'Pago' as const, 
            dataPagamento: new Date().toISOString().split('T')[0],
            metodoPagamento: 'Confirmação Manual'
          }
        : p
    ));
    toast.success('Pagamento confirmado com sucesso!');
  };

  // Função para exportar relatório
  const exportarRelatorio = (formato: 'csv' | 'pdf') => {
    // Simular exportação
    console.log(`Exportando relatório financeiro em formato ${formato.toUpperCase()}`);
    toast.success(`Relatório ${formato.toUpperCase()} gerado com sucesso!`);
  };

  // Filtrar pagamentos
  const pagamentosFiltrados = pagamentos.filter(pagamento => {
    if (filtroStatus !== 'todos' && pagamento.status !== filtroStatus) return false;
    
    // Filtro por período (mock - aqui você implementaria a lógica real de data)
    if (filtroPeriodo === 'semana') {
      // Lógica para filtrar última semana
    } else if (filtroPeriodo === 'mes') {
      // Lógica para filtrar último mês
    }
    
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-0">
      {/* Logo e título do AgendCar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Car className="h-8 w-8 text-primary" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full opacity-70"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">AgendCar</h1>
      </div>

      {/* Cabeçalho da página */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestão Financeira</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Controle de pagamentos e assinaturas das empresas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => exportarRelatorio('csv')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportarRelatorio('pdf')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xl sm:text-2xl font-bold text-text-primary">
                R$ {estatisticas.totalReceita.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Pagamentos Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xl sm:text-2xl font-bold text-text-primary">
                {estatisticas.pagamentosAtrasados}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-xl sm:text-2xl font-bold text-text-primary">
                {estatisticas.pagamentosPendentes}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Empresas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-xl sm:text-2xl font-bold text-text-primary">
                {estatisticas.empresasAtivas}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status do Pagamento
              </label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Período
              </label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Último mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última Semana</SelectItem>
                  <SelectItem value="mes">Último Mês</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="ano">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Versão mobile - Cards */}
          <div className="block sm:hidden space-y-4 p-4">
            {pagamentosFiltrados.map((pagamento) => (
              <Card key={pagamento.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{pagamento.empresaNome}</h3>
                      <p className="text-sm text-gray-500">{pagamento.plano}</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        pagamento.status === 'Pago' ? 'default' : 
                        pagamento.status === 'Pendente' ? 'secondary' : 'destructive'
                      }
                    >
                      {pagamento.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3 text-sm text-gray-500">
                    <p>Vencimento: {new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}</p>
                    {pagamento.dataPagamento && (
                      <p>Pago em: {new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}</p>
                    )}
                    {pagamento.metodoPagamento && (
                      <p>Método: {pagamento.metodoPagamento}</p>
                    )}
                  </div>
                  
                  {pagamento.status === 'Pendente' && (
                    <Button
                      size="sm"
                      onClick={() => confirmarPagamento(pagamento.id)}
                      className="w-full bg-secondary hover:bg-secondary-hover"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Pagamento
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Versão desktop - Tabela */}
          <div className="hidden sm:block">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentosFiltrados.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell className="font-medium">{pagamento.empresaNome}</TableCell>
                      <TableCell>{pagamento.plano}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell>
                        {new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {pagamento.dataPagamento 
                          ? new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            pagamento.status === 'Pago' ? 'default' : 
                            pagamento.status === 'Pendente' ? 'secondary' : 'destructive'
                          }
                        >
                          {pagamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{pagamento.metodoPagamento || '-'}</TableCell>
                      <TableCell className="text-right">
                        {pagamento.status === 'Pendente' && (
                          <Button
                            size="sm"
                            onClick={() => confirmarPagamento(pagamento.id)}
                            className="bg-secondary hover:bg-secondary-hover"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirmar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinanceiro;
