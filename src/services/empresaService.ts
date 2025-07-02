import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Empresa, NovaEmpresaData, CriarEmpresaResult } from '@/types/empresa';
import { gerarSubdominio, gerarSenhaTemporaria } from '@/utils/empresaUtils';
import { verificarEmailUnico, verificarSubdominioUnico } from './empresaValidation';

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

    // Determinar data de ativação
    const dataAtivacao = dadosEmpresa.dataAtivacao || new Date().toISOString().split('T')[0];
    
    // Calcular data de vencimento baseada na data de ativação
    const dataVencimento = calcularDataVencimento(new Date(dataAtivacao));

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
      data_ativacao: dataAtivacao,
      data_vencimento: dataVencimento,
      logo_url: dadosEmpresa.logoUrl || null,
      senha_temporaria: senhaTemporaria,
      telegram_chat_id: dadosEmpresa.telegramChatId || null,
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

    // Enviar e-mail de boas-vindas personalizado usando a Edge Function
    try {
      console.log('Enviando e-mail de boas-vindas personalizado via Edge Function...');
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-company-invite', {
        body: {
          email: dadosEmpresa.email,
          nomeEmpresa: dadosEmpresa.nome,
          empresaId: empresaCriada.id,
          subdominio: subdominio,
          senhaTemporaria: senhaTemporaria,
          redirectTo: `https://${subdominio}.agendicar.com.br/cliente/login`
        }
      });

      if (emailError) {
        console.error('Erro ao invocar Edge Function de e-mail:', emailError);
        toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro ao enviar e-mail: ${emailError.message}`);
      } else if (emailData?.success) {
        console.log('E-mail de boas-vindas enviado com sucesso:', emailData);
        toast.success(`Empresa ${dadosEmpresa.nome} criada! E-mail de boas-vindas enviado.`);
      } else {
        console.error('Resposta inesperada da Edge Function:', emailData);
        toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro no envio do e-mail.`);
      }
    } catch (edgeFunctionError) {
      console.error('Erro na chamada da Edge Function:', edgeFunctionError);
      toast.warning(`Empresa ${dadosEmpresa.nome} criada, mas erro ao enviar e-mail de boas-vindas.`);
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

    // Reenviar e-mail usando a mesma Edge Function
    try {
      console.log('Reenviando e-mail de credenciais via Edge Function...');
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-company-invite', {
        body: {
          email: empresa.email,
          nomeEmpresa: empresa.nome,
          empresaId: empresa.id,
          subdominio: empresa.subdominio,
          senhaTemporaria: senhaTemporaria,
          redirectTo: `https://${empresa.subdominio}.agendicar.com.br/cliente/login`,
          isResend: true // Flag para identificar que é um reenvio
        }
      });

      if (emailError) {
        console.error('Erro ao reenviar e-mail via Edge Function:', emailError);
        toast.error(`Erro ao reenviar credenciais: ${emailError.message}`);
        return false;
      } else if (emailData?.success) {
        console.log('E-mail de credenciais reenviado com sucesso:', emailData);
        toast.success(`Credenciais reenviadas para ${empresa.email} com sucesso!`);
        return true;
      } else {
        console.error('Resposta inesperada da Edge Function:', emailData);
        toast.error('Erro ao reenviar credenciais');
        return false;
      }
    } catch (edgeFunctionError) {
      console.error('Erro na chamada da Edge Function:', edgeFunctionError);
      toast.error('Erro ao reenviar credenciais');
      return false;
    }
    
  } catch (error) {
    console.error('Erro inesperado ao reenviar credenciais:', error);
    toast.error('Erro inesperado ao reenviar credenciais');
    return false;
  }
};
