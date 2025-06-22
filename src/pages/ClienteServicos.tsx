
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";
import { ClientLayout } from "@/components/layout/ClientLayout";

// Dados de exemplo dos serviços
const servicosExemplo = [
  {
    id: "1",
    nome: "Lavagem Simples",
    descricao: "Lavagem externa básica do veículo",
    preco: 25.00,
    duracao: 30,
    ativo: true
  },
  {
    id: "2",
    nome: "Lavagem Completa",
    descricao: "Lavagem externa e interna completa",
    preco: 45.00,
    duracao: 60,
    ativo: true
  },
  {
    id: "3",
    nome: "Enceramento",
    descricao: "Aplicação de cera protetora",
    preco: 80.00,
    duracao: 90,
    ativo: true
  },
  {
    id: "4",
    nome: "Detalhamento Premium",
    descricao: "Serviço completo de detalhamento automotivo",
    preco: 150.00,
    duracao: 180,
    ativo: false
  }
];

export default function ClienteServicos() {
  const [servicos, setServicos] = useState(servicosExemplo);
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoEditando, setServicoEditando] = useState<any>(null);
  const [formulario, setFormulario] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao: ""
  });

  // Função para abrir modal de criação
  const abrirModalCriacao = () => {
    setServicoEditando(null);
    setFormulario({ nome: "", descricao: "", preco: "", duracao: "" });
    setModalAberto(true);
  };

  // Função para abrir modal de edição
  const abrirModalEdicao = (servico: any) => {
    setServicoEditando(servico);
    setFormulario({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString()
    });
    setModalAberto(true);
  };

  // Função para salvar serviço
  const salvarServico = () => {
    if (servicoEditando) {
      // Editar serviço existente
      setServicos(prev => 
        prev.map(s => 
          s.id === servicoEditando.id 
            ? {
                ...s,
                nome: formulario.nome,
                descricao: formulario.descricao,
                preco: parseFloat(formulario.preco),
                duracao: parseInt(formulario.duracao)
              }
            : s
        )
      );
    } else {
      // Criar novo serviço
      const novoServico = {
        id: Date.now().toString(),
        nome: formulario.nome,
        descricao: formulario.descricao,
        preco: parseFloat(formulario.preco),
        duracao: parseInt(formulario.duracao),
        ativo: true
      };
      setServicos(prev => [...prev, novoServico]);
    }
    setModalAberto(false);
  };

  // Função para alternar status do serviço
  const alternarStatus = (id: string) => {
    setServicos(prev => 
      prev.map(s => 
        s.id === id ? { ...s, ativo: !s.ativo } : s
      )
    );
  };

  // Função para remover serviço
  const removerServico = (id: string) => {
    if (confirm("Tem certeza que deseja remover este serviço?")) {
      setServicos(prev => prev.filter(s => s.id !== id));
    }
  };

  const servicosAtivos = servicos.filter(s => s.ativo);
  const precoMedio = servicosAtivos.reduce((acc, s) => acc + s.preco, 0) / servicosAtivos.length || 0;
  const duracaoMedia = servicosAtivos.reduce((acc, s) => acc + s.duracao, 0) / servicosAtivos.length || 0;

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
            <p className="text-gray-600">Gerencie os serviços oferecidos pela sua empresa</p>
          </div>
          
          <Button onClick={abrirModalCriacao}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{servicos.length}</div>
              <div className="text-sm text-gray-600">Total de Serviços</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{servicosAtivos.length}</div>
              <div className="text-sm text-gray-600">Serviços Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">R$ {precoMedio.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Preço Médio</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{Math.round(duracaoMedia)}min</div>
              <div className="text-sm text-gray-600">Duração Média</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de serviços */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {servicos.map((servico) => (
            <Card key={servico.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={servico.ativo ? "default" : "secondary"}>
                      {servico.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm">{servico.descricao}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">R$ {servico.preco.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{servico.duracao}min</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => abrirModalEdicao(servico)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant={servico.ativo ? "secondary" : "default"} 
                    size="sm"
                    onClick={() => alternarStatus(servico.id)}
                  >
                    {servico.ativo ? "Desativar" : "Ativar"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removerServico(servico.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de criação/edição */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>
                  {servicoEditando ? "Editar Serviço" : "Novo Serviço"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Serviço</Label>
                  <Input
                    id="nome"
                    value={formulario.nome}
                    onChange={(e) => setFormulario(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Lavagem Completa"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formulario.descricao}
                    onChange={(e) => setFormulario(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o serviço..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formulario.preco}
                      onChange={(e) => setFormulario(prev => ({ ...prev, preco: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duracao">Duração (min)</Label>
                    <Input
                      id="duracao"
                      type="number"
                      value={formulario.duracao}
                      onChange={(e) => setFormulario(prev => ({ ...prev, duracao: e.target.value }))}
                      placeholder="60"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setModalAberto(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={salvarServico}
                    disabled={!formulario.nome || !formulario.preco || !formulario.duracao}
                  >
                    {servicoEditando ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
