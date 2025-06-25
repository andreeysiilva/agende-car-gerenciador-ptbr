
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, User, Car } from "lucide-react";
import { useState } from "react";

interface WeekViewProps {
  agendamentos: any[];
  filteredServices: string[];
  onAgendamentoClick: (agendamento: any) => void;
  onDayClick?: (date: string) => void;
  horariosFuncionamento?: any;
}

export function WeekView({ 
  agendamentos, 
  filteredServices, 
  onAgendamentoClick, 
  onDayClick,
  horariosFuncionamento = {}
}: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Função para obter o início da semana (segunda-feira)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Função para formatar data como string
  const formatDateString = (date: Date) => {
    // Use local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const localDate = new Date(year, month, day);
    return localDate.toISOString().split('T')[0];
  };

  // Gerar os dias da semana
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Função para navegar entre semanas
  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Função para verificar se um dia está funcionando
  const isDiaFuncionando = (date: Date) => {
    const dayOfWeek = date.getDay();
    return horariosFuncionamento[dayOfWeek]?.funcionando || false;
  };

  // Função para obter agendamentos de um dia específico
  const getAgendamentosDoDia = (date: Date) => {
    const dateString = formatDateString(date);
    return agendamentos.filter(ag => ag.data_agendamento === dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'concluido': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  /**
   * Função atualizada para lidar com clique do dia
   * Agora apenas exibe agendamentos do dia, não abre formulário
   */
  const handleDayClick = (date: Date) => {
    if (onDayClick) {
      const dateString = formatDateString(date);
      console.log('Visualização semanal - dia selecionado:', date);
      console.log('Data formatada para busca:', dateString);
      onDayClick(dateString);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Visualização Semanal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              {startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - {' '}
              {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((date, index) => {
            const agendamentosDoDia = getAgendamentosDoDia(date);
            const funcionando = isDiaFuncionando(date);
            const today = isToday(date);

            return (
              <div
                key={index}
                className={`border rounded-lg p-4 min-h-[200px] cursor-pointer transition-colors ${
                  !funcionando 
                    ? 'bg-gray-50 border-gray-200' 
                    : today 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleDayClick(date)}
                title="Clique para ver todos os agendamentos do dia"
              >
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-gray-600">
                    {diasSemana[index]}
                  </div>
                  <div className={`text-lg font-bold ${
                    today ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  {!funcionando && (
                    <div className="text-xs text-red-500 mt-1">
                      Fechado
                    </div>
                  )}
                </div>

                {funcionando && (
                  <div className="space-y-2">
                    {agendamentosDoDia.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-4">
                        Nenhum agendamento
                      </div>
                    ) : (
                      agendamentosDoDia
                        .sort((a, b) => a.horario.localeCompare(b.horario))
                        .map((agendamento) => (
                          <div
                            key={agendamento.id}
                            className={`p-2 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(agendamento.status)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgendamentoClick(agendamento);
                            }}
                          >
                            <div className="text-xs font-medium mb-1">
                              {agendamento.horario}
                            </div>
                            <div className="text-sm font-medium mb-1 truncate">
                              {agendamento.cliente || agendamento.nome_cliente}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {agendamento.servico}
                            </div>
                            {agendamento.equipe_nome && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {agendamento.equipe_nome}
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumo da semana */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {agendamentos.filter(ag => {
                  const agDate = new Date(ag.data_agendamento);
                  return agDate >= weekDays[0] && agDate <= weekDays[6];
                }).length}
              </div>
              <div className="text-sm text-gray-600">Agendamentos da Semana</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {agendamentos.filter(ag => {
                  const agDate = new Date(ag.data_agendamento);
                  return agDate >= weekDays[0] && agDate <= weekDays[6] && ag.status === 'confirmado';
                }).length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {agendamentos.filter(ag => {
                  const agDate = new Date(ag.data_agendamento);
                  return agDate >= weekDays[0] && agDate <= weekDays[6] && ag.status === 'pendente';
                }).length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
