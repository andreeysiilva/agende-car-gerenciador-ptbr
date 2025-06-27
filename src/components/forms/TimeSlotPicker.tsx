
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";
import { generateTimeSlots, getAvailableTimeSlots } from "@/utils/holidaysAndDates";
import { stringToLocalDate } from "@/utils/dateTimeUtils";

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  agendamentos: any[];
  horariosFuncionamento?: {
    [key: number]: {
      funcionando: boolean;
      abertura: string;
      fechamento: string;
    };
  };
}

/**
 * Componente para seleção de horários disponíveis
 * Integrado com validações de funcionamento e conflitos
 */
export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onTimeChange,
  agendamentos,
  horariosFuncionamento
}: TimeSlotPickerProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Atualiza os horários disponíveis quando a data muda
   */
  useEffect(() => {
    const updateAvailableSlots = async () => {
      try {
        setIsLoading(true);

        if (!selectedDate) {
          setAvailableSlots([]);
          return;
        }

        // Converter string para Date para obter dia da semana
        const dateObj = stringToLocalDate(selectedDate);
        if (!dateObj) {
          console.warn('Data inválida para seleção de horários:', selectedDate);
          setAvailableSlots([]);
          return;
        }

        const dayOfWeek = dateObj.getDay();
        const workingHours = horariosFuncionamento?.[dayOfWeek];
        
        if (!workingHours?.funcionando) {
          setAvailableSlots([]);
          return;
        }

        // Gerar todos os horários possíveis
        const allSlots = generateTimeSlots(
          workingHours.abertura || "08:00",
          workingHours.fechamento || "18:00",
          30 // intervalos de 30 minutos
        );

        // Encontrar horários já ocupados
        const bookedSlots = agendamentos
          .filter(ag => ag.data_agendamento === selectedDate)
          .map(ag => ag.horario);

        // Filtrar horários disponíveis
        const available = getAvailableTimeSlots(allSlots, bookedSlots);
        setAvailableSlots(available);

        console.log('Horários atualizados:', {
          selectedDate,
          dayOfWeek,
          workingHours,
          totalSlots: allSlots.length,
          bookedSlots: bookedSlots.length,
          availableSlots: available.length
        });

      } catch (error) {
        console.error('Erro ao atualizar horários disponíveis:', error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    updateAvailableSlots();
  }, [selectedDate, agendamentos, horariosFuncionamento]);

  // Verificar se é necessário selecionar data primeiro
  if (!selectedDate) {
    return (
      <div>
        <Label>Horário *</Label>
        <div className="text-sm text-gray-500 mt-1 p-3 bg-gray-50 rounded-md">
          Selecione uma data primeiro
        </div>
      </div>
    );
  }

  // Verificar se o estabelecimento funciona na data selecionada
  const dateObj = stringToLocalDate(selectedDate);
  const dayOfWeek = dateObj?.getDay() ?? 0;
  const workingHours = horariosFuncionamento?.[dayOfWeek];

  if (!workingHours?.funcionando) {
    return (
      <div>
        <Label>Horário *</Label>
        <div className="flex items-center gap-2 text-sm text-red-600 mt-1 p-3 bg-red-50 rounded-md">
          <AlertTriangle className="h-4 w-4" />
          Estabelecimento fechado neste dia
        </div>
      </div>
    );
  }

  return (
    <div>
      <Label className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Horário Disponível *
      </Label>
      
      <div className="mt-2">
        {isLoading ? (
          <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
            Carregando horários disponíveis...
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-yellow-600 p-3 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-4 w-4" />
            Nenhum horário disponível para este dia
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant={selectedTime === slot ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeChange(slot)}
                className="text-sm"
              >
                {slot}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Informações de funcionamento */}
      {workingHours && (
        <div className="text-xs text-gray-500 mt-2">
          Funcionamento: {workingHours.abertura} às {workingHours.fechamento}
        </div>
      )}
    </div>
  );
}
