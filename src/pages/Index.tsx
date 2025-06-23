
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Car, Users, BarChart3, CheckCircle, Star, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const planos = [
    {
      nome: "Básico",
      preco: "R$ 99,90",
      periodo: "/mês",
      descricao: "Ideal para pequenos negócios",
      caracteristicas: [
        "Até 100 agendamentos/mês",
        "1 usuário",
        "Agenda online",
        "Suporte via email",
        "Relatórios básicos"
      ],
      popular: false
    },
    {
      nome: "Premium",
      preco: "R$ 199,90",
      periodo: "/mês",
      descricao: "Perfeito para empresas em crescimento",
      caracteristicas: [
        "Até 500 agendamentos/mês",
        "3 usuários",
        "Agenda personalizada",
        "Notificações SMS",
        "Suporte prioritário",
        "Relatórios avançados"
      ],
      popular: true
    },
    {
      nome: "Empresarial",
      preco: "R$ 299,90",
      periodo: "/mês",
      descricao: "Para grandes operações",
      caracteristicas: [
        "Agendamentos ilimitados",
        "Usuários ilimitados",
        "API personalizada",
        "Suporte 24/7",
        "Multi-localização",
        "Dashboard executivo"
      ],
      popular: false
    }
  ];

  const funcionalidades = [
    {
      icon: Calendar,
      titulo: "Agenda Inteligente",
      descricao: "Gerencie todos os agendamentos em uma interface intuitiva com visualização semanal e mensal."
    },
    {
      icon: Car,
      titulo: "Gestão de Serviços",
      descricao: "Cadastre e organize todos os serviços automotivos com preços, duração e descrições."
    },
    {
      icon: Users,
      titulo: "Base de Clientes",
      descricao: "Mantenha um cadastro completo dos seus clientes com histórico de atendimentos."
    },
    {
      icon: BarChart3,
      titulo: "Relatórios e Estatísticas",
      descricao: "Acompanhe o crescimento do seu negócio com relatórios detalhados e gráficos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AgendiCar</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/cliente/login')}>
                Área do Cliente
              </Button>
              <Button onClick={() => navigate('/login')}>
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme sua
            <span className="text-blue-600"> Lava-Jato </span>
            em um Negócio Digital
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa para gestão de agendamentos, clientes e serviços automotivos. 
            Simplifique sua operação e aumente seus lucros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/cliente/login')}>
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tudo que sua Lava-Jato Precisa
          </h2>
          <p className="text-xl text-gray-600">
            Ferramentas profissionais para gerenciar seu negócio automotivo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {funcionalidades.map((funcionalidade, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <funcionalidade.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {funcionalidade.titulo}
                </h3>
                <p className="text-gray-600">
                  {funcionalidade.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal
          </h2>
          <p className="text-xl text-gray-600">
            Planos flexíveis para todos os tamanhos de negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planos.map((plano, index) => (
            <Card key={index} className={`relative hover:shadow-lg transition-shadow ${
              plano.popular ? 'border-blue-500 shadow-lg transform scale-105' : ''
            }`}>
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Mais Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plano.nome}</CardTitle>
                <div className="text-4xl font-bold text-blue-600">
                  {plano.preco}
                  <span className="text-lg text-gray-500">{plano.periodo}</span>
                </div>
                <p className="text-gray-600">{plano.descricao}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plano.caracteristicas.map((caracteristica, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plano.popular ? 'default' : 'outline'}
                  onClick={() => navigate('/cliente/login')}
                >
                  Começar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Revolucionar sua Lava-Jato?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a centenas de empresas que já transformaram seus negócios com o AgendiCar
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => navigate('/cliente/login')}>
            Iniciar Teste Gratuito
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold">AgendiCar</span>
              </div>
              <p className="text-gray-400">
                A solução completa para gestão de lava-jatos e serviços automotivos.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>API</li>
                <li>Integrações</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>Status do Sistema</li>
                <li>Treinamentos</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Termos de Uso</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgendiCar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
