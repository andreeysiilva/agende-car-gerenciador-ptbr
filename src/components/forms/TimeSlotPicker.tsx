
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { generateTimeSlots, getAvailableTimeSlots } from "@/utils/holidaysAndDates";

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

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onTimeChange,
  agendamentos,
  horariosFuncionamento
}: TimeSlotPickerProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    // Determinar horários de funcionamento para o dia selecionado
    const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
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
  }, [selectedDate, agendamentos, horariosFuncionamento]);

  if (!selectedDate) {
    return (
      <div>
        <Label>Horário *</Label>
        <div className="text-sm text-gray-500 mt-1">
          Selecione uma data primeiro
        </div>
      </div>
    );
  }

  const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
  const workingHours = horariosFuncionamento?.[dayOfWeek];

  if (!workingHours?.funcionando) {
    return (
      <div>
        <Label>Horário *</Label>
        <div className="text-sm text-red-500 mt-1">
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
        {availableSlots.length === 0 ? (
          <div className="text-sm text-yellow-600 p-3 bg-yellow-50 rounded-md">
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
      {workingHours && (
        <div className="text-xs text-gray-500 mt-2">
          Funcionamento: {workingHours.abertura} às {workingHours.fechamento}
        </div>
      )}
    </div>
  );
}
