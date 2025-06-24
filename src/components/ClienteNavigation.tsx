
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Car, Users, TrendingUp, Home, LogOut, DollarSign } from 'lucide-react';

// Componente de navegação para o dashboard do cliente
const ClienteNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Itens de navegação
  const navigationItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/cliente',
      description: 'Painel principal'
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: '/cliente/agenda',
      description: 'Gerenciar agendamentos'
    },
    {
      icon: Car,
      label: 'Serviços',
      path: '/cliente/servicos',
      description: 'Cadastrar serviços'
    },
    {
      icon: TrendingUp,
      label: 'Estatísticas',
      path: '/cliente/estatisticas',
      description: 'Relatórios e gráficos'
    },
    {
      icon: Users,
      label: 'Clientes',
      path: '/cliente/clientes',
      description: 'Base de clientes'
    },
    {
      icon: DollarSign,
      label: 'Financeiro',
      path: '/cliente/financeiro',
      description: 'Pagamentos e receitas'
    }
  ];

  // Verificar se a rota está ativa
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Função para fazer logout
  const handleLogout = () => {
    // Aqui seria implementada a integração com Supabase Auth
    navigate('/cliente/login');
  };

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(item.path);
        
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-12 ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
            }`}
            onClick={() => navigate(item.path)}
          >
            <Icon className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs opacity-70">{item.description}</div>
            </div>
          </Button>
        );
      })}
      
      {/* Separador */}
      <div className="border-t border-border my-4" />
      
      {/* Botão de logout */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        <div className="text-left">
          <div className="font-medium">Sair</div>
          <div className="text-xs opacity-70">Fazer logout</div>
        </div>
      </Button>
    </nav>
  );
};

export default ClienteNavigation;
