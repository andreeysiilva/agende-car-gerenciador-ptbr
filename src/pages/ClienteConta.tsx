
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Clock, User, Bell, Shield, Building, Plus, Trash2, Save } from "lucide-react";

// Dados de exemplo para horários de funcionamento
const diasSemana = [
  { id: 0, nome: "Domingo" },
  { id: 1, nome: "Segunda-feira" },
  { id: 2, nome: "Terça-feira" },
  { id: 3, nome: "Quarta-feira" },
  { id: 4, nome: "Quinta-feira" },
  { id: 5, nome: "Sexta-feira" },
  { id: 6, nome: "Sábado" }
];

export default function ClienteConta() {
  // Estados para horários de funcionamento
  const [horariosFuncionamento, setHorariosFuncionamento] = useState([
    { dia: 1, inicio: "08:00", fim: "18:00", funcionando: true },
    { dia: 2, inicio: "08:00", fim: "18:00", funcionando: true },
    { dia: 3, inicio: "08:00", fim: "18:00", funcionando: true },
    { dia: 4, inicio: "08:00", fim: "18:00", funcionando: true },
    { dia: 5, inicio: "08:00", fim: "18:00", funcionando: true },
    { dia: 6, inicio: "08:00", fim: "16:00", funcionando: true },
    { dia: 0, inicio: "", fim: "", funcionando: false }
  ]);

  // Estados para agendas/atendentes
  const [agendas, setAgendas] = useState([
    { id: "1", nome: "Equipe A - Lavagem Rápida", ativo: true },
    { id: "2", nome: "Equipe B - Detalhamento", ativo: true }
  ]);
  const [novaAgenda, setNovaAgenda] = useState("");

  // Estados para dados da empresa
  const [dadosEmpresa, setDadosEmpresa] = useState({
    nome: "Empresa Demo",
    endereco: "Rua das Flores, 123 - Centro",
    telefone: "(11) 99999-9999",
    linkExterno: "https://wa.me/5511999999999",
    logoUrl: ""
  });

  // Estados para notificações
  const [notificacoes, setNotificacoes] = useState({
    telegramNovos: true,
    telegramResumo: true,
    whatsapp: false
  });

  // Estados para troca de senha
  const [senhas, setSenhas] = useState({
    atual: "",
    nova: "",
    confirmacao: ""
  });

  // Funções para gerenciar horários
  const atualizarHorario = (dia: number, campo: string, valor: any) => {
    setHorariosFuncionamento(prev => 
      prev.map(h => 
        h.dia === dia ? { ...h, [campo]: valor } : h
      )
    );
  };

  // Funções para gerenciar agendas
  const adicionarAgenda = () => {
    if (novaAgenda.trim()) {
      const novoId = Date.now().toString();
      setAgendas(prev => [...prev, { id: novoId, nome: novaAgenda, ativo: true }]);
      setNovaAgenda("");
    }
  };

  const removerAgenda = (id: string) => {
    setAgendas(prev => prev.filter(a => a.id !== id));
  };

  // Função para salvar configurações
  const salvarConfiguracoes = () => {
    console.log("Salvando configurações...");
    // Aqui seria a integração com Supabase
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conta e Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações da sua empresa</p>
        </div>

        <Tabs defaultValue="horarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="agendas" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Agendas
            </TabsTrigger>
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Aba de Horários de Funcionamento */}
          <TabsContent value="horarios">
            <Card>
              <CardHeader>
                <CardTitle>Horário de Funcionamento</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure os horários de funcionamento da sua empresa
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {diasSemana.map(dia => {
                  const horario = horariosFuncionamento.find(h => h.dia === dia.id);
                  return (
                    <div key={dia.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-32">
                        <Label className="font-medium">{dia.nome}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={horario?.funcionando || false}
                          onCheckedChange={(checked) => 
                            atualizarHorario(dia.id, 'funcionando', checked)
                          }
                        />
                        <span className="text-sm">Funcionando</span>
                      </div>
                      {horario?.funcionando && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={horario.inicio}
                            onChange={(e) => 
                              atualizarHorario(dia.id, 'inicio', e.target.value)
                            }
                            className="w-32"
                          />
                          <span className="text-gray-500">até</span>
                          <Input
                            type="time"
                            value={horario.fim}
                            onChange={(e) => 
                              atualizarHorario(dia.id, 'fim', e.target.value)
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button onClick={salvarConfiguracoes} className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Horários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Agendas e Atendentes */}
          <TabsContent value="agendas">
            <Card>
              <CardHeader>
                <CardTitle>Agendas e Atendentes</CardTitle>
                <p className="text-sm text-gray-600">
                  Gerencie múltiplas agendas por atendente ou equipe
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da nova agenda (ex: Equipe A - Lavagem)"
                    value={novaAgenda}
                    onChange={(e) => setNovaAgenda(e.target.value)}
                  />
                  <Button onClick={adicionarAgenda}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {agendas.map(agenda => (
                    <div key={agenda.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={agenda.ativo}
                          onCheckedChange={(checked) => 
                            setAgendas(prev => 
                              prev.map(a => a.id === agenda.id ? { ...a, ativo: checked } : a)
                            )
                          }
                        />
                        <span className={agenda.ativo ? "text-gray-900" : "text-gray-500"}>
                          {agenda.nome}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removerAgenda(agenda.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Dados da Empresa */}
          <TabsContent value="empresa">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <p className="text-sm text-gray-600">
                  Informações básicas da sua empresa
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Empresa</Label>
                    <Input
                      id="nome"
                      value={dadosEmpresa.nome}
                      onChange={(e) => 
                        setDadosEmpresa(prev => ({ ...prev, nome: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={dadosEmpresa.telefone}
                      onChange={(e) => 
                        setDadosEmpresa(prev => ({ ...prev, telefone: e.target.value }))
                      }
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Textarea
                    id="endereco"
                    value={dadosEmpresa.endereco}
                    onChange={(e) => 
                      setDadosEmpresa(prev => ({ ...prev, endereco: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="link">Link Externo (WhatsApp, Instagram, etc.)</Label>
                  <Input
                    id="link"
                    placeholder="https://wa.me/5511999999999"
                    value={dadosEmpresa.linkExterno}
                    onChange={(e) => 
                      setDadosEmpresa(prev => ({ ...prev, linkExterno: e.target.value }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo">Logo da Empresa</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      // Aqui seria implementado o upload da imagem
                      console.log("Upload de logo:", e.target.files?.[0]);
                    }}
                  />
                </div>
                
                <Button onClick={salvarConfiguracoes}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Dados
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Notificações */}
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure como deseja receber notificações
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Telegram - Novos Agendamentos</Label>
                      <p className="text-sm text-gray-600">
                        Receba notificação quando houver novos agendamentos ou cancelamentos
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.telegramNovos}
                      onCheckedChange={(checked) => 
                        setNotificacoes(prev => ({ ...prev, telegramNovos: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Telegram - Resumo Diário</Label>
                      <p className="text-sm text-gray-600">
                        Resumo da agenda do dia enviado às 08:00
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.telegramResumo}
                      onCheckedChange={(checked) => 
                        setNotificacoes(prev => ({ ...prev, telegramResumo: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">WhatsApp (Preparado, Desabilitado)</Label>
                      <p className="text-sm text-gray-600">
                        Integração com WhatsApp em desenvolvimento
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.whatsapp}
                      disabled={true}
                      onCheckedChange={(checked) => 
                        setNotificacoes(prev => ({ ...prev, whatsapp: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Button onClick={salvarConfiguracoes}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Segurança */}
          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <p className="text-sm text-gray-600">
                  Altere sua senha de acesso
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <Input
                    id="senhaAtual"
                    type="password"
                    value={senhas.atual}
                    onChange={(e) => 
                      setSenhas(prev => ({ ...prev, atual: e.target.value }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="senhaNova">Nova Senha</Label>
                  <Input
                    id="senhaNova"
                    type="password"
                    value={senhas.nova}
                    onChange={(e) => 
                      setSenhas(prev => ({ ...prev, nova: e.target.value }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="senhaConfirmacao">Confirmar Nova Senha</Label>
                  <Input
                    id="senhaConfirmacao"
                    type="password"
                    value={senhas.confirmacao}
                    onChange={(e) => 
                      setSenhas(prev => ({ ...prev, confirmacao: e.target.value }))
                    }
                  />
                </div>
                
                <Button 
                  onClick={() => {
                    if (senhas.nova === senhas.confirmacao) {
                      console.log("Alterando senha...");
                      // Aqui seria a integração com Supabase Auth
                    } else {
                      alert("As senhas não coincidem");
                    }
                  }}
                  disabled={!senhas.atual || !senhas.nova || senhas.nova !== senhas.confirmacao}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
