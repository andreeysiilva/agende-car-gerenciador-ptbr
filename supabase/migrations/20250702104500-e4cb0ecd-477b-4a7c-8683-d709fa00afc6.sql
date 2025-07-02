-- 5. Recriar políticas RLS simplificadas usando apenas SuperAdmin

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

-- Tabela agendamentos
CREATE POLICY "super_admin_manage_all_agendamentos"
  ON public.agendamentos
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );