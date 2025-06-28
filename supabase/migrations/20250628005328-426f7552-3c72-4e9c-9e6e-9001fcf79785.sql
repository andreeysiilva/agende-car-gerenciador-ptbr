
-- Adicionar colunas para níveis de acesso e último acesso
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS nivel_acesso TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP WITH TIME ZONE;

-- Atualizar constraint para incluir novos níveis
ALTER TABLE public.usuarios 
DROP CONSTRAINT IF EXISTS usuarios_role_check;

ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_role_check 
CHECK (role IN ('admin', 'funcionario', 'super_admin', 'moderador', 'suporte'));

-- Atualizar constraint para níveis de acesso
ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_nivel_acesso_check 
CHECK (nivel_acesso IN ('super_admin', 'admin', 'moderador', 'suporte'));

-- Atualizar usuários existentes para ter nível de acesso baseado no role
UPDATE public.usuarios 
SET nivel_acesso = CASE 
  WHEN role = 'super_admin' THEN 'super_admin'
  WHEN role = 'admin' THEN 'admin'
  ELSE 'admin'
END
WHERE nivel_acesso IS NULL OR nivel_acesso = 'admin';

-- Criar função para verificar se é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role = 'super_admin'
    AND nivel_acesso = 'super_admin'
    AND empresa_id IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Política RLS para administradores - apenas super admins podem gerenciar
DROP POLICY IF EXISTS "Super admins can manage administrators" ON public.usuarios;
CREATE POLICY "Super admins can manage administrators"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    public.is_super_admin() OR 
    auth_user_id = auth.uid()
  );

-- Função para atualizar último acesso
CREATE OR REPLACE FUNCTION public.update_last_access()
RETURNS void AS $$
BEGIN
  UPDATE public.usuarios 
  SET ultimo_acesso = NOW() 
  WHERE auth_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validação e criação do Super Admin (apenas se não existir)
DO $$
BEGIN
  -- Verificar se já existe um super admin com o email especificado
  IF NOT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = 'andreey.siilva@icloud.com' 
    AND nivel_acesso = 'super_admin'
  ) THEN
    -- Atualizar usuário existente para super admin se já existir
    UPDATE public.usuarios 
    SET 
      role = 'super_admin',
      nivel_acesso = 'super_admin',
      nome = 'Administrador Principal'
    WHERE email = 'andreey.siilva@icloud.com';
    
    -- Se não foi atualizado nenhum registro, inserir novo
    IF NOT FOUND THEN
      INSERT INTO public.usuarios (
        nome, 
        email, 
        role, 
        nivel_acesso, 
        empresa_id, 
        ativo, 
        auth_user_id
      ) VALUES (
        'Administrador Principal', 
        'andreey.siilva@icloud.com', 
        'super_admin', 
        'super_admin', 
        NULL, 
        true,
        NULL -- Será preenchido quando o usuário fizer login
      )
      ON CONFLICT (email) DO UPDATE SET
        role = 'super_admin',
        nivel_acesso = 'super_admin';
    END IF;
  END IF;
END
$$;
