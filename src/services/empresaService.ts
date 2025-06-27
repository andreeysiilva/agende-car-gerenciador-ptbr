
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Empresa, NovaEmpresaData, CriarEmpresaResult } from '@/types/empresa';
import { gerarSubdominio, gerarSenhaTemporaria } from '@/utils/empresaUtils';
import { verificarEmailUnico, verificarSubdominioUnico } from './empresaValidation';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const fetchEmpresas = async (handleError: ReturnType<typeof useErrorHandler>['handleError']) => {
  try {
    console.log('Buscando empresas do Supabase...');
    
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar empresas:', error);
      handleError(error, { operation: 'fetch' });
      return null;
    }

    console.log('Empresas encontradas:', data);
    return data || [];
    
  } catch (error) {
    console.error('Erro inesperado ao buscar empresas:', error);
    handleError(error, { operation: 'fetch' });
    return null;
  }
};

export const criarEmpresa = async (
  dadosEmpresa: NovaEmpresaData,
  handleError: ReturnType<typeof useErrorHandler>['handleError']
): Promise<CriarEmpresaResult | null> => {
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
      senha_temporaria: senhaTemporaria
    };

    // Criar empresa
    const { data: empresaCriada, error: empresaError } = await supabase
      .from('empresas')
      .insert([novaEmpresa])
      .select()
      .single();

    if (empresaError) {
      console.error('Erro ao criar empresa:', empresaError);
      handleError(empresaError, { operation: 'create', data: novaEmpresa });
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

    console.log('Empresa criada com sucesso:', empresaCriada);
    
    toast.success(
      `Empresa ${dadosEmpresa.nome} criada com sucesso!\n` +
      `Subdomínio: ${subdominio}.agendicar.com\n` +
      `Login: ${dadosEmpresa.email}\n` +
      `Senha temporária: ${senhaTemporaria}`,
      { duration: 10000 }
    );

    return {
      empresa: empresaCriada,
      credenciais: {
        email: dadosEmpresa.email,
        senha: senhaTemporaria,
        subdominio: `${subdominio}.agendicar.com`
      }
    };
    
  } catch (error) {
    console.error('Erro inesperado ao criar empresa:', error);
    handleError(error, { operation: 'create', data: dadosEmpresa });
    return null;
  }
};

export const atualizarEmpresa = async (
  id: string,
  dadosAtualizados: Partial<Empresa>,
  handleError: ReturnType<typeof useErrorHandler>['handleError']
) => {
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
      handleError(error, { operation: 'update', id, data: dadosAtualizados });
      return null;
    }

    console.log('Empresa atualizada com sucesso:', data);
    toast.success('Empresa atualizada com sucesso!');
    return data;
    
  } catch (error) {
    console.error('Erro inesperado ao atualizar empresa:', error);
    handleError(error, { operation: 'update', id, data: dadosAtualizados });
    return null;
  }
};

export const deletarEmpresa = async (
  id: string,
  handleError: ReturnType<typeof useErrorHandler>['handleError']
) => {
  try {
    console.log('Deletando empresa:', id);
    
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar empresa:', error);
      handleError(error, { operation: 'delete', id });
      return false;
    }

    console.log('Empresa deletada com sucesso');
    toast.success('Empresa deletada com sucesso!');
    return true;
    
  } catch (error) {
    console.error('Erro inesperado ao deletar empresa:', error);
    handleError(error, { operation: 'delete', id });
    return false;
  }
};
