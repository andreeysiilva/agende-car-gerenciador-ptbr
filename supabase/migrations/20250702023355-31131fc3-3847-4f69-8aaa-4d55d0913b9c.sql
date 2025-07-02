
-- Remover todas as políticas problemáticas da tabela usuarios
DROP POLICY IF EXISTS "Admins de empresa podem gerenciar usuários da empresa" ON public.usuarios;
DROP POLICY IF EXISTS "Global admins can manage all users" ON public.usuarios;
DROP POLICY IF EXISTS "Super admins can manage administrators" ON public.usuarios;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar usuários da própria empresa" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem criar usuários da própria empresa" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem deletar usuários da própria empresa" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem ver usuários da própria empresa" ON public.usuarios;

-- Criar função segura para verificar se é super admin sem recursão
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Buscar diretamente sem usar outras funções que podem causar recursão
  SELECT role, nivel_acesso, empresa_id INTO user_record
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  -- Verificar se é super admin
  RETURN (user_record.role = 'super_admin' AND 
          user_record.nivel_acesso = 'super_admin' AND 
          user_record.empresa_id IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar função segura para verificar se é admin global sem recursão
CREATE OR REPLACE FUNCTION public.is_current_user_global_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Buscar diretamente sem usar outras funções que podem causar recursão
  SELECT role, empresa_id INTO user_record
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  -- Verificar se é admin global
  RETURN (user_record.role IN ('admin', 'super_admin') AND 
          user_record.empresa_id IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar função segura para obter empresa_id do usuário atual sem recursão
CREATE OR REPLACE FUNCTION public.get_current_user_empresa_id()
RETURNS UUID AS $$
DECLARE
  user_empresa_id UUID;
BEGIN
  -- Buscar diretamente sem usar outras funções que podem causar recursão
  SELECT empresa_id INTO user_empresa_id
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN user_empresa_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recriar políticas RLS sem recursão para a tabela usuarios
-- Política para usuários verem seu próprio perfil
CREATE POLICY "Users can view their own profile"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Política para super admins gerenciarem todos os usuários
CREATE POLICY "Super admins can manage all users"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR 
    public.is_current_user_super_admin()
  );

-- Política para admins globais verem todos os usuários
CREATE POLICY "Global admins can view all users"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR 
    public.is_current_user_global_admin()
  );

-- Política para usuários da empresa gerenciarem usuários da mesma empresa
CREATE POLICY "Company users can manage same company users"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR 
    (empresa_id IS NOT NULL AND empresa_id = public.get_current_user_empresa_id()) OR
    public.is_current_user_global_admin()
  );

-- Atualizar as funções existentes para usar as novas funções seguras
CREATE OR REPLACE FUNCTION public.get_current_empresa_id()
RETURNS UUID AS $$
BEGIN
  RETURN public.get_current_user_empresa_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_global_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_current_user_global_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_current_user_super_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
