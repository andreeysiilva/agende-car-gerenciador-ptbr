import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Empresa, NovaEmpresaData, CriarEmpresaResult } from '@/types/empresa';
import { gerarSubdominio, gerarSenhaTemporaria } from '@/utils/empresaUtils';
import { verificarEmailUnico, verificarSubdominioUnico } from './empresaValidation';

export const fetchEmpresas = async () => {
  try {
    console.log('Buscando empresas do Supabase...');
    
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar empresas:', error);
      toast.error('Erro ao carregar empresas');
      return null;
    }

    console.log('Empresas encontradas:', data);
    return data || [];
    
  } catch (error) {
    console.error('Erro inesperado ao buscar empresas:', error);
    toast.error('Erro inesperado ao carregar empresas');
    return null;
  }
};

export const criarEmpresa = async (dadosEmpresa: NovaEmpresaData): Promise<CriarEmpresaResult | null> => {
  try {
    console.log('Iniciando criação de empresa:', dadosEmpresa);

    // Validações
    if (!dadosEmpresa.nome || !dadosEmpresa.email || !dadosEmpresa.telefone || !dadosEmpresa.cnpj_cpf || !dadosEmpresa.plano) {
      toast.error('Preencha todos os campos obrigatórios');
      return null;
    }

    // Verificar email único
    const emailUnico = await verificarEmailUnico(dadosEmpresa.email);
    if (!emailUnico) {
      toast.error('Este email já está cadastrado');
      return null;
    }

    // Gerar subdomínio
    const subdominio = gerarSubdominio(dadosEmpresa.nome);
    const subdominioUnico = await verificarSubdominioUnico(subdominio);
    
    if (!subdominioUnico) {
      toast.error('Nome da empresa gera subdomínio já existente. Tente um nome diferente.');
      return null;
    }

    // Buscar plano
    const { data: planoData, error: planoError } = await supabase
      .from('planos')
      .select('id')
      .eq('nome', dadosEmpresa.plano)
      .single();

    if (planoError) {
      console.error('Erro ao buscar plano:', planoError);
      toast.error('Plano selecionado não encontrado');
      return null;
    }

    // Gerar senha temporária
    const senhaTemporaria = gerarSenhaTemporaria();

    // Dados da empresa
    const novaEmpresa = {
      nome: dadosEmpresa.nome,
      email: dadosEmpresa.email,
      telefone: dadosEmpresa.telefone,
      endereco: dadosEmpresa.endereco || null,
      cnpj_cpf: dadosEmpresa.cnpj_cpf,
      subdominio: subdominio,
      plano_id: planoData.id,
      status: 'Ativo' as const,
      data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      logo_url: dadosEmpresa.logoUrl || null,
      senha_temporaria: senhaTemporaria,
      primeiro_acesso_concluido: false
    };

    // Criar empresa
    const { data: empresaCriada, error: empresaError } = await supabase
      .from('empresas')
      .insert([novaEmpresa])
      .select()
      .single();

    if (empresaError) {
      console.error('Erro ao criar empresa:', empresaError);
      toast.error('Erro ao criar empresa: ' + empresaError.message);
      return null;
    }

    // Criar usuário administrador da empresa usando a função do banco
    const { error: usuarioError } = await supabase.rpc('criar_usuario_empresa', {
      p_email: dadosEmpresa.email,
      p_senha_temporaria: senhaTemporaria,
      p_nome_empresa: dadosEmpresa.nome,
      p_empresa_id: empresaCriada.id
    });

    if (usuarioError) {
      console.error('Erro ao criar usuário da empresa:', usuarioError);
      toast.error('Erro ao criar usuário administrador: ' + usuarioError.message);
      // Não falhar a operação completamente, mas avisar
    }

    // Enviar convite usando a Edge Function
    try {
      console.log('Enviando convite via Edge Function...');
      
      const { data: inviteData, error: inviteError } = await supabase.functions.invoke('send-company-invite', {
        body: {
          email: dadosEmpresa.email,
          nomeEmpresa: dadosEmpresa.nome,
          empresaId: empresaCriada.id,
          senhaTemporaria: senhaTemporaria,
          redirectTo: `${window.location.origin}/cliente/login`
        }
      });

      if (inviteError) {
        console.error('Erro ao invocar Edge Function de convite:', inviteError);
        toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro ao enviar e-mail: ${inviteError.message}`);
      } else if (inviteData?.success) {
        console.log('Convite enviado com sucesso via Edge Function:', inviteData);
        toast.success(`Empresa ${dadosEmpresa.nome} criada! E-mail com credenciais enviado.`);
      } else {
        console.error('Resposta inesperada da Edge Function:', inviteData);
        toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro no envio do e-mail.`);
      }
    } catch (edgeFunctionError) {
      console.error('Erro na chamada da Edge Function:', edgeFunctionError);
      toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro ao enviar e-mail de convite.`);
    }

    console.log('Empresa criada com sucesso:', empresaCriada);

    return {
      empresa: empresaCriada as Empresa,
      credenciais: {
        email: dadosEmpresa.email,
        senha: senhaTemporaria,
        subdominio: `${subdominio}.agendicar.com.br`
      }
    };
    
  } catch (error) {
    console.error('Erro inesperado ao criar empresa:', error);
    toast.error('Erro inesperado ao criar empresa');
    return null;
  }
};

export const atualizarEmpresa = async (id: string, dadosAtualizados: Partial<Empresa>) => {
  try {
    console.log('Atualizando empresa:', id, dadosAtualizados);
    
    const { data, error } = await supabase
      .from('empresas')
      .update(dadosAtualizados)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
      return null;
    }

    console.log('Empresa atualizada com sucesso:', data);
    toast.success('Empresa atualizada com sucesso!');
    return data as Empresa;
    
  } catch (error) {
    console.error('Erro inesperado ao atualizar empresa:', error);
    toast.error('Erro inesperado ao atualizar empresa');
    return null;
  }
};

export const deletarEmpresa = async (id: string) => {
  try {
    console.log('Deletando empresa:', id);
    
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar empresa:', error);
      toast.error('Erro ao deletar empresa');
      return false;
    }

    console.log('Empresa deletada com sucesso');
    toast.success('Empresa deletada com sucesso!');
    return true;
    
  } catch (error) {
    console.error('Erro inesperado ao deletar empresa:', error);
    toast.error('Erro inesperado ao deletar empresa');
    return false;
  }
};
