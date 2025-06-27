
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { WeekView } from "@/components/agenda/WeekView";
import { MonthView } from "@/components/agenda/MonthView";
import { ServiceFilter } from "@/components/agenda/ServiceFilter";
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { AgendaControls } from "@/components/agenda/AgendaControls";
import { AgendamentosDoDiaModal } from "@/components/agenda/AgendamentosDoDiaModal";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { NovoAgendamentoForm } from "@/components/forms/NovoAgendamentoForm";
import { EditarAgendamentoForm } from "@/components/forms/EditarAgendamentoForm";
import { useSupabaseAgendamentos, SupabaseAgendamento } from "@/hooks/useSupabaseAgendamentos";
import { useAgendaFilters } from "@/hooks/useAgendaFilters";
import { useAgendaModals } from "@/hooks/useAgendaModals";
import { servicosDisponiveis, equipesDisponiveis, horariosFuncionamento } from "@/constants/agendaConstants";

// Função para converter SupabaseAgendamento para o formato esperado pelos componentes
const convertSupabaseToAgendamento = (supabaseAgendamento: SupabaseAgendamento) => ({
  id: supabaseAgendamento.id,
  cliente: supabaseAgendamento.nome_cliente,
  email: '', // Campo não disponível no Supabase, usando string vazia
  telefone: supabaseAgendamento.telefone,
  carro: supabaseAgendamento.nome_carro,
  servico: supabaseAgendamento.servico,
  data_agendamento: supabaseAgendamento.data_agendamento,
  horario: supabaseAgendamento.horario,
  status: supabaseAgendamento.status,
  observacoes: supabaseAgendamento.observacoes || '',
  equipe_nome: '', // Campo não disponível, usando string vazia
  nome_cliente: supabaseAgendamento.nome_cliente,
  nome_carro: supabaseAgendamento.nome_carro,
  equipe_id: supabaseAgendamento.equipe_id || '' // Adicionando equipe_id obrigatório
});

export default function ClienteAgenda() {
  const location = useLocation();
  const [visualizacao, setVisualizacao] = useState<'semana' | 'mes'>('semana');
  
  // Hook do Supabase para agendamentos reais
  const { 
    agendamentos, 
    isLoading,
    criarAgendamento, 
    atualizarAgendamento, 
    deletarAgendamento 
  } = useSupabaseAgendamentos();
  
  const { 
    servicosSelecionados, 
    equipeSelecionada, 
    setEquipeSelecionada, 
    toggleServico, 
    limparFiltros, 
    filtrarAgendamentos 
  } = useAgendaFilters();
  
  const { 
    agendamentoSelecionado,
    mostrarNovoForm,
    mostrarEditForm,
    dataSelecionada,
    agendamentosDoDia,
    mostrarAgendamentosDoDia,
    setMostrarNovoForm,
    handleAgendamentoClick,
    handleDiaClick,
    fecharModals,
    setAgendamentosDoDia,
    setDataSelecionada,
    setMostrarAgendamentosDoDia
  } = useAgendaModals();

  // Processar parâmetros vindos do Dashboard
  useEffect(() => {
    if (location.state) {
      const { selectedDate, showDayModal, selectedAppointment } = location.state;
      
      if (selectedDate && showDayModal) {
        const agendamentosNaData = agendamentos
          .filter(ag => ag.data_agendamento === selectedDate)
          .map(convertSupabaseToAgendamento);
        setAgendamentosDoDia(agendamentosNaData);
        setDataSelecionada(selectedDate);
        setMostrarAgendamentosDoDia(true);
        
        if (selectedAppointment) {
          console.log('Agendamento específico selecionado:', selectedAppointment);
        }
      }
    }
  }, [location.state, agendamentos, setAgendamentosDoDia, setDataSelecionada, setMostrarAgendamentosDoDia]);

  // Filtrar agendamentos convertidos
  const agendamentosConvertidos = agendamentos.map(convertSupabaseToAgendamento);
  const agendamentosFiltrados = filtrarAgendamentos(agendamentosConvertidos);

  // Handlers
  const handleDiaClickWithData = (data: string) => {
    const agendamentosConvertidosParaData = agendamentos
      .filter(ag => ag.data_agendamento === data)
      .map(convertSupabaseToAgendamento);
    handleDiaClick(data, agendamentosConvertidosParaData);
  };

  const handleSalvarNovoAgendamento = async (dadosAgendamento: any) => {
    // Converter dados do formulário para formato do Supabase
    const novoAgendamento = {
      empresa_id: '00000000-0000-0000-0000-000000000001', // TODO: Obter da autenticação
      nome_cliente: dadosAgendamento.nome_cliente || dadosAgendamento.cliente_nome,
      telefone: dadosAgendamento.cliente_telefone || dadosAgendamento.telefone,
      nome_carro: dadosAgendamento.nome_carro,
      servico: dadosAgendamento.servico,
      observacoes: dadosAgendamento.observacoes || '',
      data_agendamento: dadosAgendamento.data_agendamento,
      horario: dadosAgendamento.horario,
      status: 'confirmado' as const,
      equipe_id: dadosAgendamento.equipe_id || undefined,
      cliente_id: undefined // TODO: Implementar relação com clientes
    };

    const resultado = await criarAgendamento(novoAgendamento);
    if (resultado) {
      fecharModals();
    }
  };

  const handleSalvarAgendamentoEditado = async (agendamentoAtualizado: any) => {
    const dadosAtualizados = {
      nome_cliente: agendamentoAtualizado.nome_cliente || agendamentoAtualizado.cliente,
      telefone: agendamentoAtualizado.telefone,
      nome_carro: agendamentoAtualizado.nome_carro || agendamentoAtualizado.carro,
      servico: agendamentoAtualizado.servico,
      observacoes: agendamentoAtualizado.observacoes || '',
      data_agendamento: agendamentoAtualizado.data_agendamento,
      horario: agendamentoAtualizado.horario,
      status: agendamentoAtualizado.status,
      equipe_id: agendamentoAtualizado.equipe_id || undefined
    };

    const resultado = await atualizarAgendamento(agendamentoAtualizado.id, dadosAtualizados);
    if (resultado) {
      fecharModals();
    }
  };

  const handleDeletarAgendamento = async (agendamentoId: string) => {
    const sucesso = await deletarAgendamento(agendamentoId);
    if (sucesso) {
      fecharModals();
    }
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando agendamentos...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

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
            onDayClick={handleDiaClickWithData}
            horariosFuncionamento={horariosFuncionamento}
          />
        ) : (
          <MonthView
            agendamentos={agendamentosFiltrados}
            filteredServices={servicosSelecionados}
            onAgendamentoClick={handleAgendamentoClick}
            onDayClick={handleDiaClickWithData}
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
            onClose={fecharModals}
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
