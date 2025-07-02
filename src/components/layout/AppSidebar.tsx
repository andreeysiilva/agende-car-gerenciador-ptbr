
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Car,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Calendar,
  Users,
  Wrench,
  UserCheck,
  Shield,
} from 'lucide-react';

// Menu items para administração
const adminMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Empresas',
    url: '/admin/empresas',
    icon: Building2,
  },
  {
    title: 'Planos',
    url: '/admin/planos',
    icon: CreditCard,
  },
  {
    title: 'Financeiro',
    url: '/admin/financeiro',
    icon: CreditCard,
  },
  {
    title: 'Administradores',
    url: '/admin/administradores',
    icon: Shield,
  },
  {
    title: 'Configurações',
    url: '/admin/configuracoes',
    icon: Settings,
  },
];

// Menu items para empresa
const companyMenuItems = [
  {
    title: 'Dashboard',
    url: '/app/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Agenda',
    url: '/app/agenda',
    icon: Calendar,
  },
  {
    title: 'Clientes',
    url: '/app/clientes',
    icon: Users,
  },
  {
    title: 'Serviços',
    url: '/app/servicos',
    icon: Wrench,
  },
  {
    title: 'Equipe',
    url: '/app/equipe',
    icon: UserCheck,
  },
  {
    title: 'Financeiro',
    url: '/app/financeiro',
    icon: CreditCard,
  },
  {
    title: 'Configurações',
    url: '/app/configuracoes',
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determina se estamos na área admin ou empresa baseado na URL
  const isAdminArea = location.pathname.startsWith('/admin');
  const isCompanyArea = location.pathname.startsWith('/app');

  const getMenuItems = () => {
    if (isAdminArea) {
      return adminMenuItems;
    } else if (isCompanyArea) {
      return companyMenuItems;
    }
    return adminMenuItems; // default
  };

  const menuItems = getMenuItems();

  // Dados mockados para exibição
  const mockUser = {
    nome: isAdminArea ? 'Administrador' : 'Empresa Demo',
    email: isAdminArea ? 'admin@agendicar.com' : 'empresa@demo.com',
    role: isAdminArea ? 'Super Admin' : 'Administrador da Empresa'
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AgendiCar</h2>
            <p className="text-xs text-muted-foreground">
              {isAdminArea ? 'Painel Admin' : 'Empresa'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => navigate(item.url)}
                  className={isActive ? 'bg-primary/10 text-primary' : ''}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start h-auto p-2">
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(mockUser.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium truncate">
                {mockUser.nome}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {mockUser.email}
              </p>
            </div>
          </div>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
