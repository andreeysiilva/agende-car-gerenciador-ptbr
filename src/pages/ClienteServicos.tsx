
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Car, Clock, DollarSign, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

// Interface para serviços
interface Servico {
  id: number;
  nome: string;
  duracao: number; // em minutos
  preco: number;
  descricao: string;
  ativo: boolean;
}

// Dados mock dos serviços
const servicosMock: Servico[] = [
  {
    id: 1,
    nome: 'Lavagem Simples',
    duracao: 30,
    preco: 25.00,
    descricao: 'Lavagem externa básica com shampoo automotivo',
    ativo: true
  },
  {
    id: 2,
    nome: 'Lavagem Completa',
    duracao: 60,
    preco: 45.00,
    descricao: 'Lavagem externa e interna, aspiração e limpeza dos vidros',
    ativo: true
  },
  {
    id: 3,
    nome: 'Enceramento',
    duracao: 90,
    preco: 80.00,
    descricao: 'Lavagem completa + aplicação de cera protetora',
    ativo: true
  },
  {
    id: 4,
    nome: 'Detalhamento Completo',
    duracao: 180,
    preco: 150.00,
    descricao: 'Lavagem, enceramento, hidratação do couro e limpeza detalhada',
    ativo: true
  },
  {
    id: 5,
    nome: 'Lavagem de Motor',
    duracao: 45,
    preco: 35.00,
    descricao: 'Limpeza e desengordure do motor',
    ativo: false
  }
];

const ClienteServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>(servicosMock);
  const [pesquisa, setPesquisa] = useState('');
  const [servicoEditando, setServicoEditando] = useState<Servico | null>(null);
  const [sheetAberto, setSheetAberto] = useState(false);

  // Estados do formulário
  const [nomeServico, setNomeServico] = useState('');
  const [duracaoServico, setDuracaoServico] = useState('');
  const [precoServico, setPrecoServico] = useState('');
  const [descricaoServico, setDescricaoServico] = useState('');

  // Filtrar serviços pela pesquisa
  const servicosFiltrados = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    servico.descricao.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // Função para limpar formulário
  const limparFormulario = () => {
    setNomeServico('');
    setDuracaoServico('');
    setPrecoServico('');
    setDescricaoServico('');
    setServicoEditando(null);
  };

  // Função para abrir formulário de edição
  const editarServico = (servico: Servico) => {
    setServicoEditando(servico);
    setNomeServico(servico.nome);
    setDuracaoServico(servico.duracao.toString());
    setPrecoServico(servico.preco.toString());
    setDescricaoServico(servico.descricao);
    setSheetAberto(true);
  };

  // Função para salvar serviço
  const salvarServico = () => {
    if (!nomeServico || !duracaoServico || !precoServico) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const servicoData = {
      nome: nomeServico,
      duracao: parseInt(duracaoServico),
      preco: parseFloat(precoServico),
      descricao: descricaoServico,
      ativo: true
    };

    if (servicoEditando) {
      // Editar serviço existente
      setServicos(prev => prev.map(servico =>
        servico.id === servicoEditando.id
          ? { ...servico, ...servicoData }
          : servico
      ));
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso!",
      });
    } else {
      // Criar novo serviço
      const novoServico: Servico = {
        id: Date.now(),
        ...servicoData
      };
      setServicos(prev => [...prev, novoServico]);
      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso!",
      });
    }

    limparFormulario();
    setSheetAberto(false);
  };

  // Função para excluir serviço
  const excluirServico = (id: number) => {
    setServicos(prev => prev.filter(servico => servico.id !== id));
    toast({
      title: "Sucesso",
      description: "Serviço removido com sucesso!",
    });
  };

  // Função para alternar status do serviço
  const alternarStatusServico = (id: number) => {
    setServicos(prev => prev.map(servico =>
      servico.id === id
        ? { ...servico, ativo: !servico.ativo }
        : servico
    ));
  };

  // Formatação de preço
  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Formatação de duração
  const formatarDuracao = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-primary">Serviços</h1>
            <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
              <SheetTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary-hover"
                  onClick={limparFormulario}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Serviço
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>
                    {servicoEditando ? 'Editar Serviço' : 'Novo Serviço'}
                  </SheetTitle>
                  <SheetDescription>
                    {servicoEditando 
                      ? 'Atualize as informações do serviço' 
                      : 'Adicione um novo serviço ao seu catálogo'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="nome">Nome do Serviço *</Label>
                    <Input
                      id="nome"
                      value={nomeServico}
                      onChange={(e) => setNomeServico(e.target.value)}
                      placeholder="Ex: Lavagem Completa"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duracao">Duração (minutos) *</Label>
                      <Input
                        id="duracao"
                        type="number"
                        value={duracaoServico}
                        onChange={(e) => setDuracaoServico(e.target.value)}
                        placeholder="60"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="preco">Preço (R$) *</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        value={precoServico}
                        onChange={(e) => setPrecoServico(e.target.value)}
                        placeholder="45.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={descricaoServico}
                      onChange={(e) => setDescricaoServico(e.target.value)}
                      placeholder="Descreva o que está incluído no serviço..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={salvarServico}
                      className="flex-1 bg-primary hover:bg-primary-hover"
                    >
                      {servicoEditando ? 'Atualizar' : 'Criar'} Serviço
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
          
          {/* Barra de pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Pesquisar serviços..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="p-4 max-w-6xl mx-auto">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total de Serviços</p>
                  <p className="text-xl font-bold text-text-primary">{servicos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Ticket Médio</p>
                  <p className="text-xl font-bold text-text-primary">
                    {formatarPreco(servicos.reduce((acc, s) => acc + s.preco, 0) / servicos.length || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Tempo Médio</p>
                  <p className="text-xl font-bold text-text-primary">
                    {formatarDuracao(Math.round(servicos.reduce((acc, s) => acc + s.duracao, 0) / servicos.length || 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de serviços */}
        <div className="space-y-4">
          {servicosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-text-secondary mb-4">
                  {pesquisa ? 'Tente uma pesquisa diferente' : 'Adicione seu primeiro serviço para começar'}
                </p>
                {!pesquisa && (
                  <Button 
                    onClick={() => setSheetAberto(true)}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Serviço
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            servicosFiltrados.map((servico) => (
              <Card key={servico.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {servico.nome}
                        </h3>
                        <Badge 
                          variant={servico.ativo ? "default" : "secondary"}
                          className={servico.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                        >
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <p className="text-text-secondary text-sm mb-3">
                        {servico.descricao}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-text-secondary" />
                          <span className="text-text-secondary">
                            {formatarDuracao(servico.duracao)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-text-secondary" />
                          <span className="font-semibold text-secondary">
                            {formatarPreco(servico.preco)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alternarStatusServico(servico.id)}
                      >
                        {servico.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarServico(servico)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => excluirServico(servico.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
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

export default ClienteServicos;
