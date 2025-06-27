
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Tipos para tratamento de erros
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

// Mensagens de erro aprimoradas com melhor categorização
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
    PAST_DATE_ERROR: 'Não é possível agendar para datas passadas.',
    EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado.',
    SUBDOMAIN_ALREADY_EXISTS: 'Este subdomínio já está em uso.'
  },
  GENERIC: {
    UNKNOWN_ERROR: 'Erro inesperado. Tente novamente.',
    OPERATION_FAILED: 'Operação falhou. Tente novamente.',
    DATA_LOAD_ERROR: 'Erro ao carregar dados.',
    SAVE_ERROR: 'Erro ao salvar. Tente novamente.',
    DELETE_ERROR: 'Erro ao excluir. Tente novamente.'
  }
} as const;

export function useErrorHandler() {
  // Estado para armazenar erros por campo
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estado para controlar loading durante operações
  const [isLoading, setIsLoading] = useState(false);

  // Função para limpar erro específico de um campo
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Função para limpar todos os erros
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Função para definir erro em um campo específico
  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  // Função principal para tratamento de erros com categorização aprimorada
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

    // Mensagem padrão caso não seja possível categorizar o erro
    let errorMessage = customMessage || ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR;

    // Análise aprimorada de erros baseada no status HTTP
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
      // Análise de erros baseada na mensagem de erro
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorMessage = ERROR_MESSAGES.NETWORK.CONNECTION_FAILED;
      } else if (error.message.includes('timeout')) {
        errorMessage = ERROR_MESSAGES.NETWORK.TIMEOUT;
      } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        errorMessage = ERROR_MESSAGES.BUSINESS.EMAIL_ALREADY_EXISTS;
      } else {
        errorMessage = error.message;
      }
    }

    // Log do erro no console se habilitado
    if (logToConsole) {
      console.error('Erro tratado:', {
        originalError: error,
        processedMessage: errorMessage,
        context,
        config
      });
    }

    // Exibir toast de erro se habilitado
    if (showToast) {
      toast.error(errorMessage);
    }

    // Retornar informações do erro processado
    return {
      message: errorMessage,
      originalError: error
    };
  }, []);

  // Função para executar operações assíncronas com tratamento de erro automático
  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    config: ErrorHandlerConfig = {}
  ): Promise<T | null> => {
    try {
      // Ativar loading e limpar erros anteriores
      setIsLoading(true);
      clearAllErrors();
      
      // Executar a operação
      const result = await operation();
      return result;
    } catch (error) {
      // Tratar erro automaticamente
      handleError(error, undefined, config);
      return null;
    } finally {
      // Desativar loading sempre
      setIsLoading(false);
    }
  }, [handleError, clearAllErrors]);

  // Retornar todas as funções e estados disponíveis
  return {
    errors,                    // Objeto com erros por campo
    isLoading,                 // Estado de loading
    clearError,                // Limpar erro específico
    clearAllErrors,            // Limpar todos os erros
    setFieldError,             // Definir erro em campo
    handleError,               // Tratar erro manualmente
    handleAsyncOperation,      // Executar operação com tratamento automático
    ERROR_MESSAGES             // Constantes de mensagens de erro
  };
}