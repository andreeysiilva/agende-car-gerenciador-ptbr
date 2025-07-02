-- Corrigir role_empresa para super admins (não deve ser funcionario)
UPDATE public.usuarios 
SET role_empresa = NULL 
WHERE role = 'super_admin' AND nivel_acesso = 'super_admin';