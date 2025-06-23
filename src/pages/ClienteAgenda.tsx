
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Car, Phone, FileText, Plus, CalendarDays } from "lucide-react";
import { WeekView } from "@/components/agenda/WeekView";
import { MonthView } from "@/components/agenda/MonthView";
import { ServiceFilter } from "@/components/agenda/ServiceFilter";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { NovoAgendamentoForm } from "@/components/forms/NovoAgendamentoForm";
import { EditarAgendamentoForm } from "@/components/forms/EditarAgendamentoForm";

// Dados de exemplo para demonstração
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
    status: "confirmado" as const,
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
    status: "pendente" as const,
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

const servicosDisponiveis = [
  "Lavagem Completa",
  "Lavagem Simples", 
  "Enceramento",
  "Lavagem e Enceramento",
  "Detalhamento",
  "Lavagem Seca"
];

const equipesDisponiveis = [
  { id: "all", nome: "Todas as Equipes" },
  { id: "1", nome: "Equipe Principal" },
  { id: "2", nome: "Equipe A - Lavagem Rápida" },
  { id: "3", nome: "Equipe B - Detalhamento" }
];

// Dados de horários de funcionamento (mockado)
const horariosFuncionamento = {
  0: { funcionando: false, abertura: "08:00", fechamento: "18:00" }, // Domingo
  1: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Segunda
  2: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Terça
  3: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Quarta
  4: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Quinta
  5: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Sexta
  6: { funcionando: true, abertura: "08:00", fechamento: "16:00" }   // Sábado
};

export default function ClienteAgenda() {
  const [visualizacao, setVisualizacao] = useState<'semana' | 'mes'>('semana');
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<string>("all");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState(agendamentosExemplo);
  const [mostrarNovoForm, setMostrarNovoForm] = useState(false);
  const [mostrarEditForm, setMostrarEditForm] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [agendamentosDoDia, setAgendamentosDoDia] = useState<any[]>([]);
  const [mostrarAgendamentosDoDia, setMostrarAgendamentosDoDia] = useState(false);

  // Função para alternar seleção de serviço
  const toggleServico = (servico: string) => {
    setServicosSelecionados(prev => 
      prev.includes(servico) 
        ? prev.filter(s => s !== servico)
        : [...prev, servico]
    );
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setServicosSelecionados([]);
    setEquipeSelecionada("all");
  };

  // Função para lidar com clique em agendamento
  const handleAgendamentoClick = (agendamento: any) => {
    setAgendamentoSelecionado(agendamento);
    setMostrarEditForm(true);
  };

  // Função para lidar com clique em dia
  const handleDiaClick = (data: string) => {
    const agendamentosNaData = agendamentos.filter(ag => ag.data_agendamento === data);
    setAgendamentosDoDia(agendamentosNaData);
    setDataSelecionada(data);
    setMostrarAgendamentosDoDia(true);
  };

  // Função para salvar novo agendamento
  const handleSalvarNovoAgendamento = (novoAgendamento: any) => {
    setAgendamentos(prev => [...prev, novoAgendamento]);
  };

  // Função para salvar agendamento editado
  const handleSalvarAgendamentoEditado = (agendamentoAtualizado: any) => {
    setAgendamentos(prev => 
      prev.map(ag => ag.id === agendamentoAtualizado.id ? agendamentoAtualizado : ag)
    );
    setMostrarEditForm(false);
    setAgendamentoSelecionado(null);
  };

  // Função para deletar agendamento
  const handleDeletarAgendamento = (agendamentoId: string) => {
    setAgendamentos(prev => prev.filter(ag => ag.id !== agendamentoId));
    setMostrarEditForm(false);
    setAgendamentoSelecionado(null);
  };

  // Filtrar agendamentos baseado nos filtros selecionados
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const servicoMatch = servicosSelecionados.length === 0 || servicosSelecionados.includes(agendamento.servico);
    const equipeMatch = equipeSelecionada === "all" || agendamento.equipe_id === equipeSelecionada;
    return servicoMatch && equipeMatch;
  });

  // Verificar se um dia está funcionando
  const isDiaFuncionando = (data: string) => {
    const dayOfWeek = new Date(data).getDay();
    return horariosFuncionamento[dayOfWeek]?.funcionando || false;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'pendente': return 'Pendente';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600">Gerencie seus agendamentos</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => setMostrarNovoForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Controles de visualização */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={visualizacao === 'semana' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizacao('semana')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Semana
            </Button>
            <Button
              variant={visualizacao === 'mes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizacao('mes')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Mês
            </Button>
          </div>

          {/* Filtro de Equipes */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Equipe:</label>
            <Select value={equipeSelecionada} onValueChange={setEquipeSelecionada}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {equipesDisponiveis.map((equipe) => (
                  <SelectItem key={equipe.id} value={equipe.id}>
                    {equipe.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros */}
        <ServiceFilter
          availableServices={servicosDisponiveis}
          selectedServices={servicosSelecionados}
          onServiceToggle={toggleServico}
          onClearFilters={limparFiltros}
        />

        {/* Visualização da agenda */}
        {visualizacao === 'semana' ? (
          <WeekView
            agendamentos={agendamentosFiltrados}
            filteredServices={servicosSelecionados}
            onAgendamentoClick={handleAgendamentoClick}
            onDayClick={handleDiaClick}
            horariosFuncionamento={horariosFuncionamento}
          />
        ) : (
          <MonthView
            agendamentos={agendamentosFiltrados}
            filteredServices={servicosSelecionados}
            onAgendamentoClick={handleAgendamentoClick}
            onDayClick={handleDiaClick}
            horariosFuncionamento={horariosFuncionamento}
          />
        )}

        {/* Formulário de Novo Agendamento */}
        {mostrarNovoForm && (
          <NovoAgendamentoForm
            onClose={() => setMostrarNovoForm(false)}
            onSave={handleSalvarNovoAgendamento}
          />
        )}

        {/* Formulário de Editar Agendamento */}
        {mostrarEditForm && agendamentoSelecionado && (
          <EditarAgendamentoForm
            agendamento={agendamentoSelecionado}
            onClose={() => {
              setMostrarEditForm(false);
              setAgendamentoSelecionado(null);
            }}
            onSave={handleSalvarAgendamentoEditado}
            onDelete={handleDeletarAgendamento}
          />
        )}

        {/* Modal de Agendamentos do Dia */}
        {mostrarAgendamentosDoDia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Agendamentos de {formatarData(dataSelecionada)}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMostrarAgendamentosDoDia(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {agendamentosDoDia.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum agendamento para esta data</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        setMostrarAgendamentosDoDia(false);
                        setMostrarNovoForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Agendamento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agendamentosDoDia
                      .sort((a, b) => a.horario.localeCompare(b.horario))
                      .map((agendamento) => (
                      <Card key={agendamento.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleAgendamentoClick(agendamento)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{agendamento.horario}</span>
                            </div>
                            <Badge className={getStatusColor(agendamento.status)}>
                              {getStatusText(agendamento.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{agendamento.cliente}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{agendamento.telefone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-gray-400" />
                              <span>{agendamento.carro}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{agendamento.servico}</span>
                            </div>
                          </div>
                          
                          {agendamento.equipe_nome && (
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>Equipe:</strong> {agendamento.equipe_nome}
                            </div>
                          )}
                          
                          {agendamento.observacoes && (
                            <div className="mt-2 text-sm text-gray-600">
                              <FileText className="h-4 w-4 inline mr-1" />
                              {agendamento.observacoes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
