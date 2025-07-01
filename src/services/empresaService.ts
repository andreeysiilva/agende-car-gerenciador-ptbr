import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Empresa, NovaEmpresaData, CriarEmpresaResult } from '@/types/empresa';
import { gerarSubdominio, gerarSenhaTemporaria } from '@/utils/empresaUtils';
import { 
  validarDadosEmpresa, 
  verificarEmailUnico, 
  verificarSubdominioUnico 
} from '@/utils/empresaValidationUtils';
import { 
  criarUsuarioAuth, 
  vincularUsuarioTabela, 
  limparUsuarioAuth 
} from '@/utils/authUtils';
import { EnviarEmailParams, EnviarEmailResult } from '@/utils/emailUtils';

// Função para calcular a data de vencimento baseada na regra de negócio
export const calcularDataVencimento = (dataBase?: Date): string => {
  const hoje = dataBase || new Date();
  const proximoMes = new Date(hoje);
  proximoMes.setMonth(proximoMes.getMonth() + 1);
  
  // Se o dia atual não existe no próximo mês (ex: 31 jan -> 28/29 fev)
  const diaOriginal = hoje.getDate();
  const ultimoDiaProximoMes = new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).getDate();
  
  if (diaOriginal > ultimoDiaProximoMes) {
    proximoMes.setDate(ultimoDiaProximoMes);
  } else {
    proximoMes.setDate(diaOriginal);
  }
  
  return proximoMes.toISOString().split('T')[0];
};

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

export const buscarEmpresaPorId = async (id: string): Promise<Empresa | null> => {
  try {
    console.log('Buscando empresa por ID:', id);
    
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar empresa por ID:', error);
      toast.error('Erro ao carregar empresa');
      return null;
    }

    console.log('Empresa encontrada:', data);
    return data as Empresa;
    
  } catch (error) {
    console.error('Erro inesperado ao buscar empresa:', error);
    toast.error('Erro inesperado ao carregar empresa');
    return null;
  }
};

const enviarEmailCredenciais = async (params: EnviarEmailParams): Promise<EnviarEmailResult> => {
  try {
    console.log('Enviando e-mail de credenciais via Edge Function...');
    
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-company-invite', {
      body: {
        email: params.email,
        nomeEmpresa: params.nomeEmpresa,
        empresaId: params.empresaId,
        subdominio: params.subdominio,
        senhaTemporaria: params.senhaTemporaria,
        redirectTo: `https://${params.subdominio}.agendicar.com.br/cliente/login`,
        isResend: params.isResend || false
      }
    });

    if (emailError) {
      console.error('Erro ao invocar Edge Function de e-mail:', emailError);
      return {
        success: false,
        error: emailError.message
      };
    }

    if (emailData?.success) {
      console.log('E-mail de credenciais enviado com sucesso:', emailData);
      return { success: true };
    } else {
      console.error('Resposta inesperada da Edge Function:', emailData);
      return {
        success: false,
        error: 'Erro no envio do e-mail'
      };
    }
  } catch (error) {
    console.error('Erro na chamada da Edge Function:', error);
    return {
      success: false,
      error: 'Erro inesperado no envio do e-mail'
    };
  }
};

const limparEmpresaCriada = async (empresaId: string): Promise<void> => {
  try {
    console.log('Removendo empresa devido a erro na criação...');
    await supabase.from('empresas').delete().eq('id', empresaId);
    console.log('Empresa removida com sucesso');
  } catch (cleanupError) {
    console.error('Erro ao limpar empresa:', cleanupError);
  }
};

export const criarEmpresa = async (dadosEmpresa: NovaEmpresaData): Promise<CriarEmpresaResult | null> => {
  const transactionId = `empresa_${Date.now()}`;
  console.log(`[${transactionId}] Iniciando criação de empresa:`, dadosEmpresa);

  try {
    // ETAPA 1: Validações iniciais
    console.log(`[${transactionId}] Etapa 1: Validações iniciais`);
    
    const validationError = validarDadosEmpresa(dadosEmpresa);
    if (validationError) {
      toast.error(validationError);
      return null;
    }

    // Verificar email único
    const emailUnico = await verificarEmailUnico(dadosEmpresa.email);
    if (!emailUnico) {
      toast.error('Este email já está cadastrado');
      return null;
    }

    // Gerar e verificar subdomínio
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

    // ETAPA 2: Gerar senha temporária
    console.log(`[${transactionId}] Etapa 2: Gerando senha temporária`);
    const senhaTemporaria = gerarSenhaTemporaria();

    // ETAPA 3: Criar usuário no Supabase Auth primeiro
    console.log(`[${transactionId}] Etapa 3: Criando usuário no Supabase Auth`);
    const authResult = await criarUsuarioAuth({
      email: dadosEmpresa.email,
      password: senhaTemporaria,
      nomeEmpresa: dadosEmpresa.nome,
      subdominio: subdominio,
      empresaId: 'temp' // Será atualizado após criar a empresa
    });

    if (!authResult.success) {
      toast.error('Erro ao criar usuário de autenticação: ' + authResult.error);
      return null;
    }

    // ETAPA 4: Criar empresa no banco
    console.log(`[${transactionId}] Etapa 4: Criando empresa no banco`);
    
    const dataAtivacao = dadosEmpresa.dataAtivacao || new Date().toISOString().split('T')[0];
    const dataVencimento = calcularDataVencimento(new Date(dataAtivacao));

    const novaEmpresa = {
      nome: dadosEmpresa.nome,
      email: dadosEmpresa.email,
      telefone: dadosEmpresa.telefone,
      endereco: dadosEmpresa.endereco || null,
      cnpj_cpf: dadosEmpresa.cnpj_cpf,
      subdominio: subdominio,
      plano_id: planoData.id,
      status: 'Ativo' as const,
      data_ativacao: dataAtivacao,
      data_vencimento: dataVencimento,
      logo_url: dadosEmpresa.logoUrl || null,
      senha_temporaria: senhaTemporaria,
      telegram_chat_id: dadosEmpresa.telegramChatId || null,
      primeiro_acesso_concluido: false
    };

    const { data: empresaCriada, error: empresaError } = await supabase
      .from('empresas')
      .insert([novaEmpresa])
      .select()
      .single();

    if (empresaError) {
      console.error('Erro ao criar empresa:', empresaError);
      // Limpar usuário Auth criado
      if (authResult.authUserId) {
        await limparUsuarioAuth(authResult.authUserId);
      }
      toast.error('Erro ao criar empresa: ' + empresaError.message);
      return null;
    }

    console.log(`[${transactionId}] Empresa criada no banco:`, empresaCriada);

    // ETAPA 5: Vincular usuário na tabela usuarios
    console.log(`[${transactionId}] Etapa 5: Vinculando usuário na tabela usuarios`);
    const usuarioVinculado = await vincularUsuarioTabela(
      dadosEmpresa.email,
      dadosEmpresa.nome,
      empresaCriada.id,
      authResult.authUserId!
    );

    if (!usuarioVinculado) {
      console.warn('Usuário criado no Auth mas não vinculado na tabela usuarios');
      // Não falhar a operação por isso, mas avisar
    }

    // ETAPA 6: Enviar e-mail personalizado
    console.log(`[${transactionId}] Etapa 6: Enviando e-mail de boas-vindas`);
    const emailResult = await enviarEmailCredenciais({
      email: dadosEmpresa.email,
      nomeEmpresa: dadosEmpresa.nome,
      empresaId: empresaCriada.id,
      subdominio: subdominio,
      senhaTemporaria: senhaTemporaria,
      isResend: false
    });

    if (!emailResult.success) {
      console.error('Erro ao enviar e-mail, mas empresa foi criada:', emailResult.error);
      toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro ao enviar e-mail: ${emailResult.error}`);
    } else {
      toast.success(`Empresa ${dadosEmpresa.nome} criada! E-mail de boas-vindas enviado.`);
    }

    console.log(`[${transactionId}] Processo de criação de empresa concluído com sucesso!`);

    return {
      empresa: empresaCriada as Empresa,
      credenciais: {
        email: dadosEmpresa.email,
        senha: senhaTemporaria,
        subdominio: `${subdominio}.agendicar.com.br`
      }
    };
    
  } catch (error) {
    console.error(`[${transactionId}] Erro inesperado ao criar empresa:`, error);
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

export const renovarPlanoEmpresa = async (empresaId: string): Promise<boolean> => {
  try {
    console.log('Renovando plano da empresa:', empresaId);
    
    // Buscar empresa atual
    const empresa = await buscarEmpresaPorId(empresaId);
    if (!empresa) {
      toast.error('Empresa não encontrada');
      return false;
    }

    // Calcular nova data de vencimento baseada na data atual de vencimento
    const dataVencimentoAtual = empresa.data_vencimento ? new Date(empresa.data_vencimento) : new Date();
    const novaDataVencimento = calcularDataVencimento(dataVencimentoAtual);

    // Atualizar empresa
    const empresaAtualizada = await atualizarEmpresa(empresaId, {
      data_vencimento: novaDataVencimento,
      status: 'Ativo'
    });

    if (empresaAtualizada) {
      console.log('Plano renovado com sucesso. Nova data de vencimento:', novaDataVencimento);
      toast.success('Plano renovado com sucesso!');
      return true;
    }

    return false;
    
  } catch (error) {
    console.error('Erro inesperado ao renovar plano:', error);
    toast.error('Erro inesperado ao renovar plano');
    return false;
  }
};

export const reenviarCredenciaisEmpresa = async (empresaId: string): Promise<boolean> => {
  try {
    console.log('Reenviando credenciais para empresa:', empresaId);
    
    // Buscar dados da empresa
    const empresa = await buscarEmpresaPorId(empresaId);
    if (!empresa) {
      toast.error('Empresa não encontrada');
      return false;
    }

    // Validar se tem os dados necessários
    if (!empresa.email || !empresa.subdominio) {
      toast.error('Dados da empresa incompletos para reenvio');
      return false;
    }

    // Se não tem senha temporária, gerar uma nova
    let senhaTemporaria = empresa.senha_temporaria;
    if (!senhaTemporaria) {
      senhaTemporaria = gerarSenhaTemporaria();
      
      // Atualizar a empresa com a nova senha temporária
      await atualizarEmpresa(empresaId, { senha_temporaria: senhaTemporaria });
    }

    // Reenviar e-mail
    const emailResult = await enviarEmailCredenciais({
      email: empresa.email,
      nomeEmpresa: empresa.nome,
      empresaId: empresa.id,
      subdominio: empresa.subdominio,
      senhaTemporaria: senhaTemporaria,
      isResend: true
    });

    if (!emailResult.success) {
      toast.error(`Erro ao reenviar credenciais: ${emailResult.error}`);
      return false;
    }

    toast.success(`Credenciais reenviadas para ${empresa.email} com sucesso!`);
    return true;
    
  } catch (error) {
    console.error('Erro inesperado ao reenviar credenciais:', error);
    toast.error('Erro inesperado ao reenviar credenciais');
    return false;
  }
};
