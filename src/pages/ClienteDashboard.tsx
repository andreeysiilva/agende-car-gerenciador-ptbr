
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, DollarSign, TrendingUp, Car } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useNavigate } from "react-router-dom";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  // Dados mockados dos agendamentos de hoje
  const agendamentosHoje = [
    { 
      id: "1",
      horario: "09:00", 
      cliente: "Maria Silva", 
      servico: "Lavagem Completa", 
      status: "confirmado",
      data_agendamento: new Date().toISOString().split('T')[0]
    },
    { 
      id: "2",
      horario: "11:30", 
      cliente: "João Santos", 
      servico: "Enceramento", 
      status: "em_andamento",
      data_agendamento: new Date().toISOString().split('T')[0]
    },
    { 
      id: "3",
      horario: "14:30", 
      cliente: "Pedro Costa", 
      servico: "Lavagem Simples", 
      status: "agendado",
      data_agendamento: new Date().toISOString().split('T')[0]
    },
  ];

  // Função para navegar para a agenda com a data atual
  const handleVerAgendamentos = () => {
    navigate('/cliente/agenda', { 
      state: { 
        selectedDate: new Date().toISOString().split('T')[0],
        showDayModal: true 
      } 
    });
  };

  // Função para navegar para a agenda ao clicar em um agendamento específico
  const handleAgendamentoClick = (agendamento: any) => {
    navigate('/cliente/agenda', { 
      state: { 
        selectedDate: agendamento.data_agendamento,
        showDayModal: true,
        selectedAppointment: agendamento
      } 
    });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao AgendiCar</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agendamentosHoje.length}</div>
              <p className="text-xs text-muted-foreground">+2 desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Agendamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14:30</div>
              <p className="text-xs text-muted-foreground">João Silva - Lavagem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">+12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 8.542</div>
              <p className="text-xs text-muted-foreground">+18% desde o mês passado</p>
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendamentos de Hoje
                </CardTitle>
                <button 
                  onClick={handleVerAgendamentos}
                  className="text-sm text-primary hover:underline"
                >
                  Ver todos
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentosHoje.map((agendamento) => (
                  <div 
                    key={agendamento.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleAgendamentoClick(agendamento)}
                  >
                    <div>
                      <div className="font-medium">{agendamento.horario} - {agendamento.cliente}</div>
                      <div className="text-sm text-gray-600">{agendamento.servico}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      agendamento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                      agendamento.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agendamento.status === 'confirmado' ? 'Confirmado' :
                       agendamento.status === 'em_andamento' ? 'Em Andamento' : 'Agendado'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de Agendamentos</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Agendamentos Concluídos</span>
                  <span className="font-bold text-green-600">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cancelamentos</span>
                  <span className="font-bold text-red-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Conclusão</span>
                  <span className="font-bold text-blue-600">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Receita da Semana</span>
                  <span className="font-bold">R$ 2.340</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
