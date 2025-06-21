
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Empresas from "./pages/Empresas";
import Planos from "./pages/Planos";
import AdminFinanceiro from "./pages/AdminFinanceiro";
import NotFound from "./pages/NotFound";
import ClienteLogin from "./pages/ClienteLogin";
import ClienteDashboard from "./pages/ClienteDashboard";
import ClienteAgenda from "./pages/ClienteAgenda";
import ClienteServicos from "./pages/ClienteServicos";
import ClienteEstatisticas from "./pages/ClienteEstatisticas";
import ClienteClientes from "./pages/ClienteClientes";
import ClienteFinanceiro from "./pages/ClienteFinanceiro";
import { SidebarTrigger } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login administrativo */}
            <Route path="/login" element={<Login />} />
            
            {/* Login para clientes (empresas) */}
            <Route path="/cliente/login" element={<ClienteLogin />} />
            
            {/* Rotas do cliente (dashboard das empresas) */}
            <Route path="/cliente/*" element={
              <Routes>
                <Route path="/" element={<ClienteDashboard />} />
                <Route path="/agenda" element={<ClienteAgenda />} />
                <Route path="/servicos" element={<ClienteServicos />} />
                <Route path="/estatisticas" element={<ClienteEstatisticas />} />
                <Route path="/clientes" element={<ClienteClientes />} />
                <Route path="/financeiro" element={<ClienteFinanceiro />} />
              </Routes>
            } />
            
            {/* Rotas do admin (dashboard administrativo) */}
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1 flex flex-col">
                      <div className="border-b bg-white px-4 py-3">
                        <SidebarTrigger />
                      </div>
                      <div className="flex-1 p-6">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/empresas" element={<Empresas />} />
                          <Route path="/planos" element={<Planos />} />
                          <Route path="/financeiro" element={<AdminFinanceiro />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
