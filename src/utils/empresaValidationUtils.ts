
import { supabase } from '@/integrations/supabase/client';

export const validarDadosEmpresa = (dadosEmpresa: any): string | null => {
  if (!dadosEmpresa.nome || !dadosEmpresa.email || !dadosEmpresa.telefone || !dadosEmpresa.cnpj_cpf || !dadosEmpresa.plano) {
    return 'Preencha todos os campos obrigatórios';
  }
  return null;
};

export const verificarEmailUnico = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      // Erro PGRST116 = nenhum registro encontrado, ou seja, email é único
      return true;
    }

    if (error) {
      console.error('Erro ao verificar email único:', error);
      return false;
    }

    // Se encontrou dados, email já existe
    return false;
  } catch (error) {
    console.error('Erro inesperado ao verificar email:', error);
    return false;
  }
};

export const verificarSubdominioUnico = async (subdominio: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .eq('subdominio', subdominio)
      .single();

    if (error && error.code === 'PGRST116') {
      // Erro PGRST116 = nenhum registro encontrado, ou seja, subdomínio é único
      return true;
    }

    if (error) {
      console.error('Erro ao verificar subdomínio único:', error);
      return false;
    }

    // Se encontrou dados, subdomínio já existe
    return false;
  } catch (error) {
    console.error('Erro inesperado ao verificar subdomínio:', error);
    return false;
  }
};
