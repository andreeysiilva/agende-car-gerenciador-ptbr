
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Calendar, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ClientLayout } from '@/components/layout/ClientLayout';

// Interface para histórico de pagamentos do cliente
interface PagamentoCliente {
  id: number;
  data: string;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  metodoPagamento?: string;
  proximoVencimento: string;
}

// Dados mock do cliente
const dadosCliente = {
  plano: 'Premium',
  status: 'Ativo',
  proximoVencimento: '2024-02-15',
  valorMensal: 299.90
};

const historicoMock: PagamentoCliente[] = [
  {
    id: 1,
    data: '2024-01-15',
    valor: 299.90,
    status: 'Pago',
    metodoPagamento: 'Cartão de Crédito',
    proximoVencimento: '2024-02-15'
  },
  {
    id: 2,
    data: '2023-12-15',
    valor: 299.90,
    status: 'Pago',
    metodoPagamento: 'PIX',
    proximoVencimento: '2024-01-15'
  },
  {
    id: 3,
    data: '2023-11-15',
    valor: 299.90,
    status: 'Pago',
    metodoPagamento: 'Boleto',
    proximoVencimento: '2023-12-15'
  }
];

const ClienteFinanceiro: React.FC = () => {
  const [historico] = useState<PagamentoCliente[]>(historicoMock);

  // Calcular dias até o vencimento
  const diasAteVencimento = () => {
    const hoje = new Date();
    const vencimento = new Date(dadosCliente.proximoVencimento);
    const diferenca = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diferenca;
  };

  // Função para processar pagamento
  const processarPagamento = () => {
    // Aqui seria integrada a API do Stripe ou Mercado Pago
    toast.success('Redirecionando para a página de pagamento...');
    console.log('Integrando com gateway de pagamento');
  };

  const dias = diasAteVencimento();
  const statusVencimento = dias < 0 ? 'Atrasado' : dias <= 5 ? 'Próximo ao vencimento' : 'Em dia';

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600">Gerencie sua assinatura e pagamentos</p>
          </div>
        </div>

        {/* Status da assinatura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-primary" />
              Status da Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{dadosCliente.plano}</div>
                <div className="text-sm text-gray-600">Plano Atual</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{dadosCliente.status}</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">
                  {dias > 0 ? `${dias} dias` : 'Vencido'}
                </div>
                <div className="text-sm text-gray-600">Próximo Vencimento</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  R$ {dadosCliente.valorMensal.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-sm text-gray-600">Valor Mensal</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximo pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Próximo Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold">
                    Vencimento: {new Date(dadosCliente.proximoVencimento).toLocaleDateString('pt-BR')}
                  </span>
                  <Badge 
                    variant={
                      statusVencimento === 'Atrasado' ? 'destructive' :
                      statusVencimento === 'Próximo ao vencimento' ? 'secondary' : 'default'
                    }
                  >
                    {statusVencimento}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary">
                  R$ {dadosCliente.valorMensal.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-600">
                  {statusVencimento === 'Atrasado' 
                    ? `Pagamento atrasado há ${Math.abs(dias)} dias`
                    : `Faltam ${dias} dias para o vencimento`
                  }
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={processarPagamento}
                  className="bg-secondary hover:bg-secondary-hover text-white"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pagar Agora
                </Button>
                
                {statusVencimento === 'Atrasado' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Pagamento em atraso
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Versão mobile - Cards */}
            <div className="block sm:hidden space-y-4 p-4">
              {historico.map((pagamento) => (
                <Card key={pagamento.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(pagamento.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <Badge variant="default">
                        {pagamento.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>Método: {pagamento.metodoPagamento}</p>
                      <p>Próximo vencimento era: {new Date(pagamento.proximoVencimento).toLocaleDateString('pt-BR')}</p>
                    </div>
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
                      <TableHead>Data do Pagamento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Próximo Vencimento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historico.map((pagamento) => (
                      <TableRow key={pagamento.id}>
                        <TableCell>
                          {new Date(pagamento.data).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {pagamento.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{pagamento.metodoPagamento}</TableCell>
                        <TableCell>
                          {new Date(pagamento.proximoVencimento).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-text-primary mb-2">Métodos de Pagamento Aceitos:</h4>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                <li>Cartão de Crédito (Visa, Mastercard, Elo)</li>
                <li>PIX (Aprovação instantânea)</li>
                <li>Boleto Bancário (Até 3 dias úteis)</li>
                <li>Transferência Bancária</li>
              </ul>
            </div>
            
            <div className="mt-4 bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-text-primary mb-2">Importante:</h4>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                <li>Pagamentos em atraso podem resultar na suspensão do acesso</li>
                <li>Para alterar a forma de pagamento, entre em contato conosco</li>
                <li>Recibos são enviados automaticamente por email</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClienteFinanceiro;
