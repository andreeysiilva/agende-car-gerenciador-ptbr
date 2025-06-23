
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface ClienteFormProps {
  cliente?: any;
  onClose: () => void;
  onSave: (cliente: any) => void;
  isEditing?: boolean;
}

export function ClienteForm({ cliente, onClose, onSave, isEditing = false }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    telefone: cliente?.telefone || "",
    email: cliente?.email || "",
    endereco: cliente?.endereco || "",
    observacoes: cliente?.observacoes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.telefone) {
      alert("Por favor, preencha o nome e telefone do cliente.");
      return;
    }

    // Criar objeto do cliente
    const clienteData = {
      id: cliente?.id || Date.now().toString(),
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      endereco: formData.endereco,
      observacoes: formData.observacoes,
      ativo: cliente?.ativo ?? true,
      totalAgendamentos: cliente?.totalAgendamentos || 0,
      ultimoAgendamento: cliente?.ultimoAgendamento || null,
      status: cliente?.status || "ativo"
    };

    onSave(clienteData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isEditing ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Nome completo do cliente"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>

            {/* Endereço */}
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
                placeholder="Endereço completo"
              />
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre o cliente..."
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? "Salvar Alterações" : "Adicionar Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
