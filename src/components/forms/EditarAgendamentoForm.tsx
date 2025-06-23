
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Trash2 } from "lucide-react";

interface EditarAgendamentoFormProps {
  agendamento: any;
  onClose: () => void;
  onSave: (agendamento: any) => void;
  onDelete: (agendamentoId: string) => void;
}

export function EditarAgendamentoForm({ agendamento, onClose, onSave, onDelete }: EditarAgendamentoFormProps) {
  const [formData, setFormData] = useState({
    cliente_nome: agendamento.nome_cliente || agendamento.cliente || "",
    cliente_telefone: agendamento.telefone || "",
    cliente_email: agendamento.email || "",
    nome_carro: agendamento.nome_carro || agendamento.carro || "",
    servico: agendamento.servico || "",
    data_agendamento: agendamento.data_agendamento || "",
    horario: agendamento.horario || "",
    equipe_id: agendamento.equipe_id || "",
    observacoes: agendamento.observacoes || "",
    status: agendamento.status || "confirmado"
  });

  // Dados mockados - serão substituídos por dados do Supabase
  const servicos = [
    "Lavagem Completa",
    "Lavagem Simples",
    "Enceramento",
    "Lavagem e Enceramento",
    "Detalhamento",
    "Lavagem Seca"
  ];

  const equipes = [
    { id: "1", nome: "Equipe Principal" },
    { id: "2", nome: "Equipe A - Lavagem Rápida" },
    { id: "3", nome: "Equipe B - Detalhamento" }
  ];

  const statusOptions = [
    { value: "confirmado", label: "Confirmado", color: "bg-green-100 text-green-800" },
    { value: "pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
    { value: "concluido", label: "Concluído", color: "bg-blue-100 text-blue-800" },
    { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.cliente_nome || !formData.cliente_telefone || !formData.nome_carro || 
        !formData.servico || !formData.data_agendamento || !formData.horario) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Criar objeto do agendamento atualizado
    const agendamentoAtualizado = {
      ...agendamento,
      nome_cliente: formData.cliente_nome,
      cliente: formData.cliente_nome, // Para compatibilidade
      telefone: formData.cliente_telefone,
      email: formData.cliente_email,
      nome_carro: formData.nome_carro,
      carro: formData.nome_carro, // Para compatibilidade
      servico: formData.servico,
      data_agendamento: formData.data_agendamento,
      horario: formData.horario,
      equipe_id: formData.equipe_id,
      observacoes: formData.observacoes,
      status: formData.status
    };

    onSave(agendamentoAtualizado);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      onDelete(agendamento.id);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Editar Agendamento</CardTitle>
              <Badge className={getStatusColor(formData.status)}>
                {statusOptions.find(s => s.value === formData.status)?.label || formData.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dados do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_nome">Nome do Cliente *</Label>
                <Input
                  id="cliente_nome"
                  value={formData.cliente_nome}
                  onChange={(e) => handleChange("cliente_nome", e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cliente_telefone">Telefone *</Label>
                <Input
                  id="cliente_telefone"
                  value={formData.cliente_telefone}
                  onChange={(e) => handleChange("cliente_telefone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cliente_email">Email</Label>
              <Input
                id="cliente_email"
                type="email"
                value={formData.cliente_email}
                onChange={(e) => handleChange("cliente_email", e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>

            {/* Dados do Veículo */}
            <div>
              <Label htmlFor="nome_carro">Veículo *</Label>
              <Input
                id="nome_carro"
                value={formData.nome_carro}
                onChange={(e) => handleChange("nome_carro", e.target.value)}
                placeholder="Ex: Honda Civic 2020"
                required
              />
            </div>

            {/* Serviço */}
            <div>
              <Label htmlFor="servico">Serviço *</Label>
              <Select value={formData.servico} onValueChange={(value) => handleChange("servico", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {servicos.map((servico) => (
                    <SelectItem key={servico} value={servico}>
                      {servico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data e Horário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_agendamento">Data *</Label>
                <Input
                  id="data_agendamento"
                  type="date"
                  value={formData.data_agendamento}
                  onChange={(e) => handleChange("data_agendamento", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="horario">Horário *</Label>
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleChange("horario", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Equipe */}
            <div>
              <Label htmlFor="equipe">Equipe</Label>
              <Select value={formData.equipe_id} onValueChange={(value) => handleChange("equipe_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma equipe" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {equipes.map((equipe) => (
                    <SelectItem key={equipe.id} value={equipe.id}>
                      {equipe.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
