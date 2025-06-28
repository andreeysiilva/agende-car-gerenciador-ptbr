
-- Adicionar coluna CNPJ/CPF à tabela empresas
ALTER TABLE public.empresas 
ADD COLUMN IF NOT EXISTS cnpj_cpf TEXT;

-- Tornar CNPJ/CPF único para evitar duplicidade
ALTER TABLE public.empresas 
ADD CONSTRAINT empresas_cnpj_cpf_unique UNIQUE (cnpj_cpf);

-- Adicionar coluna para controle de primeiro acesso
ALTER TABLE public.empresas 
ADD COLUMN IF NOT EXISTS primeiro_acesso_concluido BOOLEAN DEFAULT FALSE;

-- Verificar se telegram_chat_id já existe, se não, adicionar
ALTER TABLE public.empresas 
ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Adicionar coluna para controle de primeiro acesso na tabela usuarios também
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS primeiro_acesso_concluido BOOLEAN DEFAULT FALSE;

-- Função para criar usuário da empresa no Supabase Auth e tabela usuarios
CREATE OR REPLACE FUNCTION public.criar_usuario_empresa(
  p_email TEXT,
  p_senha_temporaria TEXT,
  p_nome_empresa TEXT,
  p_empresa_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_auth_user_id UUID;
BEGIN
  -- Criar entrada na tabela usuarios (será sincronizada com auth via trigger)
  INSERT INTO public.usuarios (
    nome,
    email,
    empresa_id,
    role,
    nivel_acesso,
    ativo,
    primeiro_acesso_concluido
  ) VALUES (
    p_nome_empresa,
    p_email,
    p_empresa_id,
    'admin',
    'admin',
    true,
    false
  ) RETURNING id INTO v_auth_user_id;
  
  RETURN v_auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar trigger para lidar com senhas temporárias
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se já existe um usuário com este email na tabela usuarios
  UPDATE public.usuarios 
  SET 
    auth_user_id = NEW.id,
    primeiro_acesso_concluido = CASE 
      WHEN empresa_id IS NOT NULL THEN false 
      ELSE primeiro_acesso_concluido 
    END
  WHERE email = NEW.email AND auth_user_id IS NULL;
  
  -- Se não encontrou, criar um novo registro básico
  IF NOT FOUND THEN
    INSERT INTO public.usuarios(
      auth_user_id, 
      email, 
      nome, 
      role, 
      ativo,
      primeiro_acesso_concluido
    )
    VALUES(
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
      'funcionario', 
      true,
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Função para verificar se usuário precisa trocar senha temporária
CREATE OR REPLACE FUNCTION public.precisa_trocar_senha()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE auth_user_id = auth.uid() 
    AND primeiro_acesso_concluido = false
    AND empresa_id IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para marcar primeiro acesso como concluído
CREATE OR REPLACE FUNCTION public.marcar_primeiro_acesso_concluido()
RETURNS void AS $$
BEGIN
  UPDATE public.usuarios 
  SET primeiro_acesso_concluido = true
  WHERE auth_user_id = auth.uid();
  
  UPDATE public.empresas 
  SET primeiro_acesso_concluido = true
  WHERE email = (
    SELECT email FROM usuarios WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
