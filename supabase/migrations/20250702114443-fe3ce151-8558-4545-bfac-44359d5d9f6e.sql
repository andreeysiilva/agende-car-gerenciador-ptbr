-- 1. Corrigir estrutura de super admins - devem ter empresa_id NULL
UPDATE public.usuarios 
SET empresa_id = NULL 
WHERE role = 'super_admin' AND nivel_acesso = 'super_admin';

-- 2. Criar tabela de sessões de empresa para super admins
CREATE TABLE public.admin_empresa_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(admin_user_id, empresa_id)
);

-- 3. Habilitar RLS na nova tabela
ALTER TABLE public.admin_empresa_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Política para admin_empresa_sessions
CREATE POLICY "super_admin_manage_sessions" 
ON public.admin_empresa_sessions 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role = 'super_admin' 
    AND nivel_acesso = 'super_admin'
  )
);

-- 5. Criar função para obter empresa selecionada do super admin
CREATE OR REPLACE FUNCTION public.get_admin_selected_empresa_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  selected_empresa_id UUID;
  is_super_admin BOOLEAN;
BEGIN
  -- Verificar se é super admin
  SELECT (role = 'super_admin' AND nivel_acesso = 'super_admin') 
  INTO is_super_admin
  FROM usuarios 
  WHERE auth_user_id = auth.uid();
  
  IF NOT is_super_admin THEN
    RETURN NULL;
  END IF;
  
  -- Buscar última empresa acessada pelo super admin
  SELECT empresa_id INTO selected_empresa_id
  FROM admin_empresa_sessions 
  WHERE admin_user_id = auth.uid()
  ORDER BY updated_at DESC
  LIMIT 1;
  
  RETURN selected_empresa_id;
END;
$$;

-- 6. Atualizar função get_user_empresa_id para considerar super admins
CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_empresa_id UUID;
  user_data RECORD;
BEGIN
  SELECT empresa_id, role, nivel_acesso INTO user_data
  FROM public.usuarios 
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  -- Se é super admin, retornar empresa selecionada
  IF user_data.role = 'super_admin' AND user_data.nivel_acesso = 'super_admin' THEN
    RETURN public.get_admin_selected_empresa_id();
  END IF;
  
  -- Se é usuário normal, retornar empresa_id
  RETURN user_data.empresa_id;
END;
$$;

-- 7. Criar função para selecionar empresa como super admin
CREATE OR REPLACE FUNCTION public.select_empresa_as_admin(p_empresa_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_super_admin BOOLEAN;
BEGIN
  -- Verificar se é super admin
  SELECT (role = 'super_admin' AND nivel_acesso = 'super_admin') 
  INTO is_super_admin
  FROM usuarios 
  WHERE auth_user_id = auth.uid();
  
  IF NOT is_super_admin THEN
    RAISE EXCEPTION 'Usuário não tem permissão para selecionar empresas';
  END IF;
  
  -- Verificar se a empresa existe
  IF NOT EXISTS (SELECT 1 FROM empresas WHERE id = p_empresa_id) THEN
    RAISE EXCEPTION 'Empresa não encontrada';
  END IF;
  
  -- Inserir ou atualizar sessão
  INSERT INTO admin_empresa_sessions (admin_user_id, empresa_id)
  VALUES (auth.uid(), p_empresa_id)
  ON CONFLICT (admin_user_id, empresa_id) 
  DO UPDATE SET updated_at = NOW();
END;
$$;