
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { dateToUTCString, stringToLocalDate, isDateInPast } from "./dateTimeUtils";

/**
 * Feriados nacionais brasileiros (datas fixas)
 * Armazenados no formato MM-dd para comparação rápida
 */
export const BRAZILIAN_HOLIDAYS = [
  { date: "01-01", name: "Confraternização Universal" },
  { date: "04-21", name: "Tiradentes" },
  { date: "05-01", name: "Dia do Trabalhador" },
  { date: "09-07", name: "Independência do Brasil" },
  { date: "10-12", name: "Nossa Senhora Aparecida" },
  { date: "11-02", name: "Finados" },
  { date: "11-15", name: "Proclamação da República" },
  { date: "12-25", name: "Natal" },
] as const;

/**
 * Verifica se uma data é feriado nacional brasileiro
 * @param date Data a ser verificada
 * @returns true se for feriado
 */
export const isBrazilianHoliday = (date: Date): boolean => {
  try {
    const monthDay = format(date, "MM-dd");
    return BRAZILIAN_HOLIDAYS.some(holiday => holiday.date === monthDay);
  } catch (error) {
    console.error('Erro ao verificar feriado:', error, { date });
    return false;
  }
};

/**
 * Obtém o nome do feriado brasileiro se a data for um feriado
 * @param date Data a ser verificada
 * @returns Nome do feriado ou null se não for feriado
 */
export const getBrazilianHolidayName = (date: Date): string | null => {
  try {
    const monthDay = format(date, "MM-dd");
    const holiday = BRAZILIAN_HOLIDAYS.find(holiday => holiday.date === monthDay);
    return holiday ? holiday.name : null;
  } catch (error) {
    console.error('Erro ao obter nome do feriado:', error, { date });
    return null;
  }
};

/**
 * @deprecated Use isDateInPast from dateTimeUtils instead
 */
export const isPastDate = (date: Date): boolean => {
  console.warn('isPastDate está deprecated. Use isDateInPast de dateTimeUtils');
  return isDateInPast(date);
};

/**
 * Verifica se uma data é válida para agendamentos futuros
 * @param date Data a ser verificada
 * @returns true se for uma data válida para o futuro
 */
export const isValidFutureDate = (date: Date): boolean => {
  try {
    const today = startOfDay(new Date());
    const selectedDate = startOfDay(date);
    return !isBefore(selectedDate, today);
  } catch (error) {
    console.error('Erro ao verificar data futura válida:', error, { date });
    return false;
  }
};

/**
 * Gera horários disponíveis baseado nos horários de funcionamento
 * @param startTime Horário de início (formato HH:mm)
 * @param endTime Horário de fim (formato HH:mm)
 * @param intervalMinutes Intervalo entre horários em minutos
 * @returns Array de horários no formato HH:mm
 */
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] => {
  try {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeSlot);
      
      currentMinute += intervalMinutes;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return slots;
  } catch (error) {
    console.error('Erro ao gerar horários:', error, { startTime, endTime, intervalMinutes });
    return [];
  }
};

/**
 * Filtra horários disponíveis removendo os já ocupados
 * @param allSlots Todos os horários possíveis
 * @param bookedSlots Horários já ocupados
 * @returns Horários disponíveis
 */
export const getAvailableTimeSlots = (
  allSlots: string[],
  bookedSlots: string[]
): string[] => {
  try {
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  } catch (error) {
    console.error('Erro ao filtrar horários disponíveis:', error, { allSlots, bookedSlots });
    return allSlots; // Retorna todos os slots em caso de erro
  }
};
