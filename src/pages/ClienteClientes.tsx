
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Phone, Mail, User, Filter, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

// Interface para clientes
interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  ultimoServico: string;
  dataUltimoServico: string;
  totalGasto: number;
  frequencia: 'Novo' | 'Esporádico' | 'Regular' | 'VIP';
}

// Dados mock dos clientes
const clientesMock: Cliente[] = [
  {
    id: 1,
    nome: 'João Silva',
    telefone: '(11) 99999-1234',
    email: 'joao.silva@email.com',
    ultimoServico: 'Lavagem Completa',
    dataUltimoServico: '2024-01-15',
    totalGasto: 450.00,
    frequencia: 'Regular'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    telefone: '(11) 99999-5678',
    email: 'maria.santos@email.com',
    ultimoServico: 'Enceramento',
    dataUltimoServico: '2024-01-14',
    totalGasto: 1250.00,
    frequencia: 'VIP'
  },
  {
    id: 3,
    nome: 'Pedro Costa',
    telefone: '(11) 99999-9012',
    ultimoServico: 'Lavagem + Cera',
    dataUltimoServico: '2024-01-13',
    totalGasto: 180.00,
    frequencia: 'Esporádico'
  },
  {
    id: 4,
    nome: 'Ana Oliveira',
    telefone: '(11) 99999-3456',
    email: 'ana.oliveira@email.com',
    ultimoServico: 'Detalhamento Completo',
    dataUltimoServico: '2024-01-12',
    totalGasto: 2100.00,
    frequencia: 'VIP'
  },
  {
    id: 5,
    nome: 'Carlos Pereira',
    telefone: '(11) 99999-7890',
    ultimoServico: 'Lavagem Simples',
    dataUltimoServico: '2024-01-11',
    totalGasto: 50.00,
    frequencia: 'Novo'
  }
];

const ClienteClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroFrequencia, setFiltroFrequencia] = useState('todos');
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [sheetAberto, setSheetAberto] = useState(false);

  // Estados do formulário
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    const matchPesquisa = cliente.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                         cliente.telefone.includes(pesquisa) ||
                         (cliente.email && cliente.email.toLowerCase().includes(pesquisa.toLowerCase()));
    
    const matchFrequencia = filtroFrequencia === 'todos' || cliente.frequencia === filtroFrequencia;
    
    return matchPesquisa && matchFrequencia;
  });

  // Função para limpar formulário
  const limparFormulario = () => {
    setNomeCliente('');
    setTelefoneCliente('');
    setEmailCliente('');
    setClienteEditando(null);
  };

  // Função para abrir formulário de edição
  const editarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setNomeCliente(cliente.nome);
    setTelefoneCliente(cliente.telefone);
    setEmailCliente(cliente.email || '');
    setSheetAberto(true);
  };

  // Função para salvar cliente
  const salvarCliente = () => {
    if (!nomeCliente || !telefoneCliente) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const clienteData = {
      nome: nomeCliente,
      telefone: telefoneCliente,
      email: emailCliente || undefined
    };

    if (clienteEditando) {
      // Editar cliente existente
      setClientes(prev => prev.map(cliente =>
        cliente.id === clienteEditando.id
          ? { ...cliente, ...clienteData }
          : cliente
      ));
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
    } else {
      // Criar novo cliente
      const novoCliente: Cliente = {
        id: Date.now(),
        ...clienteData,
        ultimoServico: '-',
        dataUltimoServico: '-',
        totalGasto: 0,
        frequencia: 'Novo'
      };
      setClientes(prev => [...prev, novoCliente]);
      toast({
        title: "Sucesso",
        description: "Cliente adicionado com sucesso!",
      });
    }

    limparFormulario();
    setSheetAberto(false);
  };

  // Função para excluir cliente
  const excluirCliente = (id: number) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== id));
    toast({
      title: "Sucesso",
      description: "Cliente removido com sucesso!",
    });
  };

  // Formatação de moeda
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Formatação de data
  const formatarData = (data: string) => {
    if (data === '-') return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Estatísticas dos clientes
  const estatisticas = {
    total: clientes.length,
    novos: clientes.filter(c => c.frequencia === 'Novo').length,
    vip: clientes.filter(c => c.frequencia === 'VIP').length,
    ticketMedio: clientes.reduce((acc, c) => acc + c.totalGasto, 0) / clientes.length || 0
  };

  // Cores dos badges de frequência
  const getCorFrequencia = (frequencia: string) => {
    switch (frequencia) {
      case 'Novo':
        return 'bg-blue-100 text-blue-700';
      case 'Esporádico':
        return 'bg-gray-100 text-gray-700';
      case 'Regular':
        return 'bg-green-100 text-green-700';
      case 'VIP':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-primary">Clientes</h1>
            <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
              <SheetTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary-hover"
                  onClick={limparFormulario}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>
                    {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
                  </SheetTitle>
                  <SheetDescription>
                    {clienteEditando 
                      ? 'Atualize as informações do cliente' 
                      : 'Adicione um novo cliente à sua base'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(e.target.value)}
                      placeholder="(11) 99999-1234"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailCliente}
                      onChange={(e) => setEmailCliente(e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={salvarCliente}
                      className="flex-1 bg-primary hover:bg-primary-hover"
                    >
                      {clienteEditando ? 'Atualizar' : 'Adicionar'} Cliente
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSheetAberto(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Barra de pesquisa e filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Pesquisar por nome, telefone ou email..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroFrequencia} onValueChange={setFiltroFrequencia}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Novo">Novos</SelectItem>
                <SelectItem value="Esporádico">Esporádicos</SelectItem>
                <SelectItem value="Regular">Regulares</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="p-4 max-w-7xl mx-auto">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-primary-50 rounded-lg w-fit mx-auto mb-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-text-secondary">Total</p>
              <p className="text-xl font-bold text-text-primary">{estatisticas.total}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-50 rounded-lg w-fit mx-auto mb-2">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-text-secondary">Novos</p>
              <p className="text-xl font-bold text-text-primary">{estatisticas.novos}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-50 rounded-lg w-fit mx-auto mb-2">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-text-secondary">VIP</p>
              <p className="text-xl font-bold text-text-primary">{estatisticas.vip}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-secondary-50 rounded-lg w-fit mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-sm text-text-secondary">Ticket Médio</p>
              <p className="text-xl font-bold text-text-primary">
                {formatarMoeda(estatisticas.ticketMedio)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de clientes */}
        <div className="space-y-4">
          {clientesFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-text-secondary mb-4">
                  {pesquisa || filtroFrequencia !== 'todos' 
                    ? 'Tente ajustar os filtros de pesquisa' 
                    : 'Adicione seu primeiro cliente para começar'}
                </p>
                {!pesquisa && filtroFrequencia === 'todos' && (
                  <Button 
                    onClick={() => setSheetAberto(true)}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Cliente
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            clientesFiltrados.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {cliente.nome}
                        </h3>
                        <Badge className={getCorFrequencia(cliente.frequencia)}>
                          {cliente.frequencia}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-text-secondary" />
                          <span className="text-text-secondary">{cliente.telefone}</span>
                        </div>
                        
                        {cliente.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-text-secondary" />
                            <span className="text-text-secondary truncate">{cliente.email}</span>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-text-secondary">Último serviço:</p>
                          <p className="font-medium text-text-primary">{cliente.ultimoServico}</p>
                        </div>
                        
                        <div>
                          <p className="text-text-secondary">Total gasto:</p>
                          <p className="font-semibold text-secondary">
                            {formatarMoeda(cliente.totalGasto)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-text-secondary">
                          Último atendimento: {formatarData(cliente.dataUltimoServico)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 lg:flex-col lg:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarCliente(cliente)}
                        className="flex-1 lg:flex-none"
                      >
                        <Edit className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => excluirCliente(cliente.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 lg:flex-none"
                      >
                        <Trash2 className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ClienteClientes;
