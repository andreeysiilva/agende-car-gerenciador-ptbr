
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
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
    if (onDayClick) {
      const dayStr = format(day, 'yyyy-MM-dd');
      onDayClick(dayStr);
    }
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-4">
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

        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
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
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                    !isSameMonth(day, currentMonth) 
                      ? 'bg-gray-50 text-gray-400' 
                      : isToday(day) 
                        ? 'bg-blue-50' 
                        : 'bg-white'
                  } ${!diaFuncionando ? 'bg-red-50' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day) ? 'text-blue-600 font-bold' : ''
                  } ${!diaFuncionando ? 'text-red-400' : ''}`}>
                    {format(day, "d")}
                    {!diaFuncionando && (
                      <span className="text-xs text-red-400 block">Fechado</span>
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
                    
                    {/* Mostrar mais agendamentos se houver */}
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
