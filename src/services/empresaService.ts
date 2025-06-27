
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Empresa, NovaEmpresaData, CriarEmpresaResult } from '@/types/empresa';
import { gerarSubdominio, gerarSenhaTemporaria } from '@/utils/empresaUtils';
import { verificarEmailUnico, verificarSubdominioUnico } from './empresaValidation';
import { telegramService } from './telegramService';

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
    if (!dadosEmpresa.nome || !dadosEmpresa.email || !dadosEmpresa.telefone || !dadosEmpresa.plano) {
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
      subdominio: subdominio,
      plano_id: planoData.id,
      status: 'Ativo',
      data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      logo_url: dadosEmpresa.logoUrl || null,
      senha_temporaria: senhaTemporaria,
      telegram_chat_id: dadosEmpresa.telegramChatId || null
    };

    // Criar empresa
    const { data: empresaCriada, error: empresaError } = await supabase
      .from('empresas')
      .insert([novaEmpresa])
      .select()
      .single();

    if (empresaError) {
      console.error('Erro ao criar empresa:', empresaError);
      toast.error('Erro ao criar empresa');
      return null;
    }

    // Criar usuário administrador da empresa
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        nome: dadosEmpresa.nome,
        email: dadosEmpresa.email,
        empresa_id: empresaCriada.id,
        role: 'admin',
        ativo: true
      }]);

    if (usuarioError) {
      console.error('Erro ao criar usuário da empresa:', usuarioError);
      // Não falhar a operação, apenas loggar o erro
    }

    // Tentar enviar via Telegram se Chat ID foi fornecido
    if (dadosEmpresa.telegramChatId) {
      try {
        const enviadoTelegram = await telegramService.enviarSenhaTemporaria(
          dadosEmpresa.telegramChatId,
          dadosEmpresa.nome,
          senhaTemporaria,
          subdominio
        );

        if (enviadoTelegram) {
          console.log('Senha enviada via Telegram com sucesso');
          toast.success(`Empresa criada e senha enviada via Telegram!`);
        } else {
          console.error('Falha ao enviar via Telegram');
          toast.warning('Empresa criada, mas falha no envio via Telegram');
        }
      } catch (error) {
        console.error('Erro na integração Telegram:', error);
        toast.warning('Empresa criada, mas erro na comunicação com Telegram');
      }
    } else {
      toast.success(`Empresa ${dadosEmpresa.nome} criada com sucesso!`);
    }

    console.log('Empresa criada com sucesso:', empresaCriada);

    return {
      empresa: empresaCriada,
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
    return data;
    
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
