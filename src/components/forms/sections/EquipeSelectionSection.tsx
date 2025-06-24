
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EquipeSelectionSectionProps {
  equipeSelecionada: string;
  equipes: Array<{ id: string; nome: string }>;
  onChange: (field: string, value: string) => void;
}

export function EquipeSelectionSection({
  equipeSelecionada,
  equipes,
  onChange
}: EquipeSelectionSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Equipe</h3>
      
      <div>
        <Label>Equipe Responsável</Label>
        <Select 
          value={equipeSelecionada} 
          onValueChange={(value) => onChange('equipe_id', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione a equipe" />
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
