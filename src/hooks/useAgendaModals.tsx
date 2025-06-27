
import { useState } from 'react';
import { Agendamento } from './useAgendamentos';

export function useAgendaModals() {
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  const [mostrarNovoForm, setMostrarNovoForm] = useState(false);
  const [mostrarEditForm, setMostrarEditForm] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [agendamentosDoDia, setAgendamentosDoDia] = useState<Agendamento[]>([]);
  const [mostrarAgendamentosDoDia, setMostrarAgendamentosDoDia] = useState(false);

  const handleAgendamentoClick = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setMostrarEditForm(true);
  };

  const handleDiaClick = (data: string, agendamentos: Agendamento[]) => {
    const agendamentosNaData = agendamentos.filter(ag => ag.data_agendamento === data);
    setAgendamentosDoDia(agendamentosNaData);
    setDataSelecionada(data);
    setMostrarAgendamentosDoDia(true);
  };

  const fecharModals = () => {
    setMostrarEditForm(false);
    setAgendamentoSelecionado(null);
    setMostrarNovoForm(false);
    setMostrarAgendamentosDoDia(false);
  };

  return {
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
    setAgendamentoSelecionado,
    setAgendamentosDoDia,
    setDataSelecionada,
    setMostrarAgendamentosDoDia
  };
}
