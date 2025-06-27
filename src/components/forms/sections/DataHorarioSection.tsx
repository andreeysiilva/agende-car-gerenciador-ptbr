
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeSlotPicker } from "../TimeSlotPicker";
import { formatDateBR, dateToUTCString, stringToLocalDate } from "@/utils/dateTimeUtils";
import { validateAppointmentDate, isDateInPast } from "@/utils/dateValidation";

interface DataHorarioSectionProps {
  selectedDate: string;
  selectedTime: string;
  agendamentos: any[];
  horariosFuncionamento?: {
    [key: number]: {
      funcionando: boolean;
      abertura: string;
      fechamento: string;
    };
  };
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateError: string;
  setDateError: (error: string) => void;
}

export function DataHorarioSection({
  selectedDate,
  selectedTime,
  agendamentos,
  horariosFuncionamento,
  onDateChange,
  onTimeChange,
  dateError,
  setDateError
}: DataHorarioSectionProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(
    selectedDate ? stringToLocalDate(selectedDate) : undefined
  );

  // Verificar se há conflitos de horário
  const hasTimeConflict = selectedDate && selectedTime && agendamentos.some(ag => 
    ag.data_agendamento === selectedDate && 
    ag.horario === selectedTime &&
    ag.status !== 'cancelado'
  );

  const handleDateSelect = (date: Date | undefined) => {
    try {
      if (!date) return;

      // Validar a data selecionada (inclui verificação de data passada)
      const validation = validateAppointmentDate(date);
      if (!validation.isValid) {
        setDateError(validation.error || 'Data inválida');
        return;
      }

      // Limpar erro anterior
      setDateError("");
      
      // Atualizar estado interno
      setInternalSelectedDate(date);
      
      // Converter para string UTC para armazenamento
      const dateStr = dateToUTCString(date);
      if (dateStr) {
        onDateChange(dateStr);
        setDatePickerOpen(false);
        
        console.log('Data selecionada:', {
          original: date,
          formatted: formatDateBR(date),
          utcString: dateStr
        });
      } else {
        setDateError('Erro ao processar data selecionada');
        console.error('Erro ao converter data para UTC', { date });
      }
    } catch (error) {
      const errorMessage = 'Erro ao selecionar data';
      setDateError(errorMessage);
      console.error(error, { date });
    }
  };

  return (
    <div className="space-y-4">
      {/* Seleção de Data */}
      <div>
        <Label className="flex items-center gap-2">
          Data do Agendamento *
          {selectedDate && !dateError && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </Label>
        <div className="text-xs text-gray-500 mb-2">
          💡 Apenas datas futuras podem ser selecionadas
        </div>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !internalSelectedDate && "text-muted-foreground",
                dateError && "border-red-500",
                selectedDate && !dateError && "border-green-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalSelectedDate ? formatDateBR(internalSelectedDate) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={internalSelectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => isDateInPast(date)}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Exibição de erro */}
        {dateError && (
          <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>{dateError}</span>
          </div>
        )}

        {/* Confirmação visual */}
        {selectedDate && !dateError && (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Data selecionada: {internalSelectedDate && formatDateBR(internalSelectedDate)}</span>
          </div>
        )}
      </div>

      {/* Seleção de Horário */}
      <div>
        <Label className="flex items-center gap-2">
          Horário do Agendamento *
          {selectedTime && !hasTimeConflict && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </Label>
        
        {/* Alerta de conflito de horário */}
        {hasTimeConflict && (
          <div className="flex items-center gap-2 text-sm text-red-500 mt-1 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span>Já existe um agendamento neste horário</span>
          </div>
        )}

        <TimeSlotPicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeChange={onTimeChange}
          agendamentos={agendamentos}
          horariosFuncionamento={horariosFuncionamento}
        />

        {/* Confirmação visual do horário */}
        {selectedTime && !hasTimeConflict && (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Horário disponível: {selectedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}
