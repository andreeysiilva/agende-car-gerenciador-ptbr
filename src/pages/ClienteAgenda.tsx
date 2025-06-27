
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
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { useAgendaFilters } from "@/hooks/useAgendaFilters";
import { useAgendaModals } from "@/hooks/useAgendaModals";
import { servicosDisponiveis, equipesDisponiveis, horariosFuncionamento } from "@/constants/agendaConstants";
import { isDiaFuncionando } from "@/utils/agendaUtils";

export default function ClienteAgenda() {
  const location = useLocation();
  const [visualizacao, setVisualizacao] = useState<'semana' | 'mes'>('semana');
  
  // Custom hooks
  const { 
    agendamentos, 
    handleSalvarNovoAgendamento, 
    handleSalvarAgendamentoEditado, 
    handleDeletarAgendamento 
  } = useAgendamentos();
  
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
        const agendamentosNaData = agendamentos.filter(ag => ag.data_agendamento === selectedDate);
        setAgendamentosDoDia(agendamentosNaData);
        setDataSelecionada(selectedDate);
        setMostrarAgendamentosDoDia(true);
        
        if (selectedAppointment) {
          console.log('Agendamento específico selecionado:', selectedAppointment);
        }
      }
    }
  }, [location.state, agendamentos, setAgendamentosDoDia, setDataSelecionada, setMostrarAgendamentosDoDia]);

  // Filtrar agendamentos
  const agendamentosFiltrados = filtrarAgendamentos(agendamentos);

  // Handlers
  const handleDiaClickWithData = (data: string) => {
    handleDiaClick(data, agendamentos);
  };

  const handleSalvarAgendamentoEditadoAndClose = (agendamentoAtualizado: any) => {
    handleSalvarAgendamentoEditado(agendamentoAtualizado);
    fecharModals();
  };

  const handleDeletarAgendamentoAndClose = (agendamentoId: string) => {
    handleDeletarAgendamento(agendamentoId);
    fecharModals();
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
            onSave={handleSalvarAgendamentoEditadoAndClose}
            onDelete={handleDeletarAgendamentoAndClose}
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
