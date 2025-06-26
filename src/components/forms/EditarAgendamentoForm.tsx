
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trash2 } from "lucide-react";
import { FormField } from "./FormField";

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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cliente_nome.trim()) {
      newErrors.cliente_nome = "Nome do cliente é obrigatório";
    }

    if (!formData.cliente_telefone.trim()) {
      newErrors.cliente_telefone = "Telefone é obrigatório";
    }

    if (!formData.nome_carro.trim()) {
      newErrors.nome_carro = "Nome do carro é obrigatório";
    }

    if (!formData.servico) {
      newErrors.servico = "Serviço é obrigatório";
    }

    if (!formData.data_agendamento) {
      newErrors.data_agendamento = "Data é obrigatória";
    }

    if (!formData.horario) {
      newErrors.horario = "Horário é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const agendamentoAtualizado = {
      ...agendamento,
      nome_cliente: formData.cliente_nome,
      cliente: formData.cliente_nome,
      telefone: formData.cliente_telefone,
      email: formData.cliente_email,
      nome_carro: formData.nome_carro,
      carro: formData.nome_carro,
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              type="select"
              label="Status"
              value={formData.status}
              onChange={(value) => handleChange("status", value)}
              options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
              error={errors.status}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Dados do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="input"
                  label="Nome do Cliente"
                  value={formData.cliente_nome}
                  onChange={(value) => handleChange("cliente_nome", value)}
                  placeholder="Nome completo"
                  required
                  error={errors.cliente_nome}
                />
                <FormField
                  type="input"
                  label="Telefone"
                  value={formData.cliente_telefone}
                  onChange={(value) => handleChange("cliente_telefone", value)}
                  placeholder="(11) 99999-9999"
                  required
                  error={errors.cliente_telefone}
                />
              </div>
              <FormField
                type="input"
                inputType="email"
                label="Email"
                value={formData.cliente_email}
                onChange={(value) => handleChange("cliente_email", value)}
                placeholder="cliente@email.com"
                error={errors.cliente_email}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Dados do Veículo</h3>
              <FormField
                type="input"
                label="Veículo"
                value={formData.nome_carro}
                onChange={(value) => handleChange("nome_carro", value)}
                placeholder="Ex: Honda Civic 2020"
                required
                error={errors.nome_carro}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Detalhes do Agendamento</h3>
              <FormField
                type="select"
                label="Serviço"
                value={formData.servico}
                onChange={(value) => handleChange("servico", value)}
                placeholder="Selecione um serviço"
                options={servicos.map(s => ({ value: s, label: s }))}
                required
                error={errors.servico}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="input"
                  inputType="date"
                  label="Data"
                  value={formData.data_agendamento}
                  onChange={(value) => handleChange("data_agendamento", value)}
                  required
                  error={errors.data_agendamento}
                />
                <FormField
                  type="input"
                  inputType="time"
                  label="Horário"
                  value={formData.horario}
                  onChange={(value) => handleChange("horario", value)}
                  required
                  error={errors.horario}
                />
              </div>

              <FormField
                type="select"
                label="Equipe"
                value={formData.equipe_id}
                onChange={(value) => handleChange("equipe_id", value)}
                placeholder="Selecione uma equipe"
                options={equipes.map(e => ({ value: e.id, label: e.nome }))}
                error={errors.equipe_id}
              />

              <FormField
                type="textarea"
                label="Observações"
                value={formData.observacoes}
                onChange={(value) => handleChange("observacoes", value)}
                placeholder="Informações adicionais..."
                rows={3}
                error={errors.observacoes}
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
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
