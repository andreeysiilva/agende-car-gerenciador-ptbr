
-- Primeiro, vamos verificar se o usuário existe na tabela usuarios e corrigir a vinculação
-- Atualizar o auth_user_id para o usuário correto baseado no email
UPDATE public.usuarios 
SET auth_user_id = '85fe1bc7-6f7b-4602-ade5-f5c48f1f9c73'
WHERE email = 'andreey.siilva@icloud.com' AND auth_user_id IS NULL;

-- Se não existir, criar o registro
INSERT INTO public.usuarios (
  nome, 
  email, 
  role, 
  nivel_acesso, 
  empresa_id, 
  ativo,
  primeiro_acesso_concluido,
  auth_user_id
) 
SELECT 
  'Administrador Principal', 
  'andreey.siilva@icloud.com', 
  'super_admin', 
  'super_admin', 
  NULL, 
  true,
  true,
  '85fe1bc7-6f7b-4602-ade5-f5c48f1f9c73'
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios WHERE email = 'andreey.siilva@icloud.com'
);
