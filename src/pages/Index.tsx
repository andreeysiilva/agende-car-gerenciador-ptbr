
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Building, UserCog, Calendar, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgendiCar</h1>
                <p className="text-sm text-gray-500">Sistema de Agendamento Automotivo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Gerencie sua oficina com eficiência
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Sistema completo para agendamento de serviços automotivos, 
            controle de clientes e gestão financeira.
          </p>
          
          {/* Access Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Company Access */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Acesso Empresarial</CardTitle>
                <CardDescription className="text-gray-600">
                  Entre com suas credenciais empresariais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  asChild 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium mb-4"
                >
                  <Link to="/app/login">
                    Entrar como Empresa
                  </Link>
                </Button>
                <p className="text-sm text-gray-500">
                  Recebeu credenciais por e-mail? Use-as aqui.
                </p>
              </CardContent>
            </Card>

            {/* Admin Access */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserCog className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
                <CardDescription className="text-gray-600">
                  Acesso restrito aos administradores do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full h-12 border-red-600 text-red-600 hover:bg-red-50 font-medium mb-4"
                >
                  <Link to="/admin/login">
                    Entrar como Administrador
                  </Link>
                </Button>
                <p className="text-sm text-gray-500">
                  Área restrita para administradores
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h3>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para gerenciar sua oficina
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Agenda Inteligente</h4>
              <p className="text-gray-600">
                Controle completo dos agendamentos com visualização em calendário
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Clientes</h4>
              <p className="text-gray-600">
                Cadastro completo de clientes e histórico de serviços
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Relatórios Financeiros</h4>
              <p className="text-gray-600">
                Acompanhe o desempenho financeiro da sua oficina
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="h-6 w-6" />
            <span className="text-lg font-semibold">AgendiCar</span>
          </div>
          <p className="text-gray-400">
            © 2024 AgendiCar. Sistema de Agendamento Automotivo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
