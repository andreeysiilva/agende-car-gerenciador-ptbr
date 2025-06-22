
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";

// Dados de exemplo para estatísticas
const dadosFaturamento = [
  { periodo: "Jan", valor: 2400 },
  { periodo: "Fev", valor: 1398 },
  { periodo: "Mar", valor: 9800 },
  { periodo: "Abr", valor: 3908 },
  { periodo: "Mai", valor: 4800 },
  { periodo: "Jun", valor: 3800 }
];

const dadosServicos = [
  { nome: "Lavagem Simples", value: 45, color: "#0088FE" },
  { nome: "Lavagem Completa", value: 30, color: "#00C49F" },
  { nome: "Enceramento", value: 20, color: "#FFBB28" },
  { nome: "Detalhamento", value: 5, color: "#FF8042" }
];

const dadosAgendamentosSemana = [
  { dia: "Dom", agendamentos: 12 },
  { dia: "Seg", agendamentos: 25 },
  { dia: "Ter", agendamentos: 28 },
  { dia: "Qua", agendamentos: 32 },
  { dia: "Qui", agendamentos: 30 },
  { dia: "Sex", agendamentos: 35 },
  { dia: "Sáb", agendamentos: 20 }
];

export default function ClienteEstatisticas() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("mes");

  // Simular mudança de dados baseada no filtro
  const obterEstatisticas = () => {
    const multiplicador = {
      "semana": 0.25,
      "mes": 1,
      "trimestre": 3,
      "ano": 12
    }[filtroSelecionado] || 1;

    return {
      faturamento: (8542 * multiplicador).toFixed(2),
      crescimento: 18,
      clientes: Math.round(248 * multiplicador),
      ticketMedio: 34.50,
      agendamentos: Math.round(182 * multiplicador)
    };
  };

  const estatisticas = obterEstatisticas();

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estatísticas</h1>
            <p className="text-gray-600">Acompanhe o desempenho do seu negócio</p>
          </div>
          
          <Select value={filtroSelecionado} onValueChange={setFiltroSelecionado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {estatisticas.faturamento}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{estatisticas.crescimento}%</span> desde o período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.clientes}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+12%</span> novos clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {estatisticas.ticketMedio}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.agendamentos}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> comparado ao período anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Faturamento */}
          <Card>
            <CardHeader>
              <CardTitle>Faturamento por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosFaturamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosServicos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosServicos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Agendamentos por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosAgendamentosSemana}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="agendamentos" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resumo do período */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600">Taxa de Conclusão</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <div className="text-sm text-gray-600">Avaliação Média</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2.3h</div>
                <div className="text-sm text-gray-600">Tempo Médio de Serviço</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
