
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Administrator, AdministratorFormData } from '@/types/administrator';

export function useAdministradores() {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar administradores
  const loadAdministrators = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .is('empresa_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar administradores:', error);
        toast.error('Erro ao carregar administradores');
        return;
      }

      setAdministrators(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Criar/Editar administrador
  const saveAdministrator = async (formData: AdministratorFormData, editingAdmin: Administrator | null) => {
    try {
      if (editingAdmin) {
        // Editar administrador existente
        const { error } = await supabase
          .from('usuarios')
          .update({
            nome: formData.nome,
            email: formData.email,
            nivel_acesso: formData.nivel_acesso,
            role: formData.nivel_acesso === 'super_admin' ? 'super_admin' : 'admin',
            ativo: formData.ativo
          })
          .eq('id', editingAdmin.id);

        if (error) throw error;
        toast.success('Administrador atualizado com sucesso!');
      } else {
        // Criar novo administrador
        const { error } = await supabase
          .from('usuarios')
          .insert({
            nome: formData.nome,
            email: formData.email,
            nivel_acesso: formData.nivel_acesso,
            role: formData.nivel_acesso === 'super_admin' ? 'super_admin' : 'admin',
            ativo: formData.ativo,
            empresa_id: null
          });

        if (error) throw error;
        toast.success('Administrador criado com sucesso!');
      }

      loadAdministrators();
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar administrador:', error);
      toast.error(`Erro ao salvar: ${error.message}`);
      return false;
    }
  };

  // Deletar administrador
  const deleteAdministrator = async (admin: Administrator) => {
    if (!confirm('Tem certeza que deseja deletar este administrador?')) return false;

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', admin.id);

      if (error) throw error;
      
      toast.success('Administrador deletado com sucesso!');
      loadAdministrators();
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar administrador:', error);
      toast.error(`Erro ao deletar: ${error.message}`);
      return false;
    }
  };

  // Toggle status
  const toggleAdministratorStatus = async (admin: Administrator) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: !admin.ativo })
        .eq('id', admin.id);

      if (error) throw error;
      
      toast.success(`Administrador ${!admin.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      loadAdministrators();
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      toast.error(`Erro ao alterar status: ${error.message}`);
      return false;
    }
  };

  useEffect(() => {
    loadAdministrators();
  }, []);

  return {
    administrators,
    isLoading,
    saveAdministrator,
    deleteAdministrator,
    toggleAdministratorStatus,
    loadAdministrators
  };
}
