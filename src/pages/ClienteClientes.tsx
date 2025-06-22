
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, Car, Calendar } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";

// Dados de exemplo
const clientesExemplo = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao@email.com",
    carro: "Honda Civic 2020",
    ultimoAgendamento: "2024-01-15",
    totalAgendamentos: 8,
    status: "ativo"
  },
  {
    id: "2",
    nome: "Maria Santos",
    telefone: "(11) 88888-8888",
    email: "maria@email.com",
    carro: "Toyota Corolla 2019",
    ultimoAgendamento: "2024-01-10",
    totalAgendamentos: 12,
    status: "ativo"
  },
  {
    id: "3",
    nome: "Pedro Costa",
    telefone: "(11) 77777-7777",
    email: "pedro@email.com",
    carro: "VW Polo 2021",
    ultimoAgendamento: "2023-12-20",
    totalAgendamentos: 3,
    status: "inativo"
  }
];

export default function ClienteClientes() {
  const [busca, setBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  // Filtrar clientes pela busca
  const clientesFiltrados = clientesExemplo.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.includes(busca) ||
    cliente.email.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Gerencie sua base de clientes</p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{clientesExemplo.length}</div>
              <div className="text-sm text-gray-600">Total de Clientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {clientesExemplo.filter(c => c.status === 'ativo').length}
              </div>
              <div className="text-sm text-gray-600">Clientes Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {clientesExemplo.reduce((acc, c) => acc + c.totalAgendamentos, 0)}
              </div>
              <div className="text-sm text-gray-600">Total de Agendamentos</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                  <Badge 
                    variant={cliente.status === 'ativo' ? 'default' : 'secondary'}
                    className={cliente.status === 'ativo' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{cliente.telefone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{cliente.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span>{cliente.carro}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Último: {formatarData(cliente.ultimoAgendamento)}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {cliente.totalAgendamentos} agendamentos
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setClienteSelecionado(cliente)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de detalhes do cliente */}
        {clienteSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalhes do Cliente</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClienteSelecionado(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Nome:</strong> {clienteSelecionado.nome}
                </div>
                <div>
                  <strong>Telefone:</strong> {clienteSelecionado.telefone}
                </div>
                <div>
                  <strong>Email:</strong> {clienteSelecionado.email}
                </div>
                <div>
                  <strong>Veículo:</strong> {clienteSelecionado.carro}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge variant={clienteSelecionado.status === 'ativo' ? 'default' : 'secondary'}>
                    {clienteSelecionado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div>
                  <strong>Total de Agendamentos:</strong> {clienteSelecionado.totalAgendamentos}
                </div>
                <div>
                  <strong>Último Agendamento:</strong> {formatarData(clienteSelecionado.ultimoAgendamento)}
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1">
                    Novo Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {clientesFiltrados.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {busca ? 'Tente ajustar os termos de busca.' : 'Comece adicionando seu primeiro cliente.'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}
