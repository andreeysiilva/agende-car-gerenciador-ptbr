
import { useState } from 'react';

// Types
export interface Agendamento {
  id: string;
  cliente: string;
  nome_cliente: string;
  telefone: string;
  email: string;
  carro: string;
  nome_carro: string;
  servico: string;
  horario: string;
  data_agendamento: string;
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
  observacoes: string;
  equipe_id: string;
  equipe_nome: string;
}

// Initial data
const agendamentosExemplo: Agendamento[] = [
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
    status: "confirmado",
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
    status: "pendente",
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
    status: "concluido",
    observacoes: "Cliente VIP",
    equipe_id: "1",
    equipe_nome: "Equipe Principal"
  }
];

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendamentosExemplo);

  const handleSalvarNovoAgendamento = (novoAgendamento: Agendamento) => {
    setAgendamentos(prev => [...prev, novoAgendamento]);
  };

  const handleSalvarAgendamentoEditado = (agendamentoAtualizado: Agendamento) => {
    setAgendamentos(prev => 
      prev.map(ag => ag.id === agendamentoAtualizado.id ? agendamentoAtualizado : ag)
    );
  };

  const handleDeletarAgendamento = (agendamentoId: string) => {
    setAgendamentos(prev => prev.filter(ag => ag.id !== agendamentoId));
  };

  return {
    agendamentos,
    handleSalvarNovoAgendamento,
    handleSalvarAgendamentoEditado,
    handleDeletarAgendamento
  };
}
