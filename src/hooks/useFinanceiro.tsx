
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TransacaoFinanceira {
  id: string;
  empresa_id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  descricao?: string;
  status: 'pendente' | 'pago' | 'cancelado';
  data_vencimento?: string;
  data_pagamento?: string;
  metodo_pagamento?: string;
  created_at: string;
  updated_at: string;
  empresa?: {
    nome: string;
    email: string;
    subdominio: string;
  };
}

export interface EstatisticasFinanceiras {
  totalReceitas: number;
  totalDespesas: number;
  receitasPendentes: number;
  receitasPagas: number;
  empresasAtivas: number;
  empresasVencendo: number;
}

export function useFinanceiro() {
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasFinanceiras>({
    totalReceitas: 0,
    totalDespesas: 0,
    receitasPendentes: 0,
    receitasPagas: 0,
    empresasAtivas: 0,
    empresasVencendo: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select(`
          *,
          empresa:empresas(nome, email, subdominio)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar transações:', error);
        toast.error('Erro ao carregar transações financeiras');
        return;
      }

      // Type assertion para garantir que o tipo seja correto
      const transacoesFormatadas = (data || []).map(transacao => ({
        ...transacao,
        tipo: transacao.tipo as 'receita' | 'despesa',
        status: transacao.status as 'pendente' | 'pago' | 'cancelado'
      })) as TransacaoFinanceira[];

      setTransacoes(transacoesFormatadas);
    } catch (error) {
      console.error('Erro inesperado ao buscar transações:', error);
      toast.error('Erro inesperado ao carregar dados financeiros');
    }
  };

  const fetchEstatisticas = async () => {
    try {
      // Buscar estatísticas das transações
      const { data: transacoesData, error: transacoesError } = await supabase
        .from('transacoes')
        .select('tipo, valor, status');

      if (transacoesError) {
        console.error('Erro ao buscar estatísticas de transações:', transacoesError);
      }

      // Buscar estatísticas das empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('status, data_vencimento');

      if (empresasError) {
        console.error('Erro ao buscar estatísticas de empresas:', empresasError);
      }

      // Calcular estatísticas
      const stats: EstatisticasFinanceiras = {
        totalReceitas: 0,
        totalDespesas: 0,
        receitasPendentes: 0,
        receitasPagas: 0,
        empresasAtivas: 0,
        empresasVencendo: 0
      };

      if (transacoesData) {
        transacoesData.forEach(transacao => {
          if (transacao.tipo === 'receita') {
            if (transacao.status === 'pago') {
              stats.receitasPagas += Number(transacao.valor);
            } else if (transacao.status === 'pendente') {
              stats.receitasPendentes += Number(transacao.valor);
            }
            stats.totalReceitas += Number(transacao.valor);
          } else if (transacao.tipo === 'despesa') {
            stats.totalDespesas += Number(transacao.valor);
          }
        });
      }

      if (empresasData) {
        const hoje = new Date();
        const proximoMes = new Date();
        proximoMes.setMonth(proximoMes.getMonth() + 1);

        empresasData.forEach(empresa => {
          if (empresa.status === 'Ativo') {
            stats.empresasAtivas++;
          }
          
          if (empresa.data_vencimento) {
            const vencimento = new Date(empresa.data_vencimento);
            if (vencimento <= proximoMes && vencimento >= hoje) {
              stats.empresasVencendo++;
            }
          }
        });
      }

      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    }
  };

  const confirmarPagamento = async (transacaoId: string) => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .update({
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq('id', transacaoId)
        .select('empresa_id')
        .single();

      if (error) {
        console.error('Erro ao confirmar pagamento:', error);
        toast.error('Erro ao confirmar pagamento');
        return false;
      }

      // Se for uma receita de plano, renovar a empresa
      if (data?.empresa_id) {
        // Usar type assertion para a função RPC customizada
        const { error: empresaError } = await (supabase.rpc as any)('renovar_plano_empresa', {
          p_empresa_id: data.empresa_id
        });

        if (empresaError) {
          console.error('Erro ao renovar plano da empresa:', empresaError);
          toast.warning('Pagamento confirmado, mas erro ao renovar plano da empresa');
        }
      }

      await fetchTransacoes();
      await fetchEstatisticas();
      toast.success('Pagamento confirmado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado ao confirmar pagamento:', error);
      toast.error('Erro inesperado ao confirmar pagamento');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTransacoes(), fetchEstatisticas()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    transacoes,
    estatisticas,
    isLoading,
    confirmarPagamento,
    recarregarDados: async () => {
      await Promise.all([fetchTransacoes(), fetchEstatisticas()]);
    }
  };
}
