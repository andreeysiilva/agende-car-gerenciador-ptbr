
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

// Admin Pages
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Planos from "@/pages/Planos";
import AdminFinanceiro from "@/pages/AdminFinanceiro";
import Login from "@/pages/Login";

// Client Pages
import ClienteDashboard from "@/pages/ClienteDashboard";
import ClienteAgenda from "@/pages/ClienteAgenda";
import ClienteServicos from "@/pages/ClienteServicos";
import ClienteEstatisticas from "@/pages/ClienteEstatisticas";
import ClienteClientes from "@/pages/ClienteClientes";
import ClienteConta from "@/pages/ClienteConta";
import ClienteLogin from "@/pages/ClienteLogin";
import ClienteFinanceiro from "@/pages/ClienteFinanceiro";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Página inicial */}
            <Route path="/" element={<Index />} />
            
            {/* Rotas do Admin */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <Dashboard />
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/empresas" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <Empresas />
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/planos" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <Planos />
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/financeiro" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <AdminFinanceiro />
                  </main>
                </div>
              </SidebarProvider>
            } />
            
            {/* Rotas do Cliente */}
            <Route path="/cliente/login" element={<ClienteLogin />} />
            <Route path="/cliente" element={<ClienteDashboard />} />
            <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
            <Route path="/cliente/agenda" element={<ClienteAgenda />} />
            <Route path="/cliente/servicos" element={<ClienteServicos />} />
            <Route path="/cliente/estatisticas" element={<ClienteEstatisticas />} />
            <Route path="/cliente/clientes" element={<ClienteClientes />} />
            <Route path="/cliente/conta" element={<ClienteConta />} />
            <Route path="/cliente/financeiro" element={<ClienteFinanceiro />} />
            
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
