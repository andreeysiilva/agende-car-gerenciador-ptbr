
import { VehicleAutocomplete } from "../VehicleAutocomplete";

interface VeiculoInfoSectionProps {
  nomeCarro: string;
  onChange: (field: string, value: string) => void;
}

export function VeiculoInfoSection({ nomeCarro, onChange }: VeiculoInfoSectionProps) {
  const handleVehicleChange = (value: string) => {
    onChange("nome_carro", value);
  };

  return (
    <div className="space-y-2">
      <VehicleAutocomplete
        value={nomeCarro}
        onChange={handleVehicleChange}
      />
    </div>
  );
}
