
/**
 * Utilitários para manipulação de datas e timezone
 * Centraliza todas as operações de data/hora do sistema
 */

import { format, parseISO, startOfDay, isValid, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Configuração do timezone local (Brasil)
 */
export const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Cache para operações de data frequentes
 */
const dateCache = new Map<string, any>();

/**
 * Formata uma data para exibição no padrão brasileiro
 * @param date Data a ser formatada
 * @param pattern Padrão de formatação (padrão: dd/MM/yyyy)
 * @returns Data formatada ou string vazia se inválida
 */
export const formatDateBR = (date: Date | string, pattern: string = "dd/MM/yyyy"): string => {
  try {
    const cacheKey = `format_${date}_${pattern}`;
    if (dateCache.has(cacheKey)) {
      return dateCache.get(cacheKey);
    }

    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      console.warn('Data inválida fornecida para formatação:', date);
      return '';
    }

    const formatted = format(dateObj, pattern, { locale: ptBR });
    dateCache.set(cacheKey, formatted);
    
    return formatted;
  } catch (error) {
    console.error('Erro ao formatar data:', error, { date, pattern });
    return '';
  }
};

/**
 * Converte uma data para string no formato yyyy-MM-dd (UTC)
 * Garante consistência para armazenamento no banco
 * @param date Data a ser convertida
 * @returns String da data ou null se inválida
 */
export const dateToUTCString = (date: Date): string | null => {
  try {
    if (!isValid(date)) {
      console.warn('Data inválida fornecida para conversão UTC:', date);
      return null;
    }

    // Criar data local para evitar problemas de timezone
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const localDate = new Date(year, month, day);
    return format(localDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Erro ao converter data para UTC:', error, { date });
    return null;
  }
};

/**
 * Converte string de data para objeto Date local
 * @param dateString String no formato yyyy-MM-dd
 * @returns Date object ou null se inválida
 */
export const stringToLocalDate = (dateString: string): Date | null => {
  try {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }

    const cacheKey = `parse_${dateString}`;
    if (dateCache.has(cacheKey)) {
      return dateCache.get(cacheKey);
    }

    // Parse da string assumindo timezone local
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (!isValid(date)) {
      console.warn('String de data inválida:', dateString);
      return null;
    }

    dateCache.set(cacheKey, date);
    return date;
  } catch (error) {
    console.error('Erro ao converter string para data:', error, { dateString });
    return null;
  }
};

/**
 * Verifica se uma data está no passado
 * @param date Data a ser verificada
 * @returns true se a data é anterior ao dia atual
 */
export const isDateInPast = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? stringToLocalDate(date) : date;
    if (!dateObj || !isValid(dateObj)) {
      return false;
    }

    const today = startOfDay(new Date());
    const checkDate = startOfDay(dateObj);
    
    return checkDate < today;
  } catch (error) {
    console.error('Erro ao verificar se data está no passado:', error, { date });
    return false;
  }
};

/**
 * Valida se uma data é válida para agendamento
 * @param date Data a ser validada
 * @returns Objeto com resultado da validação e mensagem de erro
 */
export const validateAppointmentDate = (date: Date | string): {
  isValid: boolean;
  error?: string;
} => {
  try {
    if (!date) {
      return {
        isValid: false,
        error: 'Data é obrigatória'
      };
    }

    const dateObj = typeof date === 'string' ? stringToLocalDate(date) : date;
    
    if (!dateObj || !isValid(dateObj)) {
      return {
        isValid: false,
        error: 'Data inválida'
      };
    }

    if (isDateInPast(dateObj)) {
      return {
        isValid: false,
        error: 'Não é possível agendar para datas anteriores ao dia de hoje'
      };
    }

    // Verificar se não é muito longe no futuro (1 ano)
    const oneYearFromNow = addDays(new Date(), 365);
    if (dateObj > oneYearFromNow) {
      return {
        isValid: false,
        error: 'Data muito distante no futuro'
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Erro ao validar data de agendamento:', error, { date });
    return {
      isValid: false,
      error: 'Erro interno ao validar data'
    };
  }
};

/**
 * Limpa o cache de datas (útil para testes ou quando necessário)
 */
export const clearDateCache = (): void => {
  dateCache.clear();
  console.log('Cache de datas limpo');
};

/**
 * Obtém estatísticas do cache (para debug)
 */
export const getDateCacheStats = (): { size: number; keys: string[] } => {
  return {
    size: dateCache.size,
    keys: Array.from(dateCache.keys())
  };
};
