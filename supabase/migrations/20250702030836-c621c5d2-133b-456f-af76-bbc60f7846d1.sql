
-- Criar o usuário super admin na tabela usuarios
-- O auth_user_id será preenchido depois de criar o usuário no Supabase Auth
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
  NULL, 
  true,
  true,
  NULL  -- Será atualizado após criar o usuário no Auth
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  empresa_id = NULL,
  ativo = true,
  primeiro_acesso_concluido = true;
