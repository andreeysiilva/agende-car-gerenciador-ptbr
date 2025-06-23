
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TimeSlotPicker } from "../TimeSlotPicker";
import { isPastDate } from "@/utils/holidaysAndDates";

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
    selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (isPastDate(date)) {
      setDateError("Não é possível agendar para datas anteriores ao dia de hoje.");
      return;
    }

    setDateError("");
    setInternalSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    onDateChange(dateStr);
    setDatePickerOpen(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Data e Horário</h3>
      
      {/* Data */}
      <div>
        <Label>Data do Agendamento *</Label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !internalSelectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalSelectedDate ? format(internalSelectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={internalSelectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => isPastDate(date)}
              locale={ptBR}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {dateError && (
          <div className="text-sm text-red-500 mt-1">{dateError}</div>
        )}
      </div>

      {/* Horário */}
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
