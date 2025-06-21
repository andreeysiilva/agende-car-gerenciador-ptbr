
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Car, TrendingUp, Plus, Menu, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Interface para agendamentos
interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  horario: string;
  telefone: string;
  status: 'confirmado' | 'pendente' | 'concluido';
}

// Dados mock para demonstração
const agendamentosHoje: Agendamento[] = [
  {
    id: 1,
    cliente: 'João Silva',
    servico: 'Lavagem Completa',
    horario: '09:00',
    telefone: '(11) 99999-1234',
    status: 'confirmado'
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    servico: 'Enceramento',
    horario: '11:30',
    telefone: '(11) 99999-5678',
    status: 'pendente'
  },
  {
    id: 3,
    cliente: 'Pedro Costa',
    servico: 'Lavagem + Cera',
    horario: '14:00',
    telefone: '(11) 99999-9012',
    status: 'confirmado'
  }
];

const ClienteDashboard = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  // Função para instalar PWA
  const instalarPWA = () => {
    toast({
      title: "Adicionar à Tela Inicial",
      description: "Para instalar o AgendCar na sua tela inicial, toque no menu do navegador e selecione 'Adicionar à tela inicial'",
    });
  };

  // Estatísticas do dashboard
  const estatisticas = {
    agendamentosHoje: agendamentosHoje.length,
    faturamentoMes: 'R$ 12.480,00',
    clientesAtendidos: 156,
    servicosMaisVendidos: 'Lavagem Completa'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com logo e menu mobile */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Car className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full opacity-70"></div>
              </div>
              <h1 className="text-xl font-bold text-primary">AgendCar</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={instalarPWA}
              className="hidden sm:flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Instalar App
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuAberto(!menuAberto)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Menu lateral para mobile */}
      {menuAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setMenuAberto(false)}>
          <div className="bg-white w-64 h-full shadow-lg slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-text-primary">Menu Principal</h2>
            </div>
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Calendar className="h-4 w-4" />
                Agenda
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Car className="h-4 w-4" />
                Serviços
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <TrendingUp className="h-4 w-4" />
                Estatísticas
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Users className="h-4 w-4" />
                Clientes
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="p-4 max-w-7xl mx-auto">
        {/* Saudação e botão PWA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              Bem-vindo ao Painel
            </h2>
            <p className="text-text-secondary">
              Gerencie seus agendamentos e serviços
            </p>
          </div>
          
          <Button
            onClick={instalarPWA}
            className="mt-4 sm:mt-0 pwa-install-button sm:hidden"
          >
            <Home className="h-4 w-4" />
            Instalar App
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Agendamentos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-text-primary">
                  {estatisticas.agendamentosHoje}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Faturamento Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="text-2xl font-bold text-text-primary">
                  {estatisticas.faturamentoMes}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Clientes Atendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-warning" />
                <span className="text-2xl font-bold text-text-primary">
                  {estatisticas.clientesAtendidos}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Serviço Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-error" />
                <span className="text-sm font-semibold text-text-primary">
                  {estatisticas.servicosMaisVendidos}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos do dia */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-text-primary">
                Agendamentos de Hoje
              </CardTitle>
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agendamentosHoje.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-0">
                      <h3 className="font-medium text-text-primary">
                        {agendamento.cliente}
                      </h3>
                      <Badge 
                        variant={agendamento.status === 'confirmado' ? 'default' : 
                                agendamento.status === 'pendente' ? 'secondary' : 'outline'}
                        className="w-fit"
                      >
                        {agendamento.status === 'confirmado' ? 'Confirmado' :
                         agendamento.status === 'pendente' ? 'Pendente' : 'Concluído'}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {agendamento.servico} • {agendamento.telefone}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <Clock className="h-4 w-4 text-text-secondary" />
                    <span className="font-medium text-text-primary">
                      {agendamento.horario}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Agenda</h3>
                  <p className="text-sm text-text-secondary">Visualizar calendário</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <Car className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Serviços</h3>
                  <p className="text-sm text-text-secondary">Gerenciar serviços</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Relatórios</h3>
                  <p className="text-sm text-text-secondary">Ver estatísticas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClienteDashboard;
