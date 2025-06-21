
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, Users, Car, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Dados mock para estatísticas
const faturamentoMensal = [
  { mes: 'Jan', valor: 8400 },
  { mes: 'Fev', valor: 9200 },
  { mes: 'Mar', valor: 11800 },
  { mes: 'Abr', valor: 10600 },
  { mes: 'Mai', valor: 12480 },
  { mes: 'Jun', valor: 14200 }
];

const servicosMaisVendidos = [
  { nome: 'Lavagem Completa', quantidade: 156, percentual: 35 },
  { nome: 'Lavagem Simples', quantidade: 120, percentual: 27 },
  { nome: 'Enceramento', quantidade: 89, percentual: 20 },
  { nome: 'Detalhamento', quantidade: 45, percentual: 10 },
  { nome: 'Outros', quantidade: 35, percentual: 8 }
];

const agendamentosPorDia = [
  { dia: 'Seg', agendamentos: 12 },
  { dia: 'Ter', agendamentos: 15 },
  { dia: 'Qua', agendamentos: 18 },
  { dia: 'Qui', agendamentos: 20 },
  { dia: 'Sex', agendamentos: 25 },
  { dia: 'Sáb', agendamentos: 30 },
  { dia: 'Dom', agendamentos: 8 }
];

const cores = ['#2563eb', '#10b981', '#facc15', '#ef4444', '#8b5cf6'];

const ClienteEstatisticas = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

  // Métricas principais
  const metricas = {
    faturamentoTotal: 67680,
    crescimentoMensal: 13.8,
    clientesAtendidos: 445,
    crescimentoClientes: 8.2,
    ticketMedio: 152.0,
    crescimentoTicket: -2.1,
    agendamentosTotal: 128,
    crescimentoAgendamentos: 15.6
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarPercentual = (valor: number) => {
    return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-primary">Estatísticas</h1>
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Esta Semana</SelectItem>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Faturamento</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatarMoeda(metricas.faturamentoTotal)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {metricas.crescimentoMensal > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${metricas.crescimentoMensal > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(metricas.crescimentoMensal)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Clientes</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {metricas.clientesAtendidos}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {metricas.crescimentoClientes > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${metricas.crescimentoClientes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(metricas.crescimentoClientes)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Ticket Médio</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatarMoeda(metricas.ticketMedio)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {metricas.crescimentoTicket > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${metricas.crescimentoTicket > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(metricas.crescimentoTicket)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Agendamentos</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {metricas.agendamentosTotal}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {metricas.crescimentoAgendamentos > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${metricas.crescimentoAgendamentos > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(metricas.crescimentoAgendamentos)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faturamento mensal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">
                Faturamento Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={faturamentoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [formatarMoeda(value), 'Faturamento']}
                    labelStyle={{ color: '#1f2937' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Serviços mais vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">
                Serviços Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicosMaisVendidos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {servicosMaisVendidos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Quantidade']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos por dia da semana */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-text-primary">
              Agendamentos por Dia da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agendamentosPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Agendamentos']}
                  labelStyle={{ color: '#1f2937' }}
                />
                <Bar 
                  dataKey="agendamentos" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lista detalhada de serviços */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-text-primary">
              Desempenho dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicosMaisVendidos.map((servico, index) => (
                <div key={servico.nome} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cores[index % cores.length] }}
                    />
                    <div>
                      <h4 className="font-semibold text-text-primary">{servico.nome}</h4>
                      <p className="text-sm text-text-secondary">{servico.quantidade} agendamentos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">{servico.percentual}%</p>
                    <p className="text-sm text-text-secondary">do total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClienteEstatisticas;
