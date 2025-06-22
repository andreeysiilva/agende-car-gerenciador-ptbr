
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

interface ServiceFilterProps {
  availableServices: string[];
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
  onClearFilters: () => void;
}

export function ServiceFilter({ 
  availableServices, 
  selectedServices, 
  onServiceToggle, 
  onClearFilters 
}: ServiceFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Cabeçalho do filtro */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtrar por Serviço</span>
              {selectedServices.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedServices.length} selecionado{selectedServices.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {selectedServices.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-xs"
                >
                  Limpar Filtros
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? 'Recolher' : 'Expandir'}
              </Button>
            </div>
          </div>

          {/* Serviços selecionados (sempre visível) */}
          {selectedServices.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service) => (
                <Badge 
                  key={service} 
                  variant="default" 
                  className="flex items-center gap-1 cursor-pointer hover:bg-primary/80"
                  onClick={() => onServiceToggle(service)}
                >
                  {service}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          {/* Lista de todos os serviços (expansível) */}
          {isExpanded && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Todos os Serviços:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableServices.map((service) => (
                  <Button
                    key={service}
                    variant={selectedServices.includes(service) ? "default" : "outline"}
                    size="sm"
                    onClick={() => onServiceToggle(service)}
                    className="justify-start text-xs"
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Ação rápida "Todos" */}
          {!isExpanded && (
            <div className="flex items-center gap-2">
              <Button
                variant={selectedServices.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                Todos os Serviços
              </Button>
              {availableServices.slice(0, 3).map((service) => (
                <Button
                  key={service}
                  variant={selectedServices.includes(service) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onServiceToggle(service)}
                  className="text-xs"
                >
                  {service}
                </Button>
              ))}
              {availableServices.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{availableServices.length - 3} mais
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
