
-- Corrigir o tamanho do campo status na tabela empresas
ALTER TABLE public.empresas 
ALTER COLUMN status TYPE VARCHAR(20);

-- Verificar e ajustar outros campos que podem ter restrições de tamanho problemáticas
-- Garantir que campos de texto tenham tamanhos adequados
ALTER TABLE public.empresas 
ALTER COLUMN nome TYPE VARCHAR(255);

ALTER TABLE public.empresas 
ALTER COLUMN email TYPE VARCHAR(255);

ALTER TABLE public.empresas 
ALTER COLUMN subdominio TYPE VARCHAR(100);

ALTER TABLE public.empresas 
ALTER COLUMN telefone TYPE VARCHAR(20);

-- Campos de senha temporária e telegram chat id também podem precisar de mais espaço
ALTER TABLE public.empresas 
ALTER COLUMN senha_temporaria TYPE VARCHAR(50);

-- Atualizar comentário para documentar os valores possíveis de status
COMMENT ON COLUMN public.empresas.status IS 'Status da empresa: Ativo, Inativo, Pendente, Suspenso, etc.';
