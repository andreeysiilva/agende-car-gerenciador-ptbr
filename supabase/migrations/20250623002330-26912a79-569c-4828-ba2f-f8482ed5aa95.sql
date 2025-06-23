
-- Criar tabela de equipes/agendas por empresa
CREATE TABLE public.equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de clientes por empresa
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20) NOT NULL,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar equipe_id na tabela de agendamentos
ALTER TABLE public.agendamentos ADD COLUMN equipe_id UUID REFERENCES public.equipes(id);

-- Adicionar cliente_id na tabela de agendamentos (para referência)
ALTER TABLE public.agendamentos ADD COLUMN cliente_id UUID REFERENCES public.clientes(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para equipes (isolamento por empresa)
CREATE POLICY "Empresas podem ver suas próprias equipes" 
  ON public.equipes 
  FOR SELECT 
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

CREATE POLICY "Empresas podem inserir suas próprias equipes" 
  ON public.equipes 
  FOR INSERT 
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

CREATE POLICY "Empresas podem atualizar suas próprias equipes" 
  ON public.equipes 
  FOR UPDATE 
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

CREATE POLICY "Empresas podem deletar suas próprias equipes" 
  ON public.equipes 
  FOR DELETE 
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

-- Políticas RLS para clientes (isolamento por empresa)
CREATE POLICY "Empresas podem ver seus próprios clientes" 
  ON public.clientes 
  FOR SELECT 
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

CREATE POLICY "Empresas podem inserir seus próprios clientes" 
  ON public.clientes 
  FOR INSERT 
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

CREATE POLICY "Empresas podem atualizar seus próprios clientes" 
  ON public.clientes 
  FOR UPDATE 
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

CREATE POLICY "Empresas podem deletar seus próprios clientes" 
  ON public.clientes 
  FOR DELETE 
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE auth_user_id = auth.uid()));

-- Trigger para atualizar updated_at nas novas tabelas
CREATE TRIGGER update_equipes_updated_at 
  BEFORE UPDATE ON public.equipes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at 
  BEFORE UPDATE ON public.clientes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo
INSERT INTO public.equipes (empresa_id, nome) 
SELECT id, 'Equipe Principal' FROM public.empresas WHERE nome = 'Empresa Demo';

INSERT INTO public.clientes (empresa_id, nome, telefone, email) VALUES
((SELECT id FROM public.empresas WHERE nome = 'Empresa Demo'), 'João Silva', '(11) 99999-9999', 'joao@email.com'),
((SELECT id FROM public.empresas WHERE nome = 'Empresa Demo'), 'Maria Santos', '(11) 88888-8888', 'maria@email.com'),
((SELECT id FROM public.empresas WHERE nome = 'Empresa Demo'), 'Pedro Costa', '(11) 77777-7777', 'pedro@email.com');
