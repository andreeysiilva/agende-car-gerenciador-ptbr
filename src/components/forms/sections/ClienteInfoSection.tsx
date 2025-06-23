
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClienteInfoSectionProps {
  formData: {
    cliente_nome: string;
    cliente_telefone: string;
    cliente_email: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ClienteInfoSection({ formData, onChange }: ClienteInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Dados do Cliente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cliente_nome">Nome do Cliente *</Label>
          <Input
            id="cliente_nome"
            value={formData.cliente_nome}
            onChange={(e) => onChange("cliente_nome", e.target.value)}
            placeholder="Nome completo"
            required
          />
        </div>
        <div>
          <Label htmlFor="cliente_telefone">Telefone *</Label>
          <Input
            id="cliente_telefone"
            value={formData.cliente_telefone}
            onChange={(e) => onChange("cliente_telefone", e.target.value)}
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
          onChange={(e) => onChange("cliente_email", e.target.value)}
          placeholder="cliente@email.com"
        />
      </div>
    </div>
  );
}
