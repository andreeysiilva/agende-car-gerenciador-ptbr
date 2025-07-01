
import { supabase } from '@/integrations/supabase/client';

export interface CriarUsuarioAuthParams {
  email: string;
  password: string;
  nomeEmpresa: string;
  subdominio: string;
  empresaId: string;
}

export interface CriarUsuarioAuthResult {
  success: boolean;
  authUserId?: string;
  error?: string;
}

export const criarUsuarioAuth = async (params: CriarUsuarioAuthParams): Promise<CriarUsuarioAuthResult> => {
  try {
    console.log('Criando usuário no Supabase Auth...');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          nome_cliente_empresa: params.nomeEmpresa,
          subdominio: params.subdominio,
          senha_provisoria: params.password,
          empresa_id: params.empresaId
        },
        // Desabilitar envio automático de e-mail de confirmação
        emailRedirectTo: undefined
      }
    });

    if (authError) {
      console.error('Erro ao criar usuário no Supabase Auth:', authError);
      return {
        success: false,
        error: authError.message
      };
    }

    if (!authData.user) {
      console.error('Usuário não foi criado no Supabase Auth - data.user é null');
      return {
        success: false,
        error: 'Usuário não foi criado no sistema de autenticação'
      };
    }

    console.log('Usuário Supabase Auth criado com sucesso:', authData);
    
    return {
      success: true,
      authUserId: authData.user.id
    };
  } catch (error) {
    console.error('Erro inesperado ao criar usuário Auth:', error);
    return {
      success: false,
      error: 'Erro inesperado na criação do usuário'
    };
  }
};

export const vincularUsuarioTabela = async (
  email: string, 
  nomeEmpresa: string, 
  empresaId: string, 
  authUserId: string
): Promise<boolean> => {
  try {
    console.log('Vinculando usuário na tabela usuarios...');

    // Criar/atualizar registro na tabela usuarios
    const { error: upsertError } = await supabase
      .from('usuarios')
      .upsert({
        nome: nomeEmpresa,
        email: email,
        empresa_id: empresaId,
        auth_user_id: authUserId,
        role: 'admin',
        nivel_acesso: 'admin',
        ativo: true,
        primeiro_acesso_concluido: false
      });

    if (upsertError) {
      console.error('Erro ao criar/atualizar registro de usuário:', upsertError);
      return false;
    }

    console.log('Registro de usuário criado/atualizado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro inesperado ao vincular usuário:', error);
    return false;
  }
};

export const limparUsuarioAuth = async (authUserId: string): Promise<void> => {
  try {
    console.log('Limpando usuário do Supabase Auth devido a erro...');
    // Note: A API pública do Supabase não permite deletar usuários diretamente
    // Isso precisaria ser feito via API Admin ou Edge Function
    console.warn('Limpeza de usuário Auth não implementada - requer API Admin');
  } catch (error) {
    console.error('Erro ao limpar usuário Auth:', error);
  }
};
