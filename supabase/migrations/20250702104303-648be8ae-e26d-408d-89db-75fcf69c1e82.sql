-- 1. Remover funções relacionadas a GlobalAdmin
DROP FUNCTION IF EXISTS public.check_is_global_admin();
DROP FUNCTION IF EXISTS public.is_global_admin();
DROP FUNCTION IF EXISTS public.is_current_user_global_admin();

-- 2. Atualizar função SuperAdmin para não depender de empresa_id = null
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_data RECORD;
BEGIN
  SELECT role, nivel_acesso INTO user_data
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  -- SuperAdmin é apenas baseado no role e nivel_acesso
  RETURN (user_data.role = 'super_admin' AND 
          user_data.nivel_acesso = 'super_admin');
END;
$$;

-- 3. Garantir que o usuário atual seja SuperAdmin
UPDATE public.usuarios 
SET 
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  ativo = true
WHERE email = 'andreey.siilva@icloud.com';

-- 4. Remover políticas RLS conflitantes e recriar simplificadas
-- Tabela usuarios
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.usuarios;
DROP POLICY IF EXISTS "super_admins_full_access" ON public.usuarios;
DROP POLICY IF EXISTS "company_users_manage_company" ON public.usuarios;

CREATE POLICY "usuarios_super_admin_full_access"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR 
    public.check_is_super_admin()
  );

CREATE POLICY "usuarios_view_own_profile"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Tabela empresas
DROP POLICY IF EXISTS "Global admins can manage all companies" ON public.empresas;
DROP POLICY IF EXISTS "Apenas admins podem criar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Apenas admins podem deletar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria empresa" ON public.empresas;
DROP POLICY IF EXISTS "Usuários podem ver sua própria empresa" ON public.empresas;

CREATE POLICY "super_admin_manage_all_empresas"
  ON public.empresas
  FOR ALL
  TO authenticated
  USING (public.check_is_super_admin());

CREATE POLICY "usuarios_manage_own_empresa"
  ON public.empresas
  FOR ALL
  TO authenticated
  USING (
    id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );

-- 5. Limpar outras tabelas também
-- Agendamentos
DROP POLICY IF EXISTS "Global admins can manage all appointments" ON public.agendamentos;

CREATE POLICY "super_admin_manage_all_agendamentos"
  ON public.agendamentos
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );