
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useAgendamentosStats } from "@/hooks/useAgendamentosStats";

// Mock data - in real app, this would come from props or context
const agendamentosExemplo = [
  {
    id: "1",
    cliente: "João Silva",
    nome_cliente: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao@email.com",
    carro: "Honda Civic 2020",
    nome_carro: "Honda Civic 2020",
    servico: "Lavagem Completa",
    horario: "09:00",
    data_agendamento: "2024-01-22",
    status: "concluido" as const,
    observacoes: "Carro muito sujo",
    equipe_id: "1",
    equipe_nome: "Equipe Principal"
  },
  {
    id: "2",
    cliente: "Maria Santos",
    nome_cliente: "Maria Santos",
    telefone: "(11) 88888-8888",
    email: "maria@email.com",
    carro: "Toyota Corolla 2019",
    nome_carro: "Toyota Corolla 2019",
    servico: "Enceramento",
    horario: "14:30",
    data_agendamento: "2024-01-22",
    status: "confirmado" as const,
    observacoes: "",
    equipe_id: "2",
    equipe_nome: "Equipe A - Lavagem Rápida"
  },
  {
    id: "3",
    cliente: "Pedro Costa",
    nome_cliente: "Pedro Costa",
    telefone: "(11) 77777-7777",
    email: "pedro@email.com",
    carro: "VW Polo 2021",
    nome_carro: "VW Polo 2021",
    servico: "Lavagem Simples",
    horario: "16:00",
    data_agendamento: "2024-01-23",
    status: "concluido" as const,
    observacoes: "Cliente VIP",
    equipe_id: "1",
    equipe_nome: "Equipe Principal"
  }
];

export default function ClienteEstatisticas() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("mes");
  
  const estatisticas = useAgendamentosStats(agendamentosExemplo, filtroSelecionado);

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
            <SelectContent className="bg-white">
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
                <LineChart data={estatisticas.dadosFaturamento}>
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
                    data={estatisticas.dadosServicos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {estatisticas.dadosServicos.map((entry, index) => (
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
              <BarChart data={estatisticas.dadosAgendamentosSemana}>
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
                <div className="text-2xl font-bold text-green-600">{estatisticas.taxaConclusao}%</div>
                <div className="text-sm text-gray-600">Taxa de Conclusão</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{estatisticas.avaliacaoMedia}</div>
                <div className="text-sm text-gray-600">Avaliação Média</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{estatisticas.tempoMedioServico}</div>
                <div className="text-sm text-gray-600">Tempo Médio de Serviço</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
