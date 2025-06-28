
-- Criar função para renovar plano da empresa
CREATE OR REPLACE FUNCTION public.renovar_plano_empresa(p_empresa_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_data_vencimento_atual DATE;
  v_nova_data_vencimento DATE;
  v_data_base DATE;
BEGIN
  -- Buscar a data de vencimento atual da empresa
  SELECT data_vencimento INTO v_data_vencimento_atual
  FROM public.empresas
  WHERE id = p_empresa_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Empresa não encontrada';
  END IF;
  
  -- Determinar a data base para o cálculo
  -- Se a data de vencimento atual é futura, usa ela como base
  -- Senão, usa a data atual
  IF v_data_vencimento_atual > CURRENT_DATE THEN
    v_data_base := v_data_vencimento_atual;
  ELSE
    v_data_base := CURRENT_DATE;
  END IF;
  
  -- Calcular nova data de vencimento (1 mês à frente)
  v_nova_data_vencimento := v_data_base + INTERVAL '1 month';
  
  -- Se o dia original não existe no próximo mês, ajustar para o último dia do mês
  IF EXTRACT(DAY FROM v_data_base) > EXTRACT(DAY FROM (DATE_TRUNC('month', v_nova_data_vencimento) + INTERVAL '1 month' - INTERVAL '1 day')) THEN
    v_nova_data_vencimento := DATE_TRUNC('month', v_nova_data_vencimento) + INTERVAL '1 month' - INTERVAL '1 day';
  END IF;
  
  -- Atualizar a empresa
  UPDATE public.empresas
  SET 
    data_vencimento = v_nova_data_vencimento,
    status = 'Ativo',
    updated_at = NOW()
  WHERE id = p_empresa_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao renovar plano: %', SQLERRM;
END;
$$;

-- Comentar a função
COMMENT ON FUNCTION public.renovar_plano_empresa(UUID) IS 'Renova o plano de uma empresa, estendendo a data de vencimento em 1 mês';
