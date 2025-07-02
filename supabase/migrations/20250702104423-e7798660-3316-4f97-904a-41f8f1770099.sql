-- 2. Agora remover as funções GlobalAdmin
DROP FUNCTION IF EXISTS public.check_is_global_admin();
DROP FUNCTION IF EXISTS public.is_global_admin();
DROP FUNCTION IF EXISTS public.is_current_user_global_admin();

-- 3. Atualizar função SuperAdmin para não depender de empresa_id = null
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

-- 4. Garantir que o usuário atual seja SuperAdmin
UPDATE public.usuarios 
SET 
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  ativo = true
WHERE email = 'andreey.siilva@icloud.com';