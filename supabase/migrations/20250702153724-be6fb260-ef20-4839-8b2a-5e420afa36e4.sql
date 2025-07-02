
-- Verificar o estado atual do usuário no banco
SELECT * FROM public.usuarios WHERE email = 'andreey.siilva@icloud.com';

-- Verificar se existe o usuário no auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'andreey.siilva@icloud.com';

-- Corrigir ou criar o usuário super admin
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
  (SELECT id FROM auth.users WHERE email = 'andreey.siilva@icloud.com')
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  nivel_acesso = 'super_admin',
  empresa_id = NULL,
  ativo = true,
  primeiro_acesso_concluido = true,
  auth_user_id = (SELECT id FROM auth.users WHERE email = 'andreey.siilva@icloud.com');

-- Verificar se o usuário foi criado/atualizado corretamente
SELECT 
  u.id,
  u.email,
  u.nome,
  u.role,
  u.nivel_acesso,
  u.empresa_id,
  u.ativo,
  u.auth_user_id,
  au.id as auth_id
FROM public.usuarios u
LEFT JOIN auth.users au ON u.auth_user_id = au.id
WHERE u.email = 'andreey.siilva@icloud.com';

-- Testar a função de verificação de super admin
SELECT public.check_is_super_admin_robust();
