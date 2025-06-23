
import { format, isAfter, isBefore, startOfDay } from "date-fns";

// Feriados nacionais brasileiros (datas fixas)
export const BRAZILIAN_HOLIDAYS = [
  { date: "01-01", name: "Confraternização Universal" },
  { date: "04-21", name: "Tiradentes" },
  { date: "05-01", name: "Dia do Trabalhador" },
  { date: "09-07", name: "Independência do Brasil" },
  { date: "10-12", name: "Nossa Senhora Aparecida" },
  { date: "11-02", name: "Finados" },
  { date: "11-15", name: "Proclamação da República" },
  { date: "12-25", name: "Natal" },
];

export const isBrazilianHoliday = (date: Date): boolean => {
  const monthDay = format(date, "MM-dd");
  return BRAZILIAN_HOLIDAYS.some(holiday => holiday.date === monthDay);
};

export const getBrazilianHolidayName = (date: Date): string | null => {
  const monthDay = format(date, "MM-dd");
  const holiday = BRAZILIAN_HOLIDAYS.find(holiday => holiday.date === monthDay);
  return holiday ? holiday.name : null;
};

export const isPastDate = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const selectedDate = startOfDay(date);
  return isBefore(selectedDate, today);
};

export const isValidFutureDate = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const selectedDate = startOfDay(date);
  return !isBefore(selectedDate, today);
};

// Gerar horários disponíveis baseado nos horários de funcionamento
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] => {
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
};

// Filtrar horários disponíveis (remover horários já agendados)
export const getAvailableTimeSlots = (
  allSlots: string[],
  bookedSlots: string[]
): string[] => {
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};
