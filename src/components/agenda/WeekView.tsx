
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  cliente: string;
  servico: string;
  horario: string;
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
}

interface WeekViewProps {
  agendamentos: Agendamento[];
  filteredServices: string[];
  onAgendamentoClick: (agendamento: Agendamento) => void;
}

export function WeekView({ agendamentos, filteredServices, onAgendamentoClick }: WeekViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { locale: ptBR });
  const weekEnd = endOfWeek(currentWeek, { locale: ptBR });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  // Filtrar agendamentos por serviços selecionados
  const filteredAgendamentos = agendamentos.filter(agendamento => 
    filteredServices.length === 0 || filteredServices.includes(agendamento.servico)
  );

  // Agrupar agendamentos por dia
  const agendamentosPorDia = filteredAgendamentos.reduce((acc, agendamento) => {
    const data = agendamento.id; // Temporário - usar data real depois
    if (!acc[data]) acc[data] = [];
    acc[data].push(agendamento);
    return acc;
  }, {} as Record<string, Agendamento[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'concluido': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho da semana */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold">
            {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Grid da semana */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <Card key={day.toISOString()} className={`${isToday(day) ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-center">
                <div className={`${isToday(day) ? 'text-primary font-bold' : 'text-gray-600'}`}>
                  {format(day, "EEE", { locale: ptBR }).toUpperCase()}
                </div>
                <div className={`text-lg ${isToday(day) ? 'text-primary font-bold' : ''}`}>
                  {format(day, "dd")}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Agendamentos para este dia */}
              {filteredAgendamentos.slice(0, 3).map((agendamento) => (
                <div
                  key={agendamento.id}
                  onClick={() => onAgendamentoClick(agendamento)}
                  className={`p-2 rounded-md text-xs cursor-pointer hover:shadow-sm transition-shadow border ${getStatusColor(agendamento.status)}`}
                >
                  <div className="font-medium">{agendamento.horario}</div>
                  <div className="truncate">{agendamento.cliente}</div>
                  <div className="truncate text-xs opacity-75">{agendamento.servico}</div>
                </div>
              ))}
              
              {/* Mostrar mais agendamentos se houver */}
              {filteredAgendamentos.length > 3 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{filteredAgendamentos.length - 3} mais
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
