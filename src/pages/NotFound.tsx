
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

// Página 404 - Não encontrado
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-primary hover:bg-primary-600">
            <Link to="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar à página anterior
            </button>
          </Button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
