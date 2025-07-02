
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Empresa, NovaEmpresaData } from '@/types/empresa';
import { verificarEmailUnico, verificarSubdominioUnico } from '@/services/empresaValidation';
import {
  fetchEmpresas as fetchEmpresasService,
  buscarEmpresaPorId as buscarEmpresaPorIdService,
  criarEmpresa as criarEmpresaService,
  atualizarEmpresa as atualizarEmpresaService,
  deletarEmpresa as deletarEmpresaService,
  renovarPlanoEmpresa as renovarPlanoEmpresaService,
  reenviarCredenciaisEmpresa as reenviarCredenciaisEmpresaService
} from '@/services/empresaService';
import { supabase } from '@/integrations/supabase/client';

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmpresas = async () => {
    setIsLoading(true);
    try {
      // Verificar permissões antes de buscar empresas
      const { data: permissionsData } = await supabase.rpc('debug_user_permissions');
      console.log('🔍 Permissões do usuário:', permissionsData);
      
      const data = await fetchEmpresasService();
      if (data) {
        setEmpresas(data as Empresa[]);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setIsLoading(false);
    }
  };

  const buscarEmpresaPorId = async (id: string): Promise<Empresa | null> => {
    return await buscarEmpresaPorIdService(id);
  };

  const criarEmpresa = async (dadosEmpresa: NovaEmpresaData) => {
    try {
      console.log('🏢 Criando empresa:', dadosEmpresa);
      
      // Verificar permissões antes de criar
      const { data: permissionsData } = await supabase.rpc('debug_user_permissions');
      console.log('🔍 Permissões para criação:', permissionsData);
      
      if (!permissionsData?.[0]?.is_super_admin) {
        toast.error('Você não tem permissão para criar empresas');
        return null;
      }
      
      const result = await criarEmpresaService(dadosEmpresa);
      if (result) {
        setEmpresas(prev => [result.empresa as Empresa, ...prev]);
        toast.success('Empresa criada com sucesso!');
      }
      return result;
    } catch (error) {
      console.error('Erro detalhado na criação de empresa:', error);
      toast.error('Erro ao criar empresa. Verifique suas permissões.');
      return null;
    }
  };

  const atualizarEmpresa = async (id: string, dadosAtualizados: Partial<Empresa>) => {
    const data = await atualizarEmpresaService(id, dadosAtualizados);
    if (data) {
      setEmpresas(prev => prev.map(emp => emp.id === id ? data as Empresa : emp));
    }
    return data;
  };

  const deletarEmpresa = async (id: string) => {
    const success = await deletarEmpresaService(id);
    if (success) {
      setEmpresas(prev => prev.filter(emp => emp.id !== id));
    }
    return success;
  };

  const renovarPlanoEmpresa = async (empresaId: string) => {
    const success = await renovarPlanoEmpresaService(empresaId);
    if (success) {
      // Recarregar a lista de empresas para obter os dados atualizados
      await fetchEmpresas();
    }
    return success;
  };

  const reenviarCredenciais = async (empresaId: string) => {
    const success = await reenviarCredenciaisEmpresaService(empresaId);
    return success;
  };

  // Carregar empresas na inicialização
  useEffect(() => {
    fetchEmpresas();
  }, []);

  return {
    empresas,
    isLoading,
    criarEmpresa,
    atualizarEmpresa,
    deletarEmpresa,
    buscarEmpresaPorId,
    renovarPlanoEmpresa,
    recarregarEmpresas: fetchEmpresas,
    verificarEmailUnico,
    verificarSubdominioUnico,
    reenviarCredenciais
  };
}

export type { Empresa, NovaEmpresaData };
