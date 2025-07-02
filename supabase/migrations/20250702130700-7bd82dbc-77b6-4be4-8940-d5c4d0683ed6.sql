
-- 1. Corrigir dados inconsistentes dos super admins
UPDATE public.usuarios 
SET role_empresa = NULL 
WHERE role = 'super_admin' AND nivel_acesso = 'super_admin';

-- 2. Criar função robusta para verificar super admin sem depender de auth.uid()
CREATE OR REPLACE FUNCTION public.check_is_super_admin_robust()
RETURNS BOOLEAN 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_data RECORD;
  current_auth_id UUID;
BEGIN
  -- Tentar obter auth.uid() com fallback
  BEGIN
    current_auth_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    current_auth_id := NULL;
  END;
  
  -- Se auth.uid() é null, retornar false
  IF current_auth_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se é super admin
  SELECT role, nivel_acesso INTO user_data
  FROM public.usuarios 
  WHERE auth_user_id = current_auth_id
  LIMIT 1;
  
  RETURN (user_data.role = 'super_admin' AND user_data.nivel_acesso = 'super_admin');
END;
$$;

-- 3. Atualizar função check_is_super_admin para usar a versão robusta
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN public.check_is_super_admin_robust();
END;
$$;

-- 4. Recriar políticas RLS para empresas com verificação robusta
DROP POLICY IF EXISTS "super_admin_manage_all_empresas" ON public.empresas;
CREATE POLICY "super_admin_manage_all_empresas"
ON public.empresas
FOR ALL
TO authenticated
USING (
  public.check_is_super_admin_robust() OR 
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role = 'super_admin' 
    AND nivel_acesso = 'super_admin'
  )
);

-- 5. Criar política adicional para permitir criação de empresas por super admin
DROP POLICY IF EXISTS "super_admin_create_empresas" ON public.empresas;
CREATE POLICY "super_admin_create_empresas"
ON public.empresas
FOR INSERT
TO authenticated
WITH CHECK (
  public.check_is_super_admin_robust() OR
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role = 'super_admin' 
    AND nivel_acesso = 'super_admin'
  )
);

-- 6. Verificar e corrigir dados do usuário específico
UPDATE public.usuarios 
SET 
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  empresa_id = NULL,
  role_empresa = NULL,
  ativo = true,
  primeiro_acesso_concluido = true
WHERE email = 'andreey.siilva@icloud.com';

-- 7. Função para debug de permissões
CREATE OR REPLACE FUNCTION public.debug_user_permissions(p_email TEXT DEFAULT NULL)
RETURNS TABLE (
  email TEXT,
  auth_user_id UUID,
  role TEXT,
  nivel_acesso TEXT,
  empresa_id UUID,
  role_empresa TEXT,
  ativo BOOLEAN,
  is_super_admin BOOLEAN,
  auth_uid_result UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_email TEXT;
BEGIN
  target_email := COALESCE(p_email, (SELECT u.email FROM usuarios u WHERE u.auth_user_id = auth.uid()));
  
  RETURN QUERY
  SELECT 
    u.email,
    u.auth_user_id,
    u.role,
    u.nivel_acesso,
    u.empresa_id,
    u.role_empresa::TEXT,
    u.ativo,
    (u.role = 'super_admin' AND u.nivel_acesso = 'super_admin') as is_super_admin,
    auth.uid() as auth_uid_result
  FROM usuarios u
  WHERE u.email = target_email;
END;
$$;
