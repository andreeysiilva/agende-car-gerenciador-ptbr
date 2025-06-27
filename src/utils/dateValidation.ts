
import { startOfDay, isBefore } from "date-fns";

/**
 * Verifica se uma data está no passado
 * @param date Data a ser verificada
 * @returns true se a data é anterior ao dia atual
 */
export const isDateInPast = (date: Date): boolean => {
  try {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    
    return isBefore(checkDate, today);
  } catch (error) {
    console.error('Erro ao verificar se data está no passado:', error);
    return false;
  }
};

/**
 * Valida se uma data é válida para agendamento
 * @param date Data a ser validada
 * @returns Objeto com resultado da validação e mensagem de erro
 */
export const validateAppointmentDate = (date: Date): {
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

    if (isDateInPast(date)) {
      return {
        isValid: false,
        error: 'Não é possível agendar para datas passadas'
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Erro ao validar data de agendamento:', error);
    return {
      isValid: false,
      error: 'Erro interno ao validar data'
    };
  }
};

/**
 * Filtra apenas datas futuras de uma lista
 * @param dates Array de datas
 * @returns Array com apenas datas futuras
 */
export const filterFutureDates = (dates: Date[]): Date[] => {
  return dates.filter(date => !isDateInPast(date));
};
