
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, DollarSign, TrendingUp, Car } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useNavigate } from "react-router-dom";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  // Função para navegar para a agenda com a data atual
  const handleVerAgendamentos = () => {
    navigate('/cliente/agenda', { 
      state: { 
        selectedDate: new Date().toISOString().split('T')[0],
        showDayModal: false 
      } 
    });
  };

  // Função para navegar para criar novo agendamento
  const handleNovoAgendamento = () => {
    navigate('/cliente/agenda', { 
      state: { 
        selectedDate: new Date().toISOString().split('T')[0],
        showNewAppointmentModal: true
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Nenhum agendamento para hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Agendamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--:--</div>
              <p className="text-xs text-muted-foreground">Nenhum agendamento pendente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Cadastre seus primeiros clientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div>
              <p className="text-xs text-muted-foreground">Comece a receber seus pagamentos</p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de agendamentos e resumo */}
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
                  Ver agenda
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Nenhum agendamento para hoje</p>
                <button 
                  onClick={handleNovoAgendamento}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Criar Agendamento
                </button>
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
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Agendamentos Concluídos</span>
                  <span className="font-bold text-green-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cancelamentos</span>
                  <span className="font-bold text-red-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Conclusão</span>
                  <span className="font-bold text-blue-600">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Receita da Semana</span>
                  <span className="font-bold">R$ 0,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
