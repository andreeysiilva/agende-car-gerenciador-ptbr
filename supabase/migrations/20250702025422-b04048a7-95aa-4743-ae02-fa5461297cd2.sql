
-- Remover todas as políticas problemáticas da tabela usuarios
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.usuarios;
DROP POLICY IF EXISTS "Global admins can view all users" ON public.usuarios;
DROP POLICY IF EXISTS "Company users can manage same company users" ON public.usuarios;

-- Criar políticas RLS simples e sem referências circulares
-- Política 1: Usuários podem ver seu próprio perfil
CREATE POLICY "usuarios_view_own_profile"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Política 2: Super admins podem ver e gerenciar todos os usuários
CREATE POLICY "super_admins_manage_all"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.usuarios u 
      WHERE u.auth_user_id = auth.uid() 
      AND u.role = 'super_admin' 
      AND u.nivel_acesso = 'super_admin' 
      AND u.empresa_id IS NULL
    )
  );

-- Política 3: Usuários de empresa podem gerenciar usuários da mesma empresa
CREATE POLICY "company_users_manage_same_company"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR
    (empresa_id IS NOT NULL AND empresa_id = (
      SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()
    ))
  );

-- Verificar e corrigir dados do super admin
UPDATE public.usuarios 
SET 
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  empresa_id = NULL,
  ativo = true
WHERE email = 'andreey.siilva@icloud.com';

-- Se não existir, inserir o super admin
INSERT INTO public.usuarios (
  nome, 
  email, 
  role, 
  nivel_acesso, 
  empresa_id, 
  ativo,
  auth_user_id
) 
SELECT 
  'Administrador Principal', 
  'andreey.siilva@icloud.com', 
  'super_admin', 
  'super_admin', 
  NULL, 
  true,
  'bb4e61e3-e476-40cc-a27e-aab986deacce'
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios WHERE email = 'andreey.siilva@icloud.com'
);
