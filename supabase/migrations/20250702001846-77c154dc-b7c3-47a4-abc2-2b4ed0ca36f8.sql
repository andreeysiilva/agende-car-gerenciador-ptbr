
-- Adicionar constraint foreign key com CASCADE para empresa_id se não existir
DO $$
BEGIN
    -- Verificar se a constraint já existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'usuarios_empresa_id_fkey' 
        AND table_name = 'usuarios'
    ) THEN
        ALTER TABLE public.usuarios
        ADD CONSTRAINT usuarios_empresa_id_fkey
        FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Criar enum para roles específicos da empresa
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'empresa_role') THEN
        CREATE TYPE public.empresa_role AS ENUM (
            'admin_empresa',
            'gerente', 
            'funcionario',
            'atendente',
            'visualizador'
        );
    END IF;
END $$;

-- Adicionar coluna role_empresa se não existir
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS role_empresa public.empresa_role DEFAULT 'funcionario';

-- Atualizar usuários existentes que são admins de empresa para ter role_empresa = 'admin_empresa'
UPDATE public.usuarios 
SET role_empresa = 'admin_empresa'
WHERE role = 'admin' AND empresa_id IS NOT NULL;

-- Função para verificar se usuário é admin da empresa
CREATE OR REPLACE FUNCTION public.is_empresa_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role_empresa = 'admin_empresa'
    AND empresa_id IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para verificar se usuário pode gerenciar outros usuários da mesma empresa
CREATE OR REPLACE FUNCTION public.can_manage_empresa_users()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role_empresa IN ('admin_empresa', 'gerente')
    AND empresa_id IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Política RLS para permitir que admins da empresa gerenciem usuários
DROP POLICY IF EXISTS "Admins de empresa podem gerenciar usuários da empresa" ON public.usuarios;
CREATE POLICY "Admins de empresa podem gerenciar usuários da empresa"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    public.can_manage_empresa_users() AND 
    empresa_id = (SELECT empresa_id FROM usuarios WHERE auth_user_id = auth.uid())
  );
