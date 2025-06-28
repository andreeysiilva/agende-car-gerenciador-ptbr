import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  Calendar,
  Users,
  Wrench,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Building2,
  UserCog,
  Building,
} from 'lucide-react';
import { getAdminLoginUrl, getClientLoginUrl } from '@/utils/linkUtils';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isGlobalAdmin, isCompanyUser } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (isGlobalAdmin) {
        navigate('/admin/dashboard');
      } else if (isCompanyUser) {
        navigate('/app/dashboard');
      } else {
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleAdminAccess = () => {
    navigate(getAdminLoginUrl());
  };

  const handleClientAccess = () => {
    navigate(getClientLoginUrl());
  };

  const features = [
    {
      icon: Calendar,
      title: 'Gestão de Agendamentos',
      description: 'Sistema completo para agendar e gerenciar serviços automotivos',
    },
    {
      icon: Users,
      title: 'Controle de Clientes',
      description: 'Cadastro e histórico completo de todos os seus clientes',
    },
    {
      icon: Wrench,
      title: 'Catálogo de Serviços',
      description: 'Organize todos os serviços oferecidos pela sua empresa',
    },
    {
      icon: BarChart3,
      title: 'Relatórios e Estatísticas',
      description: 'Acompanhe o desempenho do seu negócio com dashboards',
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Controle de acesso por usuário e proteção de dados',
    },
    {
      icon: Clock,
      title: 'Disponibilidade 24/7',
      description: 'Sistema sempre disponível para você e seus clientes',
    },
  ];

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 49',
      period: '/mês',
      features: [
        'Até 100 agendamentos/mês',
        '2 usuários',
        'Suporte por email',
        'Relatórios básicos',
      ],
      popular: false,
    },
    {
      name: 'Profissional',
      price: 'R$ 99',
      period: '/mês',
      features: [
        'Agendamentos ilimitados',
        '5 usuários',
        'Suporte prioritário',
        'Relatórios avançados',
        'Integração WhatsApp',
      ],
      popular: true,
    },
    {
      name: 'Empresarial',
      price: 'R$ 199',
      period: '/mês',
      features: [
        'Tudo do Profissional',
        'Usuários ilimitados',
        'Suporte telefônico',
        'API personalizada',
        'Treinamento incluído',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AgendiCar</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {isGlobalAdmin ? 'Admin' : 'Empresa'}
                </Badge>
                <Button onClick={handleGetStarted}>
                  Ir para Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleAdminAccess}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Admin
                </Button>
                <Button variant="outline" onClick={handleClientAccess}>
                  <Building className="h-4 w-4 mr-2" />
                  Área do Cliente
                </Button>
                <Button onClick={() => navigate('/auth')}>
                  Entrar
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
            <Car className="h-10 w-10 text-white" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-text-primary mb-6">
            Sistema de Gestão para
            <span className="text-primary block">Oficinas e Estéticas</span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Gerencie agendamentos, clientes e serviços da sua empresa automotiva 
            de forma simples e eficiente. Tudo em um só lugar.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={handleGetStarted} className="h-12 px-8">
              {isAuthenticated ? 'Acessar Sistema' : 'Começar Agora'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8">
              <Building2 className="h-5 w-5 mr-2" />
              Ver Demonstração
            </Button>
            <Button size="lg" variant="secondary" onClick={handleClientAccess} className="h-12 px-8">
              <Building className="h-5 w-5 mr-2" />
              Área do Cliente
            </Button>
            <Button size="lg" variant="ghost" onClick={handleAdminAccess} className="h-12 px-8">
              <UserCog className="h-5 w-5 mr-2" />
              Painel Admin
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Tudo que você precisa para gerenciar seu negócio
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Funcionalidades completas para otimizar seus processos e aumentar sua produtividade
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Escolha o plano ideal para sua empresa
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Planos flexíveis que crescem junto com o seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-xl' : 'border-0 shadow-lg'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-text-secondary">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth')}
                  >
                    Começar Teste Grátis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para digitalizar sua empresa?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já transformaram sua gestão com o AgendiCar
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="h-12 px-8"
            onClick={handleGetStarted}
          >
            {isAuthenticated ? 'Acessar Minha Conta' : 'Criar Conta Gratuita'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AgendiCar</span>
          </div>
          <p className="text-gray-400 mb-4">
            Sistema de Gestão para Oficinas e Estéticas Automotivas
          </p>
          <p className="text-sm text-gray-500">
            © 2024 AgendiCar. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
