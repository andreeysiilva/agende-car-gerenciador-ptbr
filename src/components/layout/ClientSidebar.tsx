
import { Home, Calendar, Wrench, BarChart3, Users, User, Menu, Car, DollarSign } from "lucide-react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Itens do menu principal da sidebar do cliente
const menuItems = [
  {
    title: "Dashboard",
    url: "/cliente/dashboard",
    icon: Home,
  },
  {
    title: "Agenda",
    url: "/cliente/agenda",
    icon: Calendar,
  },
  {
    title: "Serviços",
    url: "/cliente/servicos",
    icon: Wrench,
  },
  {
    title: "Financeiro",
    url: "/cliente/financeiro",
    icon: DollarSign,
  },
  {
    title: "Estatísticas",
    url: "/cliente/estatisticas",
    icon: BarChart3,
  },
  {
    title: "Clientes",
    url: "/cliente/clientes",
    icon: Users,
  },
  {
    title: "Conta",
    url: "/cliente/conta",
    icon: User,
  },
];

// Componente da sidebar do cliente
export function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Função para lidar com o logout
  const handleLogout = () => {
    // Implementar logout do cliente posteriormente
    navigate('/cliente/login');
  };

  return (
    <>
      {/* Botão toggle para mobile - fica sempre visível */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <SidebarTrigger className="bg-white shadow-md" />
      </div>
      
      <Sidebar className="border-r bg-white">
        <SidebarHeader className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Car className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full opacity-70"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AgendiCar</h2>
              <p className="text-xs text-gray-500">Painel do Cliente</p>
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
                {menuItems.map((item) => {
                  console.log(`Rendering item: ${item.title}`);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        isActive={location.pathname === item.url}
                        className="w-full"
                      >
                        <a 
                          href={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 ${
                            item.title === 'Financeiro' ? 'bg-yellow-50 border border-yellow-200' : ''
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">E</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Empresa Demo
                </p>
                <p className="text-xs text-gray-500 truncate">
                  empresa@demo.com
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start gap-2"
            >
              <User className="h-4 w-4" />
              Sair da Conta
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
