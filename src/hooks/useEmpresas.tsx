
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { Empresa, NovaEmpresaData } from '@/types/empresa';
import { verificarEmailUnico, verificarSubdominioUnico } from '@/services/empresaValidation';
import {
  fetchEmpresas as fetchEmpresasService,
  criarEmpresa as criarEmpresaService,
  atualizarEmpresa as atualizarEmpresaService,
  deletarEmpresa as deletarEmpresaService
} from '@/services/empresaService';

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchEmpresas = async () => {
    setIsLoading(true);
    const data = await fetchEmpresasService(handleError);
    if (data) {
      setEmpresas(data);
    }
    setIsLoading(false);
  };

  const criarEmpresa = async (dadosEmpresa: NovaEmpresaData) => {
    const result = await criarEmpresaService(dadosEmpresa, handleError);
    if (result) {
      setEmpresas(prev => [result.empresa, ...prev]);
    }
    return result;
  };

  const atualizarEmpresa = async (id: string, dadosAtualizados: Partial<Empresa>) => {
    const data = await atualizarEmpresaService(id, dadosAtualizados, handleError);
    if (data) {
      setEmpresas(prev => prev.map(emp => emp.id === id ? data : emp));
    }
    return data;
  };

  const deletarEmpresa = async (id: string) => {
    const success = await deletarEmpresaService(id, handleError);
    if (success) {
      setEmpresas(prev => prev.filter(emp => emp.id !== id));
    }
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
    recarregarEmpresas: fetchEmpresas,
    verificarEmailUnico,
    verificarSubdominioUnico
  };
}

// Export interfaces for backward compatibility
export type { Empresa, NovaEmpresaData };
