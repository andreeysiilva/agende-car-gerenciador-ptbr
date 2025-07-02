
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CompanyAuthProvider } from '@/contexts/CompanyAuthContext';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import { CompanyProtectedRoute } from '@/components/auth/CompanyProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

// Páginas públicas
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import ResetPassword from '@/pages/ResetPassword';

// Páginas de login específicas
import AdminLogin from '@/pages/AdminLogin';
import CompanyLogin from '@/pages/CompanyLogin';

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
import ClienteUsuarios from '@/pages/ClienteUsuarios';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rotas de login específicas */}
          <Route path="/admin/login" element={
            <AdminAuthProvider>
              <AdminLogin />
            </AdminAuthProvider>
          } />
          <Route path="/app/login" element={
            <CompanyAuthProvider>
              <CompanyLogin />
            </CompanyAuthProvider>
          } />

          {/* Rotas administrativas com sidebar */}
          <Route path="/admin/*" element={
            <AdminAuthProvider>
              <AdminProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen">
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
              </AdminProtectedRoute>
            </AdminAuthProvider>
          } />

          {/* Rotas da empresa com sidebar */}
          <Route path="/app/*" element={
            <CompanyAuthProvider>
              <CompanyProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen">
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
              </CompanyProtectedRoute>
            </CompanyAuthProvider>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
