
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { isBrazilianHoliday, getBrazilianHolidayName } from "@/utils/holidaysAndDates";
import { isDateInPast } from "@/utils/dateValidation";
import { toast } from "sonner";

interface Agendamento {
  id: string;
  cliente: string;
  servico: string;
  horario: string;
  data_agendamento: string;
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
}

interface MonthViewProps {
  agendamentos: Agendamento[];
  filteredServices: string[];
  onAgendamentoClick: (agendamento: Agendamento) => void;
  onDayClick?: (data: string) => void;
  horariosFuncionamento?: {
    [key: number]: {
      funcionando: boolean;
      abertura: string;
      fechamento: string;
    };
  };
}

export function MonthView({ 
  agendamentos, 
  filteredServices, 
  onAgendamentoClick, 
  onDayClick,
  horariosFuncionamento 
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isGoingToToday, setIsGoingToToday] = useState(false);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const goToToday = () => {
    setIsGoingToToday(true);
    setCurrentMonth(new Date());
    toast.success('Navegado para o mês atual');
    
    // Reset animation state after a brief moment
    setTimeout(() => setIsGoingToToday(false), 300);
  };

  // Filtrar agendamentos por serviços selecionados
  const filteredAgendamentos = agendamentos.filter(agendamento => 
    filteredServices.length === 0 || filteredServices.includes(agendamento.servico)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-500';
      case 'pendente': return 'bg-yellow-500';
      case 'concluido': return 'bg-blue-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgendamentosForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return filteredAgendamentos.filter(ag => ag.data_agendamento === dayStr);
  };

  const isDiaFuncionando = (day: Date) => {
    if (!horariosFuncionamento) return true;
    const dayOfWeek = day.getDay();
    return horariosFuncionamento[dayOfWeek]?.funcionando || false;
  };

  const handleDayClick = (day: Date) => {
    if (isDateInPast(day)) {
      toast.error('Não é possível agendar para datas passadas. Selecione uma data futura.');
      return;
    }

    if (!isDiaFuncionando(day)) {
      toast.error('Este dia não está disponível para agendamentos.');
      return;
    }

    if (onDayClick) {
      const year = day.getFullYear();
      const month = day.getMonth();
      const date = day.getDate();
      
      const localDate = new Date(year, month, date);
      const dayStr = format(localDate, 'yyyy-MM-dd');
      
      console.log('Dia selecionado para visualizar agendamentos:', day);
      console.log('Data formatada para busca:', dayStr);
      
      onDayClick(dayStr);
    }
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-4">
      {/* Botão Voltar para Hoje */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className={`flex items-center gap-2 transition-all duration-300 ${
            isGoingToToday ? 'bg-primary text-primary-foreground scale-105' : 'hover:bg-primary/10'
          }`}
        >
          <CalendarDays className={`h-4 w-4 ${isGoingToToday ? 'animate-pulse' : ''}`} />
          Voltar para Hoje
        </Button>
      </div>

      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          💡 Apenas datas futuras podem ser selecionadas
        </div>
      </div>

      {/* Calendário */}
      <Card>
        <CardContent className="p-0">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 border-b">
            {diasSemana.map((dia) => (
              <div key={dia} className="p-2 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
                {dia}
              </div>
            ))}
          </div>

          {/* Grid do calendário */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const agendamentosDay = getAgendamentosForDay(day);
              const diaFuncionando = isDiaFuncionando(day);
              const isHoliday = isBrazilianHoliday(day);
              const holidayName = getBrazilianHolidayName(day);
              const isPast = isDateInPast(day);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] p-2 border-r border-b last:border-r-0 relative ${
                    !isSameMonth(day, currentMonth) 
                      ? 'bg-gray-50 text-gray-400' 
                      : isToday(day) 
                        ? 'bg-blue-50' 
                        : isHoliday 
                          ? 'bg-gray-25' 
                          : 'bg-white'
                  } ${!diaFuncionando ? 'bg-red-50' : ''} ${
                    isPast 
                      ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                      : 'cursor-pointer hover:bg-gray-50'
                  }`}
                  onClick={() => !isPast && handleDayClick(day)}
                  title={
                    isPast 
                      ? 'Data passada - não disponível para agendamento'
                      : !diaFuncionando 
                        ? 'Dia não funcionando'
                        : holidayName 
                          ? `${holidayName} - Clique para ver agendamentos` 
                          : 'Clique para ver agendamentos'
                  }
                >
                  {/* Indicador de feriado */}
                  {isHoliday && (
                    <div className="absolute top-1 right-1 text-xs text-gray-400">
                      🇧🇷
                    </div>
                  )}
                  
                  {/* Indicador de data passada */}
                  {isPast && (
                    <div className="absolute top-1 left-1 text-xs text-red-400">
                      🚫
                    </div>
                  )}
                  
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day) ? 'text-blue-600 font-bold' : ''
                  } ${!diaFuncionando ? 'text-red-400' : ''} ${isHoliday ? 'text-gray-600' : ''} ${
                    isPast ? 'text-gray-400' : ''
                  }`}>
                    {format(day, "d")}
                    {!diaFuncionando && (
                      <span className="text-xs text-red-400 block">Fechado</span>
                    )}
                    {isHoliday && (
                      <span className="text-xs text-gray-500 block truncate" title={holidayName || ''}>
                        {holidayName}
                      </span>
                    )}
                    {isPast && (
                      <span className="text-xs text-red-400 block">Passado</span>
                    )}
                  </div>
                  
                  {/* Agendamentos do dia */}
                  <div className="space-y-1">
                    {agendamentosDay.slice(0, 2).map((agendamento) => (
                      <div
                        key={agendamento.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAgendamentoClick(agendamento);
                        }}
                        className="text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-shadow bg-gray-100 hover:bg-gray-200"
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agendamento.status)}`}></div>
                          <span className="truncate">{agendamento.horario}</span>
                        </div>
                        <div className="truncate text-gray-600">{agendamento.cliente}</div>
                      </div>
                    ))}
                    
                    {agendamentosDay.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{agendamentosDay.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
