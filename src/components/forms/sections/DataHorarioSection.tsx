
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeSlotPicker } from "../TimeSlotPicker";
import { formatDateBR, dateToUTCString, stringToLocalDate } from "@/utils/dateTimeUtils";
import { validateAppointmentDate, isDateInPast } from "@/utils/dateValidation";
import { useErrorHandler } from "@/hooks/useErrorHandler";

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

/**
 * Componente para seleção de data e horário no formulário de agendamento
 * Integrado com sistema de timezone e validações de data passada
 */
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
  
  const { handleError } = useErrorHandler();

  /**
   * Manipula a seleção de data no calendário
   * Aplica validações e converte para formato correto
   * Agora inclui bloqueio de datas passadas
   */
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
        handleError('Erro ao converter data para UTC', { date }, { showToast: false });
      }
    } catch (error) {
      const errorMessage = 'Erro ao selecionar data';
      setDateError(errorMessage);
      handleError(error as Error, { date }, { showToast: false });
    }
  };

  return (
    <div className="space-y-4">
      {/* Seleção de Data */}
      <div>
        <Label>Data do Agendamento *</Label>
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
                dateError && "border-red-500"
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
      </div>

      {/* Seleção de Horário */}
      <TimeSlotPicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTimeChange={onTimeChange}
        agendamentos={agendamentos}
        horariosFuncionamento={horariosFuncionamento}
      />
    </div>
  );
}
