
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VeiculoInfoSectionProps {
  nomeCarro: string;
  onChange: (field: string, value: string) => void;
}

export function VeiculoInfoSection({ nomeCarro, onChange }: VeiculoInfoSectionProps) {
  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="nome_carro">Veículo *</Label>
        <Input
          id="nome_carro"
          value={nomeCarro}
          onChange={(e) => onChange("nome_carro", e.target.value)}
          placeholder="Ex: Honda Civic 2020"
          required
        />
      </div>
    </div>
  );
}
