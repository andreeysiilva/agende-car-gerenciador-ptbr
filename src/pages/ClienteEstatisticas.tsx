
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, Users, Car, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Dados mock completos para estatísticas
const dadosCompletos = {
  faturamentoMensal: [
    { mes: 'Jan', valor: 8400, semana1: 2100, semana2: 2200, semana3: 2000, semana4: 2100 },
    { mes: 'Fev', valor: 9200, semana1: 2300, semana2: 2400, semana3: 2200, semana4: 2300 },
    { mes: 'Mar', valor: 11800, semana1: 2900, semana2: 3000, semana3: 2800, semana4: 3100 },
    { mes: 'Abr', valor: 10600, semana1: 2600, semana2: 2700, semana3: 2500, semana4: 2800 },
    { mes: 'Mai', valor: 12480, semana1: 3100, semana2: 3200, semana3: 3000, semana4: 3180 },
    { mes: 'Jun', valor: 14200, semana1: 3500, semana2: 3600, semana3: 3400, semana4: 3700 }
  ],
  
  servicosMaisVendidos: [
    { nome: 'Lavagem Completa', quantidade: 156, percentual: 35 },
    { nome: 'Lavagem Simples', quantidade: 120, percentual: 27 },
    { nome: 'Enceramento', quantidade: 89, percentual: 20 },
    { nome: 'Detalhamento', quantidade: 45, percentual: 10 },
    { nome: 'Outros', quantidade: 35, percentual: 8 }
  ],
  
  agendamentosPorDia: [
    { dia: 'Seg', agendamentos: 12 },
    { dia: 'Ter', agendamentos: 15 },
    { dia: 'Qua', agendamentos: 18 },
    { dia: 'Qui', agendamentos: 20 },
    { dia: 'Sex', agendamentos: 25 },
    { dia: 'Sáb', agendamentos: 30 },
    { dia: 'Dom', agendamentos: 8 }
  ]
};

const cores = ['#2563eb', '#10b981', '#facc15', '#ef4444', '#8b5cf6'];

const ClienteEstatisticas = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

  // Dados filtrados baseados no período selecionado
  const dadosFiltrados = useMemo(() => {
    switch (periodoSelecionado) {
      case 'semana':
        // Simular dados da semana atual (últimos 7 dias)
        return {
          faturamento: dadosCompletos.faturamentoMensal.slice(-1).map(m => ({
            mes: 'Semana Atual',
            valor: m.semana4
          })),
          servicos: dadosCompletos.servicosMaisVendidos.map(s => ({
            ...s,
            quantidade: Math.floor(s.quantidade * 0.25) // 25% do mês
          })),
          agendamentos: dadosCompletos.agendamentosPorDia,
          metricas: {
            faturamentoTotal: 3700,
            crescimentoMensal: 8.2,
            clientesAtendidos: 35,
            crescimentoClientes: 12.1,
            ticketMedio: 105.7,
            crescimentoTicket: -1.8,
            agendamentosTotal: 28,
            crescimentoAgendamentos: 9.4
          }
        };
      
      case 'trimestre':
        // Últimos 3 meses
        return {
          faturamento: dadosCompletos.faturamentoMensal.slice(-3),
          servicos: dadosCompletos.servicosMaisVendidos.map(s => ({
            ...s,
            quantidade: Math.floor(s.quantidade * 3) // 3 meses
          })),
          agendamentos: dadosCompletos.agendamentosPorDia,
          metricas: {
            faturamentoTotal: 38280,
            crescimentoMensal: 15.2,
            clientesAtendidos: 890,
            crescimentoClientes: 18.7,
            ticketMedio: 168.3,
            crescimentoTicket: 3.2,
            agendamentosTotal: 285,
            crescimentoAgendamentos: 22.1
          }
        };
      
      case 'ano':
        // Ano completo
        return {
          faturamento: dadosCompletos.faturamentoMensal,
          servicos: dadosCompletos.servicosMaisVendidos.map(s => ({
            ...s,
            quantidade: Math.floor(s.quantidade * 2) // Dobrar para simular ano
          })),
          agendamentos: dadosCompletos.agendamentosPorDia,
          metricas: {
            faturamentoTotal: 134560,
            crescimentoMensal: 28.9,
            clientesAtendidos: 2450,
            crescimentoClientes: 31.4,
            ticketMedio: 189.2,
            crescimentoTicket: 8.7,
            agendamentosTotal: 890,
            crescimentoAgendamentos: 35.6
          }
        };
      
      default: // 'mes'
        return {
          faturamento: dadosCompletos.faturamentoMensal.slice(-1),
          servicos: dadosCompletos.servicosMaisVendidos,
          agendamentos: dadosCompletos.agendamentosPorDia,
          metricas: {
            faturamentoTotal: 14200,
            crescimentoMensal: 13.8,
            clientesAtendidos: 128,
            crescimentoClientes: 8.2,
            ticketMedio: 152.0,
            crescimentoTicket: -2.1,
            agendamentosTotal: 93,
            crescimentoAgendamentos: 15.6
          }
        };
    }
  }, [periodoSelecionado]);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarPercentual = (valor: number) => {
    return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
  };

  const obterTituloPeriodo = () => {
    switch (periodoSelecionado) {
      case 'semana': return 'Esta Semana';
      case 'trimestre': return 'Último Trimestre';
      case 'ano': return 'Este Ano';
      default: return 'Este Mês';
    }
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
          
          <div className="text-sm text-text-secondary">
            Dados referentes ao período: <strong>{obterTituloPeriodo()}</strong>
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
                    {formatarMoeda(dadosFiltrados.metricas.faturamentoTotal)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {dadosFiltrados.metricas.crescimentoMensal > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${dadosFiltrados.metricas.crescimentoMensal > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(dadosFiltrados.metricas.crescimentoMensal)}
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
                    {dadosFiltrados.metricas.clientesAtendidos}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {dadosFiltrados.metricas.crescimentoClientes > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${dadosFiltrados.metricas.crescimentoClientes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(dadosFiltrados.metricas.crescimentoClientes)}
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
                    {formatarMoeda(dadosFiltrados.metricas.ticketMedio)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {dadosFiltrados.metricas.crescimentoTicket > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${dadosFiltrados.metricas.crescimentoTicket > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(dadosFiltrados.metricas.crescimentoTicket)}
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
                    {dadosFiltrados.metricas.agendamentosTotal}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {dadosFiltrados.metricas.crescimentoAgendamentos > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${dadosFiltrados.metricas.crescimentoAgendamentos > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarPercentual(dadosFiltrados.metricas.crescimentoAgendamentos)}
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
          {/* Faturamento por período */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">
                Faturamento - {obterTituloPeriodo()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosFiltrados.faturamento}>
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
                Serviços Mais Vendidos - {obterTituloPeriodo()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosFiltrados.servicos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {dadosFiltrados.servicos.map((entry, index) => (
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
              <BarChart data={dadosFiltrados.agendamentos}>
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
              Desempenho dos Serviços - {obterTituloPeriodo()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dadosFiltrados.servicos.map((servico, index) => (
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
