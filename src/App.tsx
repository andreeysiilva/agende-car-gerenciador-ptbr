
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

// Páginas públicas
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Páginas administrativas (rotas /admin/*)
import Dashboard from '@/pages/Dashboard';
import Empresas from '@/pages/Empresas';
import Planos from '@/pages/Planos';
import AdminFinanceiro from '@/pages/AdminFinanceiro';
import AdminAdministradores from '@/pages/AdminAdministradores';
import AdminConfiguracoes from '@/pages/AdminConfiguracoes';

// Páginas da empresa (rotas /app/*)
import ClienteDashboard from '@/pages/ClienteDashboard';
import ClienteAgenda from '@/pages/ClienteAgenda';
import ClienteClientes from '@/pages/ClienteClientes';
import ClienteServicos from '@/pages/ClienteServicos';
import ClienteFinanceiro from '@/pages/ClienteFinanceiro';
import ClienteEstatisticas from '@/pages/ClienteEstatisticas';
import ClienteConta from '@/pages/ClienteConta';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rotas administrativas com sidebar */}
          <Route path="/admin/*" element={
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 p-6 bg-gray-50">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="empresas" element={<Empresas />} />
                    <Route path="planos" element={<Planos />} />
                    <Route path="financeiro" element={<AdminFinanceiro />} />
                    <Route path="administradores" element={<AdminAdministradores />} />
                    <Route path="configuracoes" element={<AdminConfiguracoes />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          } />

          {/* Rotas da empresa com sidebar */}
          <Route path="/app/*" element={
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 p-6 bg-gray-50">
                  <Routes>
                    <Route path="dashboard" element={<ClienteDashboard />} />
                    <Route path="agenda" element={<ClienteAgenda />} />
                    <Route path="clientes" element={<ClienteClientes />} />
                    <Route path="servicos" element={<ClienteServicos />} />
                    <Route path="financeiro" element={<ClienteFinanceiro />} />
                    <Route path="estatisticas" element={<ClienteEstatisticas />} />
                    <Route path="conta" element={<ClienteConta />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          } />

          {/* Redirect padrão */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
