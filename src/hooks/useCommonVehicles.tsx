
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CommonVehicle {
  id: string;
  nome: string;
  marca: string;
}

export function useCommonVehicles() {
  const [vehicles, setVehicles] = useState<CommonVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('common_vehicles')
          .select('id, nome, marca')
          .order('nome');

        if (error) {
          console.error('Error fetching vehicles:', error);
          setError(error.message);
        } else {
          setVehicles(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Erro inesperado ao carregar veículos');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}
