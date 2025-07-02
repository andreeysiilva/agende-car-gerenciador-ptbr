
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Building2, BarChart3, Settings, Calendar, Users } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">AgendiCar</h1>
          </div>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Sistema completo de gestão para oficinas automotivas e agendamento de serviços
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Panel */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Painel Administrativo</CardTitle>
              <CardDescription>
                Gerencie empresas, planos e configurações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Empresas</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Planos</span>
                </div>
              </div>
              <Link to="/admin/dashboard" className="block">
                <Button className="w-full bg-primary hover:bg-primary-hover">
                  Acessar Painel Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Company Panel */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Painel da Empresa</CardTitle>
              <CardDescription>
                Gerencie agenda, clientes e serviços da sua oficina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Agenda</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Clientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Serviços</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Relatórios</span>
                </div>
              </div>
              <Link to="/app/dashboard" className="block">
                <Button className="w-full bg-secondary hover:bg-secondary-hover">
                  Acessar Painel Empresa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-8">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Agenda Inteligente</h3>
              <p className="text-sm text-text-secondary">
                Gerencie agendamentos com visualização mensal e semanal
              </p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Gestão de Clientes</h3>
              <p className="text-sm text-text-secondary">
                Cadastro completo de clientes e histórico de serviços
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Relatórios Detalhados</h3>
              <p className="text-sm text-text-secondary">
                Acompanhe performance e estatísticas do negócio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
