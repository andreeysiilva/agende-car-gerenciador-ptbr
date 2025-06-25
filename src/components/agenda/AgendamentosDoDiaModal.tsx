import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Clock, User, Phone, Car, FileText } from "lucide-react";
import { formatDateBR, stringToLocalDate } from "@/utils/dateTimeUtils";

interface AgendamentosDoDiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSelecionada: string;
  agendamentosDoDia: any[];
  onAgendamentoClick: (agendamento: any) => void;
  onNovoAgendamento: () => void;
}

export function AgendamentosDoDiaModal({
  isOpen,
  onClose,
  dataSelecionada,
  agendamentosDoDia,
  onAgendamentoClick,
  onNovoAgendamento
}: AgendamentosDoDiaModalProps) {
  if (!isOpen) return null;

  const formatarData = (data: string) => {
    console.log('Data recebida no modal:', data);
    
    // Usar a função utilitária para converter e formatar corretamente
    const dateObj = stringToLocalDate(data);
    if (dateObj) {
      const formatted = formatDateBR(dateObj);
      console.log('Data formatada:', formatted);
      return formatted;
    }
    
    // Fallback caso a conversão falhe
    try {
      return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return data;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'pendente': return 'Pendente';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Agendamentos de {formatarData(dataSelecionada)}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {agendamentosDoDia.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum agendamento para esta data</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  onClose();
                  onNovoAgendamento();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Agendamento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentosDoDia
                .sort((a, b) => a.horario.localeCompare(b.horario))
                .map((agendamento) => (
                <Card key={agendamento.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onAgendamentoClick(agendamento)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{agendamento.horario}</span>
                      </div>
                      <Badge className={getStatusColor(agendamento.status)}>
                        {getStatusText(agendamento.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{agendamento.cliente}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{agendamento.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <span>{agendamento.carro}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{agendamento.servico}</span>
                      </div>
                    </div>
                    
                    {agendamento.equipe_nome && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Equipe:</strong> {agendamento.equipe_nome}
                      </div>
                    )}
                    
                    {agendamento.observacoes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 inline mr-1" />
                        {agendamento.observacoes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
