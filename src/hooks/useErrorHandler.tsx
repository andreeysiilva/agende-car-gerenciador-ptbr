
/**
 * Hook para gerenciamento centralizado de erros
 * Fornece feedback visual e logs detalhados
 */

import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorInfo {
  message: string;
  code?: string;
  context?: any;
  timestamp: Date;
}

/**
 * Hook para gerenciar erros de forma consistente
 * @returns Objeto com funções e estado para gerenciamento de erros
 */
export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Registra e exibe um erro para o usuário
   * @param error Erro a ser tratado
   * @param context Contexto adicional do erro
   * @param showToast Se deve exibir toast para o usuário
   */
  const handleError = useCallback((
    error: Error | string,
    context?: any,
    showToast: boolean = true
  ) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorInfo: ErrorInfo = {
      message: errorMessage,
      context,
      timestamp: new Date()
    };

    // Log detalhado do erro
    console.error('Erro capturado:', {
      message: errorMessage,
      context,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: errorInfo.timestamp
    });

    // Adicionar ao histórico de erros
    setErrors(prev => [...prev.slice(-9), errorInfo]); // Manter apenas últimos 10 erros

    // Exibir toast se solicitado
    if (showToast) {
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, []);

  /**
   * Wrapper para executar funções async com tratamento de erro
   * @param fn Função assíncrona a ser executada
   * @param context Contexto para logs
   * @returns Promise com resultado ou erro tratado
   */
  const executeWithErrorHandling = useCallback(async <T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    
    try {
      const result = await fn();
      return result;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Limpa o histórico de erros
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Verifica se há erros recentes (últimos 5 minutos)
   */
  const hasRecentErrors = useCallback(() => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return errors.some(error => error.timestamp > fiveMinutesAgo);
  }, [errors]);

  return {
    errors,
    isLoading,
    handleError,
    executeWithErrorHandling,
    clearErrors,
    hasRecentErrors
  };
}

/**
 * Mensagens de erro padronizadas em português
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  VALIDATION_ERROR: 'Dados inválidos fornecidos.',
  DATE_ERROR: 'Erro ao processar data.',
  APPOINTMENT_ERROR: 'Erro ao processar agendamento.',
  GENERIC_ERROR: 'Erro inesperado. Tente novamente.',
  PAST_DATE_ERROR: 'Não é possível agendar para datas anteriores ao dia de hoje.',
  INVALID_TIME_ERROR: 'Horário inválido selecionado.',
  DUPLICATE_APPOINTMENT_ERROR: 'Já existe um agendamento para este horário.'
} as const;
