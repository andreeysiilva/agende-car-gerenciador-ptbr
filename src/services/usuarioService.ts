
import { supabase } from '@/integrations/supabase/client';
import { Usuario, NovoUsuarioData, CriarUsuarioResult } from '@/types/usuario';
import { toast } from 'sonner';

// Gerar senha temporária
const gerarSenhaTemporaria = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let senha = '';
  for (let i = 0; i < 8; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
};

export const fetchUsuariosEmpresa = async (): Promise<Usuario[] | null> => {
  try {
    console.log('Buscando usuários da empresa...');
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
      return null;
    }

    console.log('Usuários carregados:', data);
    return data as Usuario[];
  } catch (error) {
    console.error('Erro inesperado ao buscar usuários:', error);
    toast.error('Erro inesperado ao carregar usuários');
    return null;
  }
};

export const criarUsuarioEmpresa = async (dadosUsuario: NovoUsuarioData): Promise<CriarUsuarioResult | null> => {
  try {
    console.log('Criando usuário da empresa...', dadosUsuario);
    
    const senhaTemporaria = gerarSenhaTemporaria();
    
    // Primeiro, criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dadosUsuario.email,
      password: senhaTemporaria,
      options: {
        data: {
          nome: dadosUsuario.nome,
          senha_provisoria: senhaTemporaria,
          role_empresa: dadosUsuario.role_empresa
        }
      }
    });

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError);
      toast.error('Erro ao criar usuário: ' + authError.message);
      return null;
    }

    if (!authData.user) {
      console.error('Usuário não foi criado no Auth');
      toast.error('Erro ao criar usuário no sistema de autenticação');
      return null;
    }

    // Aguardar um pouco para o trigger processar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Buscar o usuário criado na tabela usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (usuarioError || !usuarioData) {
      console.error('Erro ao buscar usuário criado:', usuarioError);
      toast.error('Usuário criado mas houve erro na vinculação');
      return null;
    }

    // Atualizar com os dados específicos da empresa
    const { data: usuarioAtualizado, error: updateError } = await supabase
      .from('usuarios')
      .update({
        role_empresa: dadosUsuario.role_empresa,
        primeiro_acesso_concluido: false
      })
      .eq('id', usuarioData.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar usuário:', updateError);
      toast.error('Erro ao configurar usuário');
      return null;
    }

    console.log('Usuário criado com sucesso:', usuarioAtualizado);
    toast.success('Usuário criado com sucesso!');
    
    return {
      usuario: usuarioAtualizado as Usuario,
      senhaTemporaria
    };
  } catch (error) {
    console.error('Erro inesperado ao criar usuário:', error);
    toast.error('Erro inesperado ao criar usuário');
    return null;
  }
};

export const atualizarUsuarioEmpresa = async (id: string, dadosAtualizados: Partial<Usuario>): Promise<Usuario | null> => {
  try {
    console.log('Atualizando usuário...', id, dadosAtualizados);
    
    const { data, error } = await supabase
      .from('usuarios')
      .update(dadosAtualizados)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
      return null;
    }

    console.log('Usuário atualizado com sucesso:', data);
    toast.success('Usuário atualizado com sucesso!');
    return data as Usuario;
  } catch (error) {
    console.error('Erro inesperado ao atualizar usuário:', error);
    toast.error('Erro inesperado ao atualizar usuário');
    return null;
  }
};

export const deletarUsuarioEmpresa = async (id: string): Promise<boolean> => {
  try {
    console.log('Deletando usuário...', id);
    
    // Buscar o auth_user_id antes de deletar
    const { data: userData, error: fetchError } = await supabase
      .from('usuarios')
      .select('auth_user_id, email')
      .eq('id', id)
      .single();

    if (fetchError || !userData) {
      console.error('Erro ao buscar dados do usuário:', fetchError);
      toast.error('Erro ao buscar dados do usuário');
      return false;
    }

    // Deletar da tabela usuarios (irá deletar do Auth via trigger se configurado)
    const { error: deleteError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erro ao deletar usuário:', deleteError);
      toast.error('Erro ao deletar usuário');
      return false;
    }

    console.log('Usuário deletado com sucesso');
    toast.success('Usuário removido com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro inesperado ao deletar usuário:', error);
    toast.error('Erro inesperado ao deletar usuário');
    return false;
  }
};

export const resetarSenhaUsuario = async (email: string): Promise<boolean> => {
  try {
    console.log('Resetando senha do usuário...', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('Erro ao resetar senha:', error);
      toast.error('Erro ao enviar e-mail de reset de senha');
      return false;
    }

    console.log('E-mail de reset enviado com sucesso');
    toast.success('E-mail de reset de senha enviado!');
    return true;
  } catch (error) {
    console.error('Erro inesperado ao resetar senha:', error);
    toast.error('Erro inesperado ao resetar senha');
    return false;
  }
};
