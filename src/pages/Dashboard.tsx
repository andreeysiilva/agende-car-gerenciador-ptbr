
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, Building } from 'lucide-react';

// Dados mockados para demonstração
const dashboardData = {
  totalEmpresas: 24,
  totalAgendamentos: 156,
  registrosRecentes: 8,
  crescimentoMensal: 12.5
};

const empresasRecentes = [
  { id: 1, nome: 'Auto Lavagem Premium', email: 'contato@autopremium.com', plano: 'Premium', status: 'Ativo' },
  { id: 2, nome: 'Lava Car Express', email: 'admin@lavacarexpress.com', plano: 'Básico', status: 'Ativo' },
  { id: 3, nome: 'Detailing Master', email: 'contato@detailingmaster.com', plano: 'Premium', status: 'Pendente' },
  { id: 4, nome: 'Quick Wash', email: 'info@quickwash.com', plano: 'Básico', status: 'Ativo' },
];

// Página principal do dashboard com métricas e informações gerais
const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral da plataforma Agende Car
        </p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Empresas
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.totalEmpresas}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +{dashboardData.registrosRecentes} novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Agendamentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.totalAgendamentos}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +{dashboardData.crescimentoMensal}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Empresas Ativas
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.totalEmpresas - 2}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              91.7% de taxa de ativação
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Crescimento Mensal
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              +{dashboardData.crescimentoMensal}%
            </div>
            <p className="text-xs text-green-600 mt-1">
              Tendência positiva
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Empresas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Empresas Registradas Recentemente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empresasRecentes.map((empresa) => (
                <div
                  key={empresa.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{empresa.nome}</h4>
                    <p className="text-sm text-gray-600">{empresa.email}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1">
                      {empresa.plano}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        empresa.status === 'Ativo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {empresa.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Resumo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Planos Disponíveis</span>
                <span className="font-semibold text-blue-600">3</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Taxa de Conversão</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Satisfação do Cliente</span>
                <span className="font-semibold text-purple-600">4.8/5</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Uptime do Sistema</span>
                <span className="font-semibold text-orange-600">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
