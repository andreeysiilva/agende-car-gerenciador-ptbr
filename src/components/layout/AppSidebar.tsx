
import { Home, Users, CreditCard, Settings, DollarSign, Car } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// Itens do menu principal da sidebar
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Empresas",
    url: "/empresas",
    icon: Users,
  },
  {
    title: "Planos",
    url: "/planos", 
    icon: CreditCard,
  },
  {
    title: "Financeiro",
    url: "/financeiro",
    icon: DollarSign,
  },
];

// Componente da sidebar principal da aplicação
export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Car className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full opacity-70"></div>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AgendiCar</h2>
            <p className="text-xs text-gray-500">Painel Administrativo</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full"
                  >
                    <a 
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Administrador
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Sair da Conta
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
