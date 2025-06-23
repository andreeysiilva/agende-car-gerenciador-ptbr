
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Equipe {
  id: string;
  nome: string;
}

interface EquipeSelectionSectionProps {
  equipeSelecionada: string;
  equipes: Equipe[];
  onChange: (field: string, value: string) => void;
}

export function EquipeSelectionSection({ 
  equipeSelecionada, 
  equipes, 
  onChange 
}: EquipeSelectionSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Equipe</h3>
      <div>
        <Label htmlFor="equipe">Equipe</Label>
        <Select value={equipeSelecionada} onValueChange={(value) => onChange("equipe_id", value)}>
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
    </div>
  );
}
