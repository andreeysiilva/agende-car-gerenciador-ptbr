
-- Função auxiliar para obter empresa_id do usuário atual
CREATE OR REPLACE FUNCTION get_current_empresa_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT empresa_id 
    FROM usuarios 
    WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função auxiliar para verificar se usuário é admin global
CREATE OR REPLACE FUNCTION is_global_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin' 
    AND empresa_id IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- POLÍTICAS RLS PARA TABELA EMPRESAS
-- =====================================================

-- Política SELECT: Usuários veem apenas sua própria empresa ou admins veem tudo
CREATE POLICY "Usuários podem ver sua própria empresa" 
  ON public.empresas 
  FOR SELECT 
  USING (
    id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Apenas admins globais podem criar empresas
CREATE POLICY "Apenas admins podem criar empresas" 
  ON public.empresas 
  FOR INSERT 
  WITH CHECK (is_global_admin());

-- Política UPDATE: Usuários podem atualizar sua própria empresa ou admins podem atualizar qualquer uma
CREATE POLICY "Usuários podem atualizar sua própria empresa" 
  ON public.empresas 
  FOR UPDATE 
  USING (
    id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Apenas admins globais podem deletar empresas
CREATE POLICY "Apenas admins podem deletar empresas" 
  ON public.empresas 
  FOR DELETE 
  USING (is_global_admin());

-- =====================================================
-- POLÍTICAS RLS PARA TABELA USUARIOS
-- =====================================================

-- Política SELECT: Usuários veem apenas usuários da própria empresa ou admins veem tudo
CREATE POLICY "Usuários podem ver usuários da própria empresa" 
  ON public.usuarios 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar usuários para sua empresa ou admins podem criar qualquer um
CREATE POLICY "Usuários podem criar usuários da própria empresa" 
  ON public.usuarios 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar usuários da própria empresa ou admins podem atualizar qualquer um
CREATE POLICY "Usuários podem atualizar usuários da própria empresa" 
  ON public.usuarios 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar usuários da própria empresa ou admins podem deletar qualquer um
CREATE POLICY "Usuários podem deletar usuários da própria empresa" 
  ON public.usuarios 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- POLÍTICAS RLS PARA TABELA AGENDAMENTOS
-- =====================================================

-- Política SELECT: Usuários veem apenas agendamentos da própria empresa
CREATE POLICY "Usuários podem ver agendamentos da própria empresa" 
  ON public.agendamentos 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar agendamentos para sua empresa
CREATE POLICY "Usuários podem criar agendamentos da própria empresa" 
  ON public.agendamentos 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar agendamentos da própria empresa
CREATE POLICY "Usuários podem atualizar agendamentos da própria empresa" 
  ON public.agendamentos 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar agendamentos da própria empresa
CREATE POLICY "Usuários podem deletar agendamentos da própria empresa" 
  ON public.agendamentos 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- POLÍTICAS RLS PARA TABELA CLIENTES
-- =====================================================

-- Política SELECT: Usuários veem apenas clientes da própria empresa
CREATE POLICY "Usuários podem ver clientes da própria empresa" 
  ON public.clientes 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar clientes para sua empresa
CREATE POLICY "Usuários podem criar clientes da própria empresa" 
  ON public.clientes 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar clientes da própria empresa
CREATE POLICY "Usuários podem atualizar clientes da própria empresa" 
  ON public.clientes 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar clientes da própria empresa
CREATE POLICY "Usuários podem deletar clientes da própria empresa" 
  ON public.clientes 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- POLÍTICAS RLS PARA TABELA EQUIPES
-- =====================================================

-- Política SELECT: Usuários veem apenas equipes da própria empresa
CREATE POLICY "Usuários podem ver equipes da própria empresa" 
  ON public.equipes 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar equipes para sua empresa
CREATE POLICY "Usuários podem criar equipes da própria empresa" 
  ON public.equipes 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar equipes da própria empresa
CREATE POLICY "Usuários podem atualizar equipes da própria empresa" 
  ON public.equipes 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar equipes da própria empresa
CREATE POLICY "Usuários podem deletar equipes da própria empresa" 
  ON public.equipes 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- POLÍTICAS RLS PARA TABELA HORARIOS_FUNCIONAMENTO
-- =====================================================

-- Política SELECT: Usuários veem apenas horários da própria empresa
CREATE POLICY "Usuários podem ver horários da própria empresa" 
  ON public.horarios_funcionamento 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar horários para sua empresa
CREATE POLICY "Usuários podem criar horários da própria empresa" 
  ON public.horarios_funcionamento 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar horários da própria empresa
CREATE POLICY "Usuários podem atualizar horários da própria empresa" 
  ON public.horarios_funcionamento 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar horários da própria empresa
CREATE POLICY "Usuários podem deletar horários da própria empresa" 
  ON public.horarios_funcionamento 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- POLÍTICAS RLS PARA TABELA SERVICOS
-- =====================================================

-- Política SELECT: Usuários veem apenas serviços da própria empresa
CREATE POLICY "Usuários podem ver serviços da própria empresa" 
  ON public.servicos 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar serviços para sua empresa
CREATE POLICY "Usuários podem criar serviços da própria empresa" 
  ON public.servicos 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar serviços da própria empresa
CREATE POLICY "Usuários podem atualizar serviços da própria empresa" 
  ON public.servicos 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar serviços da própria empresa
CREATE POLICY "Usuários podem deletar serviços da própria empresa" 
  ON public.servicos 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- POLÍTICAS RLS PARA TABELA TRANSACOES
-- =====================================================

-- Política SELECT: Usuários veem apenas transações da própria empresa
CREATE POLICY "Usuários podem ver transações da própria empresa" 
  ON public.transacoes 
  FOR SELECT 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política INSERT: Usuários podem criar transações para sua empresa
CREATE POLICY "Usuários podem criar transações da própria empresa" 
  ON public.transacoes 
  FOR INSERT 
  WITH CHECK (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política UPDATE: Usuários podem atualizar transações da própria empresa
CREATE POLICY "Usuários podem atualizar transações da própria empresa" 
  ON public.transacoes 
  FOR UPDATE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- Política DELETE: Usuários podem deletar transações da própria empresa
CREATE POLICY "Usuários podem deletar transações da própria empresa" 
  ON public.transacoes 
  FOR DELETE 
  USING (
    empresa_id = get_current_empresa_id() OR 
    is_global_admin()
  );

-- =====================================================
-- INSERIR USUÁRIO ADMIN GLOBAL PARA TESTES
-- =====================================================

-- Inserir usuário admin global (sem empresa_id) para gerenciamento do sistema
INSERT INTO public.usuarios (nome, email, role, empresa_id, ativo) 
VALUES ('Administrador Sistema', 'admin@agendicar.com', 'admin', NULL, true)
ON CONFLICT DO NOTHING;
