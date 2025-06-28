
import React, { useState } from 'react';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, AlertCircle, Users, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminFinanceiro: React.FC = () => {
  const { transacoes, estatisticas, isLoading, confirmarPagamento } = useFinanceiro();
  const [confirmandoPagamento, setConfirmandoPagamento] = useState<string | null>(null);

  const handleConfirmarPagamento = async (transacaoId: string) => {
    setConfirmandoPagamento(transacaoId);
    const sucesso = await confirmarPagamento(transacaoId);
    if (sucesso) {
      // Pagamento confirmado - a lógica de renovação do plano já foi executada
    }
    setConfirmandoPagamento(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge variant="default">Pago</Badge>;
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'receita':
        return <Badge className="bg-green-100 text-green-800">Receita</Badge>;
      case 'despesa':
        return <Badge className="bg-red-100 text-red-800">Despesa</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
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
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Gerencie receitas, despesas e pagamentos do sistema</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Configurar Mercado Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuração do Mercado Pago</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Configure sua integração com o Mercado Pago para receber pagamentos automaticamente.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Client ID</label>
                  <input 
                    type="text" 
                    className="w-full mt-1 p-2 border rounded-md" 
                    placeholder="Seu Client ID do Mercado Pago"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Client Secret</label>
                  <input 
                    type="password" 
                    className="w-full mt-1 p-2 border rounded-md" 
                    placeholder="Seu Client Secret do Mercado Pago"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Public Key</label>
                  <input 
                    type="text" 
                    className="w-full mt-1 p-2 border rounded-md" 
                    placeholder="Sua Public Key do Mercado Pago"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Nota:</strong> Esta funcionalidade será implementada em uma próxima versão. 
                Por enquanto, você pode confirmar pagamentos manualmente através da lista de transações.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(estatisticas.totalReceitas)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(estatisticas.receitasPendentes)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.empresasAtivas}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.empresasVencendo}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas de Transações */}
      <Tabs defaultValue="receitas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="todas">Todas Transações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receitas">
          <Card>
            <CardHeader>
              <CardTitle>Receitas</CardTitle>
              <CardDescription>Lista de todas as receitas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transacoes.filter(t => t.tipo === 'receita').map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{transacao.empresa?.nome || 'Empresa não encontrada'}</h3>
                        {getTipoBadge(transacao.tipo)}
                        {getStatusBadge(transacao.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Valor:</strong> {formatCurrency(transacao.valor)}</p>
                        <p><strong>Descrição:</strong> {transacao.descricao || 'Mensalidade do plano'}</p>
                        {transacao.data_vencimento && (
                          <p><strong>Vencimento:</strong> {new Date(transacao.data_vencimento).toLocaleDateString('pt-BR')}</p>
                        )}
                        {transacao.data_pagamento && (
                          <p><strong>Pagamento:</strong> {new Date(transacao.data_pagamento).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                    
                    {transacao.status === 'pendente' && (
                      <Button 
                        onClick={() => handleConfirmarPagamento(transacao.id)}
                        disabled={confirmandoPagamento === transacao.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {confirmandoPagamento === transacao.id ? 'Confirmando...' : 'Confirmar Pagamento'}
                      </Button>
                    )}
                  </div>
                ))}
                
                {transacoes.filter(t => t.tipo === 'receita').length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma receita encontrada</h3>
                    <p className="text-gray-600">As receitas aparecerão aqui quando empresas forem criadas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <CardTitle>Despesas</CardTitle>
              <CardDescription>Lista de todas as despesas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transacoes.filter(t => t.tipo === 'despesa').map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{transacao.descricao || 'Despesa'}</h3>
                        {getTipoBadge(transacao.tipo)}
                        {getStatusBadge(transacao.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Valor:</strong> {formatCurrency(transacao.valor)}</p>
                        {transacao.data_vencimento && (
                          <p><strong>Vencimento:</strong> {new Date(transacao.data_vencimento).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {transacoes.filter(t => t.tipo === 'despesa').length === 0 && (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
                    <p className="text-gray-600">As despesas aparecerão aqui quando forem cadastradas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Transações</CardTitle>
              <CardDescription>Histórico completo de transações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transacoes.map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">
                          {transacao.tipo === 'receita' 
                            ? (transacao.empresa?.nome || 'Empresa não encontrada')
                            : (transacao.descricao || 'Despesa')
                          }
                        </h3>
                        {getTipoBadge(transacao.tipo)}
                        {getStatusBadge(transacao.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Valor:</strong> {formatCurrency(transacao.valor)}</p>
                        <p><strong>Data:</strong> {new Date(transacao.created_at).toLocaleDateString('pt-BR')}</p>
                        {transacao.descricao && transacao.tipo === 'receita' && (
                          <p><strong>Descrição:</strong> {transacao.descricao}</p>
                        )}
                      </div>
                    </div>
                    
                    {transacao.status === 'pendente' && transacao.tipo === 'receita' && (
                      <Button 
                        onClick={() => handleConfirmarPagamento(transacao.id)}
                        disabled={confirmandoPagamento === transacao.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {confirmandoPagamento === transacao.id ? 'Confirmando...' : 'Confirmar Pagamento'}
                      </Button>
                    )}
                  </div>
                ))}
                
                {transacoes.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
                    <p className="text-gray-600">As transações aparecerão aqui conforme o sistema for utilizado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFinanceiro;
