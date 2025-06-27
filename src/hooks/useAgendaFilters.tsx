
import { useState } from 'react';
import { Agendamento } from './useAgendamentos';

export function useAgendaFilters() {
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<string>("all");

  const toggleServico = (servico: string) => {
    setServicosSelecionados(prev => 
      prev.includes(servico) 
        ? prev.filter(s => s !== servico)
        : [...prev, servico]
    );
  };

  const limparFiltros = () => {
    setServicosSelecionados([]);
    setEquipeSelecionada("all");
  };

  const filtrarAgendamentos = (agendamentos: Agendamento[]) => {
    return agendamentos.filter(agendamento => {
      const servicoMatch = servicosSelecionados.length === 0 || servicosSelecionados.includes(agendamento.servico);
      const equipeMatch = equipeSelecionada === "all" || agendamento.equipe_id === equipeSelecionada;
      return servicoMatch && equipeMatch;
    });
  };

  return {
    servicosSelecionados,
    equipeSelecionada,
    setEquipeSelecionada,
    toggleServico,
    limparFiltros,
    filtrarAgendamentos
  };
}
