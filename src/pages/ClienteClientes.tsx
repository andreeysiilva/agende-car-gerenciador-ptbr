
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, Car, Calendar, MapPin, FileText } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ClienteForm } from "@/components/forms/ClienteForm";
import { NovoAgendamentoForm } from "@/components/forms/NovoAgendamentoForm";

// Dados de exemplo
const clientesExemplo = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao@email.com",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    observacoes: "Cliente VIP, prefere lavagem completa",
    ultimoAgendamento: "2024-01-15",
    totalAgendamentos: 8,
    status: "ativo",
    ativo: true
  },
  {
    id: "2",
    nome: "Maria Santos",
    telefone: "(11) 88888-8888",
    email: "maria@email.com",
    endereco: "Av. Paulista, 456 - São Paulo/SP",
    observacoes: "",
    ultimoAgendamento: "2024-01-10",
    totalAgendamentos: 12,
    status: "ativo",
    ativo: true
  },
  {
    id: "3",
    nome: "Pedro Costa",
    telefone: "(11) 77777-7777",
    email: "pedro@email.com",
    endereco: "Rua Augusta, 789 - São Paulo/SP",
    observacoes: "Sempre agenda aos sábados",
    ultimoAgendamento: "2023-12-20",
    totalAgendamentos: 3,
    status: "inativo",
    ativo: false
  }
];

export default function ClienteClientes() {
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState(clientesExemplo);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);
  const [mostrarFormAgendamento, setMostrarFormAgendamento] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<any>(null);
  const [clienteParaAgendamento, setClienteParaAgendamento] = useState<any>(null);

  // Filtrar clientes pela busca
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.includes(busca) ||
    cliente.email.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleVerDetalhes = (cliente: any) => {
    setClienteSelecionado(cliente);
    setMostrarDetalhes(true);
  };

  const handleEditarCliente = (cliente: any) => {
    setClienteParaEditar(cliente);
    setMostrarFormCliente(true);
    setMostrarDetalhes(false);
  };

  const handleNovoAgendamento = (cliente: any) => {
    setClienteParaAgendamento(cliente);
    setMostrarFormAgendamento(true);
    setMostrarDetalhes(false);
  };

  const handleSalvarCliente = (clienteData: any) => {
    if (clienteParaEditar) {
      // Editar cliente existente
      setClientes(prev => 
        prev.map(c => c.id === clienteData.id ? clienteData : c)
      );
    } else {
      // Adicionar novo cliente
      setClientes(prev => [...prev, clienteData]);
    }
    setMostrarFormCliente(false);
    setClienteParaEditar(null);
  };

  const handleSalvarAgendamento = (agendamento: any) => {
    // Aqui seria salvo o agendamento no banco
    console.log("Novo agendamento:", agendamento);
    setMostrarFormAgendamento(false);
    setClienteParaAgendamento(null);
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
          
          <Button onClick={() => setMostrarFormCliente(true)}>
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
              <div className="text-2xl font-bold text-primary">{clientes.length}</div>
              <div className="text-sm text-gray-600">Total de Clientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {clientes.filter(c => c.status === 'ativo').length}
              </div>
              <div className="text-sm text-gray-600">Clientes Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {clientes.reduce((acc, c) => acc + c.totalAgendamentos, 0)}
              </div>
              <div className="text-sm text-gray-600">Total de Agendamentos</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
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
                
                {cliente.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{cliente.email}</span>
                  </div>
                )}
                
                {cliente.endereco && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{cliente.endereco}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Último: {formatarData(cliente.ultimoAgendamento)}</span>
                </div>
                
                {cliente.observacoes && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="truncate text-gray-600">{cliente.observacoes}</span>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">
                      {cliente.totalAgendamentos} agendamentos
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVerDetalhes(cliente)}
                    className="w-full"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de detalhes do cliente */}
        {mostrarDetalhes && clienteSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalhes do Cliente</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMostrarDetalhes(false)}
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
                {clienteSelecionado.email && (
                  <div>
                    <strong>Email:</strong> {clienteSelecionado.email}
                  </div>
                )}
                {clienteSelecionado.endereco && (
                  <div>
                    <strong>Endereço:</strong> {clienteSelecionado.endereco}
                  </div>
                )}
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
                
                {clienteSelecionado.observacoes && (
                  <div>
                    <strong>Observações:</strong>
                    <p className="text-sm text-gray-600 mt-1">{clienteSelecionado.observacoes}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditarCliente(clienteSelecionado)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleNovoAgendamento(clienteSelecionado)}
                  >
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
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {busca ? 'Tente ajustar os termos de busca.' : 'Comece adicionando seu primeiro cliente.'}
              </p>
              <Button onClick={() => setMostrarFormCliente(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Cliente */}
        {mostrarFormCliente && (
          <ClienteForm
            cliente={clienteParaEditar}
            isEditing={!!clienteParaEditar}
            onClose={() => {
              setMostrarFormCliente(false);
              setClienteParaEditar(null);
            }}
            onSave={handleSalvarCliente}
          />
        )}

        {/* Formulário de Agendamento */}
        {mostrarFormAgendamento && clienteParaAgendamento && (
          <NovoAgendamentoForm
            clientePreSelecionado={clienteParaAgendamento}
            onClose={() => {
              setMostrarFormAgendamento(false);
              setClienteParaAgendamento(null);
            }}
            onSave={handleSalvarAgendamento}
          />
        )}
      </div>
    </ClientLayout>
  );
}
