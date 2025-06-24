
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCommonVehicles } from '@/hooks/useCommonVehicles';
import { cn } from '@/lib/utils';

interface VehicleAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function VehicleAutocomplete({ value, onChange }: VehicleAutocompleteProps) {
  const { vehicles, loading } = useCommonVehicles();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter(vehicle =>
      vehicle.nome.toLowerCase().includes(value.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [value, vehicles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (vehicleName: string) => {
    onChange(vehicleName);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className="relative">
      <Label htmlFor="nome_carro">Veículo *</Label>
      <Input
        ref={inputRef}
        id="nome_carro"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Digite ou selecione o modelo do veículo"
        required
        className="mt-1"
      />
      
      {showSuggestions && !loading && filteredVehicles.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {filteredVehicles.slice(0, 10).map((vehicle) => (
            <button
              key={vehicle.id}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(vehicle.nome)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{vehicle.nome}</span>
                <span className="text-sm text-gray-500">{vehicle.marca}</span>
              </div>
            </button>
          ))}
          
          {value && !filteredVehicles.some(v => v.nome.toLowerCase() === value.toLowerCase()) && (
            <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200">
              Pressione Enter para usar "{value}"
            </div>
          )}
        </div>
      )}
      
      {showSuggestions && !loading && filteredVehicles.length === 0 && value && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3"
        >
          <div className="text-sm text-gray-500">
            Nenhum veículo encontrado. Você pode digitar qualquer modelo.
          </div>
        </div>
      )}
    </div>
  );
}
