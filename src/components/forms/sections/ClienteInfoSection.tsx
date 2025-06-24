
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
      <div>
        <Label htmlFor="cliente_nome">Nome do Cliente *</Label>
        <Input
          id="cliente_nome"
          value={formData.cliente_nome}
          onChange={(e) => onChange("cliente_nome", e.target.value)}
          placeholder="Nome completo do cliente"
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

      <div>
        <Label htmlFor="cliente_email">E-mail</Label>
        <Input
          id="cliente_email"
          type="email"
          value={formData.cliente_email}
          onChange={(e) => onChange("cliente_email", e.target.value)}
          placeholder="email@exemplo.com"
        />
      </div>
    </div>
  );
}
