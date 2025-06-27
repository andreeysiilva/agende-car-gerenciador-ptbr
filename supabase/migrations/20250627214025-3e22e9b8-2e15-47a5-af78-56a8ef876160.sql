
-- Primeiro, criar constraint unique no email se não existir
ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_email_unique UNIQUE (email);

-- Alterar a constraint para permitir 'super_admin'
ALTER TABLE public.usuarios 
DROP CONSTRAINT IF EXISTS usuarios_role_check;

ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_role_check 
CHECK (role IN ('admin', 'funcionario', 'super_admin'));

-- Inserir o usuário administrador principal (agora com constraint única)
INSERT INTO public.usuarios (
  nome,
  email,
  empresa_id,
  role,
  ativo,
  auth_user_id
) VALUES (
  'Administrador Principal',
  'andreey.siilva@icloud.com',
  NULL,
  'super_admin',
  true,
  NULL -- Será atualizado após criação no Auth
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  nome = 'Administrador Principal';

-- Criar função para lidar com novos usuários do Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se já existe um usuário com este email na tabela usuarios
  UPDATE public.usuarios 
  SET auth_user_id = NEW.id 
  WHERE email = NEW.email AND auth_user_id IS NULL;
  
  -- Se não encontrou, criar um novo registro básico
  IF NOT FOUND THEN
    INSERT INTO public.usuarios(auth_user_id, email, nome, role, ativo)
    VALUES(NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 'funcionario', true);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para novos usuários do Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Atualizar função is_global_admin para incluir super_admin
CREATE OR REPLACE FUNCTION public.is_global_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
    AND empresa_id IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Habilitar RLS nas tabelas principais se ainda não estiver habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios
DROP POLICY IF EXISTS "Global admins can manage all users" ON public.usuarios;
CREATE POLICY "Global admins can manage all users"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (public.is_global_admin());

DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
CREATE POLICY "Users can view their own profile"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Políticas RLS para empresas
DROP POLICY IF EXISTS "Global admins can manage all companies" ON public.empresas;
CREATE POLICY "Global admins can manage all companies"
  ON public.empresas
  FOR ALL
  TO authenticated
  USING (public.is_global_admin());

-- Políticas RLS para agendamentos
DROP POLICY IF EXISTS "Global admins can manage all appointments" ON public.agendamentos;
CREATE POLICY "Global admins can manage all appointments"
  ON public.agendamentos
  FOR ALL
  TO authenticated
  USING (public.is_global_admin());

DROP POLICY IF EXISTS "Company users can manage their appointments" ON public.agendamentos;
CREATE POLICY "Company users can manage their appointments"
  ON public.agendamentos
  FOR ALL
  TO authenticated
  USING (empresa_id = public.get_current_empresa_id());
