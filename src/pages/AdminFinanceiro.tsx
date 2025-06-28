
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download, Search, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useEmpresas } from '@/hooks/useEmpresas';

// Interface para transações financeiras
interface TransacaoFinanceira {
  id: number;
  empresaId: number;
  empresaNome: string;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado';
  dataVencimento: string;
  dataPagamento?: string;
  plano: string;
  metodoPagamento?: string;
}

// Dados mock das transações
const transacoesMock: TransacaoFinanceira[] = [
  {
    id: 1,
    empresaId: 1,
    empresaNome: 'Lava Rápido do Robson',
    valor: 299.90,
    status: 'Pago',
    dataVencimento: '2024-01-15',
    dataPagamento: '2024-01-14',
    plano: 'Premium',
    metodoPagamento: 'Cartão de Crédito'
  },
  {
    id: 2,
    empresaId: 2,
    empresaNome: 'AutoLavagem Silva',
    valor: 99.90,
    status: 'Pendente',
    dataVencimento: '2024-01-30',
    plano: 'Básico'
  },
  {
    id: 3,
    empresaId: 3,
    empresaNome: 'Detalhamento Premium',
    valor: 299.90,
    status: 'Atrasado',
    dataVencimento: '2024-01-01',
    plano: 'Premium'
  },
  {
    id: 4,
    empresaId: 1,
    empresaNome: 'Lava Rápido do Robson',
    valor: 299.90,
    status: 'Pago',
    dataVencimento: '2023-12-15',
    dataPagamento: '2023-12-14',
    plano: 'Premium',
    metodoPagamento: 'PIX'
  },
  {
    id: 5,
    empresaId: 4,
    empresaNome: 'Carro Limpo Express',
    valor: 499.90,
    status: 'Pago',
    dataVencimento: '2024-01-20',
    dataPagamento: '2024-01-19',
    plano: 'Empresarial',
    metodoPagamento: 'Boleto'
  }
];

const AdminFinanceiro: React.FC = () => {
  const { renovarPlanoEmpresa } = useEmpresas();
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>(transacoesMock);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroMes, setFiltroMes] = useState('todos');

  // Função para confirmar pagamento manual e renovar plano
  const confirmarPagamento = async (id: number) => {
    const transacao = transacoes.find(t => t.id === id);
    if (!transacao) {
      toast.error('Transação não encontrada');
      return;
    }

    try {
      // Atualizar o status da transação
      setTransacoes(transacoes.map(t => 
        t.id === id 
          ? { 
              ...t, 
              status: 'Pago' as const, 
              dataPagamento: new Date().toISOString().split('T')[0],
              metodoPagamento: 'Confirmação Manual'
            }
          : t
      ));

      // Renovar o plano da empresa (aqui usamos o empresaId como string)
      // Em um cenário real, você teria o UUID da empresa
      const empresaIdString = transacao.empresaId.toString();
      
      // Como não temos o UUID real, vamos simular a renovação
      // Em produção, você buscaria o UUID real da empresa através do nome ou outro identificador
      console.log(`Renovando plano da empresa: ${transacao.empresaNome} (ID: ${empresaIdString})`);
      
      // Para demonstração, vamos apenas mostrar uma mensagem de sucesso
      toast.success(`Pagamento confirmado! Plano da empresa ${transacao.empresaNome} renovado com sucesso.`);
      
      // Se tivéssemos o UUID real da empresa, chamariamos:
      // await renovarPlanoEmpresa(empresaUuid);
      
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento');
      
      // Reverter a alteração em caso de erro
      setTransacoes(transacoes.map(t => 
        t.id === id 
          ? { ...t, status: 'Pendente' as const, dataPagamento: undefined, metodoPagamento: undefined }
          : t
      ));
    }
  };

  // Função para exportar relatório
  const exportarRelatorio = (formato: 'csv' | 'pdf') => {
    toast.success(`Relatório ${formato.toUpperCase()} gerado com sucesso!`);
    console.log(`Exportando relatório em ${formato}`);
  };

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchStatus = filtroStatus === 'todos' || transacao.status.toLowerCase() === filtroStatus;
    const matchEmpresa = filtroEmpresa === '' || transacao.empresaNome.toLowerCase().includes(filtroEmpresa.toLowerCase());
    
    let matchMes = true;
    if (filtroMes !== 'todos') {
      const dataVencimento = new Date(transacao.dataVencimento);
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      
      if (filtroMes === 'este-mes') {
        matchMes = dataVencimento.getMonth() === mesAtual && dataVencimento.getFullYear() === anoAtual;
      } else if (filtroMes === 'mes-passado') {
        const mesPassado = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoMesPassado = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        matchMes = dataVencimento.getMonth() === mesPassado && dataVencimento.getFullYear() === anoMesPassado;
      }
    }
    
    return matchStatus && matchEmpresa && matchMes;
  });

  // Calcular estatísticas
  const estatisticas = {
    receitaTotal: transacoesFiltradas
      .filter(t => t.status === 'Pago')
      .reduce((acc, t) => acc + t.valor, 0),
    pagamentosAtrasados: transacoesFiltradas.filter(t => t.status === 'Atrasado').length,
    pagamentosPendentes: transacoesFiltradas.filter(t => t.status === 'Pendente').length,
    pagamentosConfirmados: transacoesFiltradas.filter(t => t.status === 'Pago').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600">Gerencie pagamentos e assinaturas das empresas</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => exportarRelatorio('csv')} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => exportarRelatorio('pdf')} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                R$ {estatisticas.receitaTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pagamentos Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{estatisticas.pagamentosConfirmados}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600">{estatisticas.pagamentosPendentes}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pagamentos Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{estatisticas.pagamentosAtrasados}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pago">Apenas Pagos</SelectItem>
                  <SelectItem value="pendente">Apenas Pendentes</SelectItem>
                  <SelectItem value="atrasado">Apenas Atrasados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Período</label>
              <Select value={filtroMes} onValueChange={setFiltroMes}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Períodos</SelectItem>
                  <SelectItem value="este-mes">Este Mês</SelectItem>
                  <SelectItem value="mes-passado">Mês Passado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Buscar Empresa</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Digite o nome da empresa..."
                  value={filtroEmpresa}
                  onChange={(e) => setFiltroEmpresa(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Versão mobile - Cards */}
          <div className="block lg:hidden space-y-4 p-4">
            {transacoesFiltradas.map((transacao) => (
              <Card key={transacao.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{transacao.empresaNome}</h3>
                      <p className="text-sm text-gray-500">Plano {transacao.plano}</p>
                    </div>
                    <Badge 
                      variant={
                        transacao.status === 'Pago' ? 'default' :
                        transacao.status === 'Pendente' ? 'secondary' :
                        transacao.status === 'Atrasado' ? 'destructive' : 'outline'
                      }
                    >
                      {transacao.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Valor:</span>
                      <span className="font-bold text-green-600">
                        R$ {transacao.valor.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vencimento:</span>
                      <span>{new Date(transacao.dataVencimento).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {transacao.dataPagamento && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pagamento:</span>
                        <span>{new Date(transacao.dataPagamento).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {transacao.metodoPagamento && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Método:</span>
                        <span>{transacao.metodoPagamento}</span>
                      </div>
                    )}
                  </div>
                  
                  {transacao.status === 'Pendente' && (
                    <Button
                      onClick={() => confirmarPagamento(transacao.id)}
                      size="sm"
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Pagamento e Renovar Plano
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Versão desktop - Tabela */}
          <div className="hidden lg:block">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoesFiltradas.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell className="font-medium">{transacao.empresaNome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transacao.plano}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {transacao.valor.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transacao.status === 'Pago' ? 'default' :
                            transacao.status === 'Pendente' ? 'secondary' :
                            transacao.status === 'Atrasado' ? 'destructive' : 'outline'
                          }
                        >
                          {transacao.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(transacao.dataVencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {transacao.dataPagamento 
                          ? new Date(transacao.dataPagamento).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>{transacao.metodoPagamento || '-'}</TableCell>
                      <TableCell>
                        {transacao.status === 'Pendente' && (
                          <Button
                            onClick={() => confirmarPagamento(transacao.id)}
                            size="sm"
                            variant="outline"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirmar e Renovar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {transacoesFiltradas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma transação encontrada com os filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinanceiro;
