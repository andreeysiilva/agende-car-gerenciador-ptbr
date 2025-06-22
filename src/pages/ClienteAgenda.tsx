
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Car, Phone, FileText } from "lucide-react";
import { WeekView } from "@/components/agenda/WeekView";
import { MonthView } from "@/components/agenda/MonthView";
import { ServiceFilter } from "@/components/agenda/ServiceFilter";
import { ClientLayout } from "@/components/layout/ClientLayout";

// Dados de exemplo para demonstração
const agendamentosExemplo = [
  {
    id: "1",
    cliente: "João Silva",
    telefone: "(11) 99999-9999",
    carro: "Honda Civic 2020",
    servico: "Lavagem Completa",
    horario: "09:00",
    status: "confirmado" as const,
    observacoes: "Carro muito sujo"
  },
  {
    id: "2",
    cliente: "Maria Santos",
    telefone: "(11) 88888-8888",
    carro: "Toyota Corolla 2019",
    servico: "Enceramento",
    horario: "14:30",
    status: "pendente" as const,
    observacoes: ""
  },
  {
    id: "3",
    cliente: "Pedro Costa",
    telefone: "(11) 77777-7777",
    carro: "VW Polo 2021",
    servico: "Lavagem Simples",
    horario: "16:00",
    status: "concluido" as const,
    observacoes: "Cliente VIP"
  },
  {
    id: "4",
    cliente: "Ana Oliveira",
    telefone: "(11) 66666-6666",
    carro: "Hyundai HB20 2020",
    servico: "Lavagem e Enceramento",
    horario: "10:30",
    status: "cancelado" as const,
    observacoes: "Cancelado pelo cliente"
  }
];

const servicosDisponiveis = [
  "Lavagem Completa",
  "Lavagem Simples", 
  "Enceramento",
  "Lavagem e Enceramento",
  "Detalhamento",
  "Lavagem Seca"
];

export default function ClienteAgenda() {
  const [visualizacao, setVisualizacao] = useState<'semana' | 'mes'>('semana');
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);

  // Função para alternar seleção de serviço
  const toggleServico = (servico: string) => {
    setServicosSelecionados(prev => 
      prev.includes(servico) 
        ? prev.filter(s => s !== servico)
        : [...prev, servico]
    );
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setServicosSelecionados([]);
  };

  // Função para lidar com clique em agendamento
  const handleAgendamentoClick = (agendamento: any) => {
    setAgendamentoSelecionado(agendamento);
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
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600">Gerencie seus agendamentos</p>
          </div>
          
          {/* Controles de visualização */}
          <div className="flex items-center gap-2">
            <Button
              variant={visualizacao === 'semana' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizacao('semana')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Semana
            </Button>
            <Button
              variant={visualizacao === 'mes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizacao('mes')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Mês
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <ServiceFilter
          availableServices={servicosDisponiveis}
          selectedServices={servicosSelecionados}
          onServiceToggle={toggleServico}
          onClearFilters={limparFiltros}
        />

        {/* Visualização da agenda */}
        {visualizacao === 'semana' ? (
          <WeekView
            agendamentos={agendamentosExemplo}
            filteredServices={servicosSelecionados}
            onAgendamentoClick={handleAgendamentoClick}
          />
        ) : (
          <MonthView
            agendamentos={agendamentosExemplo}
            filteredServices={servicosSelecionados}
            onAgendamentoClick={handleAgendamentoClick}
          />
        )}

        {/* Modal/Card de detalhes do agendamento */}
        {agendamentoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalhes do Agendamento</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAgendamentoSelecionado(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{agendamentoSelecionado.cliente}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{agendamentoSelecionado.telefone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span>{agendamentoSelecionado.carro}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{agendamentoSelecionado.horario}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(agendamentoSelecionado.status)}>
                    {getStatusText(agendamentoSelecionado.status)}
                  </Badge>
                </div>
                
                <div>
                  <strong>Serviço:</strong> {agendamentoSelecionado.servico}
                </div>
                
                {agendamentoSelecionado.observacoes && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Observações:</div>
                      <div className="text-sm text-gray-600">{agendamentoSelecionado.observacoes}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
