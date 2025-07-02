-- 6. Recriar políticas para demais tabelas

-- Clientes
CREATE POLICY "usuarios_manage_clientes_empresa"
  ON public.clientes
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );

-- Equipes
CREATE POLICY "usuarios_manage_equipes_empresa"
  ON public.equipes
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );

-- Horários funcionamento
CREATE POLICY "usuarios_manage_horarios_empresa"
  ON public.horarios_funcionamento
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );

-- Serviços
CREATE POLICY "usuarios_manage_servicos_empresa"
  ON public.servicos
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );

-- Transações
CREATE POLICY "usuarios_manage_transacoes_empresa"
  ON public.transacoes
  FOR ALL
  TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() OR 
    public.check_is_super_admin()
  );