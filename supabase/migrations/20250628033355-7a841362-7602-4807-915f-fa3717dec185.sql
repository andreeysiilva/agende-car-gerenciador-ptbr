
-- Adicionar coluna data_ativacao na tabela empresas
ALTER TABLE public.empresas 
ADD COLUMN data_ativacao DATE;

-- Comentar a coluna para documentação
COMMENT ON COLUMN public.empresas.data_ativacao IS 'Data em que a empresa foi ativada após confirmação de pagamento';
