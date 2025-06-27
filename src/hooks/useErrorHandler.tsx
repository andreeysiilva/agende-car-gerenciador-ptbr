
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Types for error handling
interface ErrorInfo {
  message: string;
  code?: string;
  statusCode?: number;
}

interface ErrorHandlerConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

// Enhanced error messages with better categorization
const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: 'Falha na conexão. Verifique sua internet.',
    TIMEOUT: 'Tempo limite esgotado. Tente novamente.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente em alguns minutos.',
    NOT_FOUND: 'Recurso não encontrado.',
    UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
    FORBIDDEN: 'Você não tem permissão para esta ação.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo é obrigatório.',
    INVALID_EMAIL: 'Email inválido.',
    INVALID_PHONE: 'Telefone inválido.',
    INVALID_DATE: 'Data inválida.',
    PASSWORD_TOO_SHORT: 'Senha deve ter pelo menos 6 caracteres.',
    PASSWORDS_NOT_MATCH: 'Senhas não coincidem.'
  },
  BUSINESS: {
    APPOINTMENT_CONFLICT: 'Já existe um agendamento neste horário.',
    INVALID_TIME_SLOT: 'Horário não disponível.',
    CUSTOMER_NOT_FOUND: 'Cliente não encontrado.',
    SERVICE_UNAVAILABLE: 'Serviço não disponível.',
    TEAM_UNAVAILABLE: 'Equipe não disponível neste horário.',
    PAST_DATE_ERROR: 'Não é possível agendar para datas passadas.'
  },
  GENERIC: {
    UNKNOWN_ERROR: 'Erro inesperado. Tente novamente.',
    OPERATION_FAILED: 'Operação falhou. Tente novamente.',
    DATA_LOAD_ERROR: 'Erro ao carregar dados.',
    SAVE_ERROR: 'Erro ao salvar. Tente novamente.',
    DELETE_ERROR: 'Erro ao excluir. Tente novamente.'
  }
};

export function useErrorHandler() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Clear specific error
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Set field error
  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  // Handle error with enhanced categorization
  const handleError = useCallback((
    error: any,
    context?: any,
    config: ErrorHandlerConfig = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      customMessage
    } = config;

    let errorMessage = customMessage || ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR;

    // Enhanced error parsing
    if (error?.response?.status) {
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = error.response.data?.message || ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
          break;
        case 401:
          errorMessage = ERROR_MESSAGES.NETWORK.UNAUTHORIZED;
          break;
        case 403:
          errorMessage = ERROR_MESSAGES.NETWORK.FORBIDDEN;
          break;
        case 404:
          errorMessage = ERROR_MESSAGES.NETWORK.NOT_FOUND;
          break;
        case 408:
          errorMessage = ERROR_MESSAGES.NETWORK.TIMEOUT;
          break;
        case 409:
          errorMessage = ERROR_MESSAGES.BUSINESS.APPOINTMENT_CONFLICT;
          break;
        case 422:
          errorMessage = error.response.data?.message || ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
          break;
        default:
          errorMessage = ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR;
      }
    } else if (error?.message) {
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorMessage = ERROR_MESSAGES.NETWORK.CONNECTION_FAILED;
      } else if (error.message.includes('timeout')) {
        errorMessage = ERROR_MESSAGES.NETWORK.TIMEOUT;
      } else {
        errorMessage = error.message;
      }
    }

    if (logToConsole) {
      console.error('Error handled:', {
        originalError: error,
        processedMessage: errorMessage,
        context,
        config
      });
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    return {
      message: errorMessage,
      originalError: error
    };
  }, []);

  // Async operation handler
  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    config: ErrorHandlerConfig = {}
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      clearAllErrors();
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error, undefined, config);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearAllErrors]);

  return {
    errors,
    isLoading,
    clearError,
    clearAllErrors,
    setFieldError,
    handleError,
    handleAsyncOperation,
    ERROR_MESSAGES
  };
}
