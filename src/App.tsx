
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

// Páginas de Autenticação
import Auth from "@/pages/Auth";
import Unauthorized from "@/pages/Unauthorized";

// Páginas do Admin
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Planos from "@/pages/Planos";
import AdminFinanceiro from "@/pages/AdminFinanceiro";

// Páginas da Empresa
import ClienteDashboard from "@/pages/ClienteDashboard";
import ClienteAgenda from "@/pages/ClienteAgenda";
import ClienteServicos from "@/pages/ClienteServicos";
import ClienteEstatisticas from "@/pages/ClienteEstatisticas";
import ClienteClientes from "@/pages/ClienteClientes";
import ClienteConta from "@/pages/ClienteConta";
import ClienteFinanceiro from "@/pages/ClienteFinanceiro";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Layout com Sidebar
const LayoutWithSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  </SidebarProvider>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Página inicial pública */}
            <Route path="/" element={<Index />} />
            
            {/* Autenticação */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rotas do Admin (requer admin global) */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireGlobalAdmin>
                <LayoutWithSidebar>
                  <Dashboard />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/admin/empresas" element={
              <ProtectedRoute requireGlobalAdmin>
                <LayoutWithSidebar>
                  <Empresas />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/admin/planos" element={
              <ProtectedRoute requireGlobalAdmin>
                <LayoutWithSidebar>
                  <Planos />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/admin/financeiro" element={
              <ProtectedRoute requireGlobalAdmin>
                <LayoutWithSidebar>
                  <AdminFinanceiro />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            
            {/* Rotas da Empresa (requer acesso à empresa) */}
            <Route path="/app/dashboard" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteDashboard />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/app/agenda" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteAgenda />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/app/clientes" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteClientes />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/app/servicos" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteServicos />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/app/estatisticas" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteEstatisticas />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/app/configuracoes" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteConta />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            <Route path="/app/financeiro" element={
              <ProtectedRoute requireCompanyAccess>
                <LayoutWithSidebar>
                  <ClienteFinanceiro />
                </LayoutWithSidebar>
              </ProtectedRoute>
            } />
            
            {/* Redirects para compatibilidade */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/empresas" element={<Navigate to="/admin/empresas" replace />} />
            <Route path="/planos" element={<Navigate to="/admin/planos" replace />} />
            <Route path="/financeiro" element={<Navigate to="/admin/financeiro" replace />} />
            <Route path="/cliente" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/cliente/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/cliente/agenda" element={<Navigate to="/app/agenda" replace />} />
            <Route path="/cliente/servicos" element={<Navigate to="/app/servicos" replace />} />
            <Route path="/cliente/estatisticas" element={<Navigate to="/app/estatisticas" replace />} />
            <Route path="/cliente/clientes" element={<Navigate to="/app/clientes" replace />} />
            <Route path="/cliente/conta" element={<Navigate to="/app/configuracoes" replace />} />
            <Route path="/cliente/financeiro" element={<Navigate to="/app/financeiro" replace />} />
            
            {/* Rotas antigas removidas */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/cliente/login" element={<Navigate to="/auth" replace />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
