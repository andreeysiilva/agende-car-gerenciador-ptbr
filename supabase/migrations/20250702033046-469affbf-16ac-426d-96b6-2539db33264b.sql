
-- 1. Criar empresa administrativa para o portal admin
INSERT INTO public.empresas (
  id,
  nome,
  email,
  subdominio,
  telefone,
  status,
  data_ativacao,
  primeiro_acesso_concluido
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'AgendiCar Admin Portal',
  'admin@agendicar.com',  
  'admin',
  '(00) 0000-0000',
  'Ativo',
  NOW(),
  true
) ON CONFLICT (id) DO UPDATE SET
  nome = 'AgendiCar Admin Portal',
  email = 'admin@agendicar.com',
  primeiro_acesso_concluido = true;

-- 2. Associar o usuário super admin à empresa administrativa
UPDATE public.usuarios 
SET 
  empresa_id = '00000000-0000-0000-0000-000000000001',
  auth_user_id = '85fe1bc7-6f7b-4602-ade5-f5c48f1f9c73',
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  ativo = true,
  primeiro_acesso_concluido = true
WHERE email = 'andreey.siilva@icloud.com';

-- 3. Remover todas as políticas RLS conflitantes da tabela usuarios
DROP POLICY IF EXISTS "usuarios_view_own_profile" ON public.usuarios;
DROP POLICY IF EXISTS "super_admins_manage_all" ON public.usuarios;
DROP POLICY IF EXISTS "company_users_manage_same_company" ON public.usuarios;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.usuarios;
DROP POLICY IF EXISTS "Global admins can view all users" ON public.usuarios;
DROP POLICY IF EXISTS "Company users can manage same company users" ON public.usuarios;

-- 4. Criar função segura para verificar se é super admin
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_data RECORD;
BEGIN
  SELECT role, nivel_acesso, empresa_id INTO user_data
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN (user_data.role = 'super_admin' AND 
          user_data.nivel_acesso = 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. Criar função segura para verificar se é admin global
CREATE OR REPLACE FUNCTION public.check_is_global_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_data RECORD;
BEGIN
  SELECT role, empresa_id INTO user_data
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN (user_data.role IN ('admin', 'super_admin') AND 
          user_data.empresa_id IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. Criar função segura para obter empresa do usuário
CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
RETURNS UUID AS $$
DECLARE
  user_empresa_id UUID;
BEGIN
  SELECT empresa_id INTO user_empresa_id
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN user_empresa_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. Recriar políticas RLS simplificadas para usuarios
CREATE POLICY "users_can_view_own_profile"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "super_admins_full_access"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR 
    public.check_is_super_admin()
  );

CREATE POLICY "company_users_manage_company"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR
    (empresa_id IS NOT NULL AND empresa_id = public.get_user_empresa_id()) OR
    public.check_is_super_admin()
  );

-- 8. Atualizar funções existentes para usar as novas funções
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.check_is_super_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_global_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.check_is_global_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_empresa_id()
RETURNS UUID AS $$
BEGIN
  RETURN public.get_user_empresa_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. Verificar se o registro do usuário está correto
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = 'andreey.siilva@icloud.com' 
    AND auth_user_id = '85fe1bc7-6f7b-4602-ade5-f5c48f1f9c73'
  ) THEN
    INSERT INTO public.usuarios (
      nome, 
      email, 
      role, 
      nivel_acesso, 
      empresa_id, 
      ativo,
      primeiro_acesso_concluido,
      auth_user_id
    ) VALUES (
      'Administrador Principal', 
      'andreey.siilva@icloud.com', 
      'super_admin', 
      'super_admin', 
      '00000000-0000-0000-0000-000000000001', 
      true,
      true,
      '85fe1bc7-6f7b-4602-ade5-f5c48f1f9c73'
    ) ON CONFLICT (email) DO UPDATE SET
      auth_user_id = '85fe1bc7-6f7b-4602-ade5-f5c48f1f9c73',
      empresa_id = '00000000-0000-0000-0000-000000000001',
      role = 'super_admin',
      nivel_acesso = 'super_admin',
      ativo = true,
      primeiro_acesso_concluido = true;
  END IF;
END $$;
