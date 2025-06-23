import { useState } from "react";
import { WeekView } from "@/components/agenda/WeekView";
import { MonthView } from "@/components/agenda/MonthView";
import { ServiceFilter } from "@/components/agenda/ServiceFilter";
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { AgendaControls } from "@/components/agenda/AgendaControls";
import { AgendamentosDoDiaModal } from "@/components/agenda/AgendamentosDoDiaModal";
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
        <AgendaHeader onNovoAgendamento={() => setMostrarNovoForm(true)} />

        <AgendaControls
          visualizacao={visualizacao}
          onVisualizacaoChange={setVisualizacao}
          equipeSelecionada={equipeSelecionada}
          onEquipeChange={setEquipeSelecionada}
          equipesDisponiveis={equipesDisponiveis}
        />

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
            agendamentos={agendamentos}
            horariosFuncionamento={horariosFuncionamento}
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
        <AgendamentosDoDiaModal
          isOpen={mostrarAgendamentosDoDia}
          onClose={() => setMostrarAgendamentosDoDia(false)}
          dataSelecionada={dataSelecionada}
          agendamentosDoDia={agendamentosDoDia}
          onAgendamentoClick={handleAgendamentoClick}
          onNovoAgendamento={() => setMostrarNovoForm(true)}
        />
      </div>
    </ClientLayout>
  );
}
