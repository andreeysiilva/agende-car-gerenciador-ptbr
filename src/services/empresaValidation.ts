
import { supabase } from '@/integrations/supabase/client';

export const verificarEmailUnico = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }

    // Se não encontrou nenhum registro, email é único
    return !data;
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
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar subdomínio:', error);
      return false;
    }

    // Se não encontrou nenhum registro, subdomínio é único
    return !data;
  } catch (error) {
    console.error('Erro inesperado ao verificar subdomínio:', error);
    return false;
  }
};
