
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupabaseAgendamento {
  id: string;
  empresa_id: string;
  cliente_id?: string;
  equipe_id?: string;
  nome_cliente: string;
  telefone: string;
  nome_carro: string;
  servico: string;
  observacoes?: string;
  data_agendamento: string;
  horario: string;
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
  created_at?: string;
  updated_at?: string;
}

export function useSupabaseAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<SupabaseAgendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgendamentos = async () => {
    try {
      setIsLoading(true);
      console.log('Buscando agendamentos do Supabase...');
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_agendamento', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        toast.error('Erro ao carregar agendamentos');
        return;
      }

      console.log('Agendamentos encontrados:', data);
      // Type assertion para garantir compatibilidade
      setAgendamentos((data || []) as SupabaseAgendamento[]);
      
    } catch (error) {
      console.error('Erro inesperado ao buscar agendamentos:', error);
      toast.error('Erro inesperado ao carregar agendamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const criarAgendamento = async (novoAgendamento: Omit<SupabaseAgendamento, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando novo agendamento:', novoAgendamento);
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([novoAgendamento])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        toast.error('Erro ao criar agendamento');
        return null;
      }

      console.log('Agendamento criado com sucesso:', data);
      setAgendamentos(prev => [...prev, data as SupabaseAgendamento]);
      toast.success('Agendamento criado com sucesso!');
      return data as SupabaseAgendamento;
      
    } catch (error) {
      console.error('Erro inesperado ao criar agendamento:', error);
      toast.error('Erro inesperado ao criar agendamento');
      return null;
    }
  };

  const atualizarAgendamento = async (id: string, dadosAtualizados: Partial<SupabaseAgendamento>) => {
    try {
      console.log('Atualizando agendamento:', id, dadosAtualizados);
      
      const { data, error } = await supabase
        .from('agendamentos')
        .update(dadosAtualizados)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar agendamento:', error);
        toast.error('Erro ao atualizar agendamento');
        return null;
      }

      console.log('Agendamento atualizado com sucesso:', data);
      setAgendamentos(prev => prev.map(ag => ag.id === id ? data as SupabaseAgendamento : ag));
      toast.success('Agendamento atualizado com sucesso!');
      return data as SupabaseAgendamento;
      
    } catch (error) {
      console.error('Erro inesperado ao atualizar agendamento:', error);
      toast.error('Erro inesperado ao atualizar agendamento');
      return null;
    }
  };

  const deletarAgendamento = async (id: string) => {
    try {
      console.log('Deletando agendamento:', id);
      
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar agendamento:', error);
        toast.error('Erro ao deletar agendamento');
        return false;
      }

      console.log('Agendamento deletado com sucesso');
      setAgendamentos(prev => prev.filter(ag => ag.id !== id));
      toast.success('Agendamento deletado com sucesso!');
      return true;
      
    } catch (error) {
      console.error('Erro inesperado ao deletar agendamento:', error);
      toast.error('Erro inesperado ao deletar agendamento');
      return false;
    }
  };

  const verificarConflitosHorario = async (data: string, horario: string, agendamentoId?: string) => {
    try {
      let query = supabase
        .from('agendamentos')
        .select('id, nome_cliente, telefone')
        .eq('data_agendamento', data)
        .eq('horario', horario)
        .neq('status', 'cancelado');

      if (agendamentoId) {
        query = query.neq('id', agendamentoId);
      }

      const { data: conflitos, error } = await query;

      if (error) {
        console.error('Erro ao verificar conflitos:', error);
        return [];
      }

      return conflitos || [];
    } catch (error) {
      console.error('Erro inesperado ao verificar conflitos:', error);
      return [];
    }
  };

  // Carregar agendamentos na inicialização
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  return {
    agendamentos,
    isLoading,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
    verificarConflitosHorario,
    recarregarAgendamentos: fetchAgendamentos
  };
}
