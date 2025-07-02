
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Car,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Calendar,
  Users,
  Wrench,
  UserCheck,
  ChevronUp,
  Shield,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Menu items para diferentes tipos de usuário
const getAdminMenuItems = (isSuperAdmin: boolean) => [
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
  ...(isSuperAdmin ? [{
    title: 'Administradores',
    url: '/admin/administradores',
    icon: Shield,
  }] : []),
  {
    title: 'Configurações',
    url: '/admin/configuracoes',
    icon: Settings,
  },
];

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
  const { profile, signOut, isCompanyUser, isSuperAdmin, selectedEmpresaId, selectEmpresa, availableEmpresas } = useAuth();
  const [showCompanySelector, setShowCompanySelector] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getMenuItems = () => {
    if (isSuperAdmin) {
      // Se super admin está visualizando empresa, mostrar menu da empresa
      if (location.pathname.startsWith('/app/')) {
        return companyMenuItems;
      }
      return getAdminMenuItems(isSuperAdmin);
    } else if (isCompanyUser) {
      return companyMenuItems;
    }
    return [];
  };

  const handleCompanySelect = (empresaId: string) => {
    selectEmpresa(empresaId);
    // Se estava na área admin, redirecionar para área da empresa
    if (location.pathname.startsWith('/admin/')) {
      navigate('/app/dashboard');
    }
  };

  const getSelectedEmpresaName = () => {
    if (!selectedEmpresaId) return 'Selecionar Empresa';
    const empresa = availableEmpresas.find(emp => emp.id === selectedEmpresaId);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string, nivelAcesso?: string) => {
    if (role === 'super_admin' || nivelAcesso === 'super_admin') return 'Super Admin';
    if (role === 'admin' || nivelAcesso === 'admin') return 'Administrador';
    if (role === 'moderador' || nivelAcesso === 'moderador') return 'Moderador';
    if (role === 'suporte' || nivelAcesso === 'suporte') return 'Suporte';
    return 'Funcionário';
  };

  const menuItems = getMenuItems();

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
              {isSuperAdmin ? 'Painel Admin' : 'Empresa'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Seletor de contexto para Super Admin */}
        {isSuperAdmin && (
          <div className="p-4 border-b">
            <div className="space-y-2">
              <div className="flex gap-1">
                <Button
                  variant={location.pathname.startsWith('/admin/') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex-1 text-xs"
                >
                  Admin
                </Button>
                <Button
                  variant={location.pathname.startsWith('/app/') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (selectedEmpresaId) {
                      navigate('/app/dashboard');
                    } else {
                      setShowCompanySelector(true);
                    }
                  }}
                  className="flex-1 text-xs"
                >
                  Empresa
                </Button>
              </div>
              
              {location.pathname.startsWith('/app/') && (
                <Select onValueChange={handleCompanySelect} value={selectedEmpresaId || ''}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Selecionar Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmpresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {profile ? getUserInitials(profile.nome) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">
                    {profile?.nome || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email}
                  </p>
                </div>
                <ChevronUp className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled>
              <div className="flex flex-col">
                <span className="font-medium">{profile?.nome}</span>
                <span className="text-xs text-muted-foreground">
                  {getRoleLabel(profile?.role || '', profile?.nivel_acesso)}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
