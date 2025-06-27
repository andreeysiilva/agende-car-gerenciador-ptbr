import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';
import { toast } from 'sonner';

export interface Empresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  subdominio: string;
  plano_id?: string;
  status: string;
  data_vencimento?: string;
  logo_url?: string;
  senha_temporaria?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NovaEmpresaData {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  plano: string;
  logoUrl?: string;
}

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchEmpresas = async () => {
    try {
      setIsLoading(true);
      console.log('Buscando empresas do Supabase...');
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        handleError(error, { operation: 'fetch' });
        return;
      }

      console.log('Empresas encontradas:', data);
      setEmpresas(data || []);
      
    } catch (error) {
      console.error('Erro inesperado ao buscar empresas:', error);
      handleError(error, { operation: 'fetch' });
    } finally {
      setIsLoading(false);
    }
  };

  const gerarSubdominio = (nome: string): string => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(' ')[0];
  };

  const gerarSenhaTemporaria = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const verificarEmailUnico = async (email: string): Promise<boolean> => {
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

  const verificarSubdominioUnico = async (subdominio: string): Promise<boolean> => {
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

  const criarEmpresa = async (dadosEmpresa: NovaEmpresaData) => {
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
      setEmpresas(prev => [empresaCriada, ...prev]);
      
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

  const atualizarEmpresa = async (id: string, dadosAtualizados: Partial<Empresa>) => {
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
      setEmpresas(prev => prev.map(emp => emp.id === id ? data : emp));
      toast.success('Empresa atualizada com sucesso!');
      return data;
      
    } catch (error) {
      console.error('Erro inesperado ao atualizar empresa:', error);
      handleError(error, { operation: 'update', id, data: dadosAtualizados });
      return null;
    }
  };

  const deletarEmpresa = async (id: string) => {
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
      setEmpresas(prev => prev.filter(emp => emp.id !== id));
      toast.success('Empresa deletada com sucesso!');
      return true;
      
    } catch (error) {
      console.error('Erro inesperado ao deletar empresa:', error);
      handleError(error, { operation: 'delete', id });
      return false;
    }
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
