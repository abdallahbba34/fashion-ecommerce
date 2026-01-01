import { useState, useEffect } from 'react';

interface YalidineCenter {
  id: number;
  name: string;
  address: string;
  wilaya_id: number;
  commune_id: number;
  commune_name?: string;
}

export function useYalidineStopDesks(wilayaId?: number) {
  const [stopDesks, setStopDesks] = useState<YalidineCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wilayaId) {
      setStopDesks([]);
      return;
    }

    const fetchStopDesks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/yalidine/centers?wilaya_id=${wilayaId}`);

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des stop desks');
        }

        const data = await response.json();

        if (data.success && data.centers) {
          setStopDesks(data.centers);
        } else {
          setStopDesks([]);
        }
      } catch (err: any) {
        console.error('Error fetching stop desks:', err);
        setError(err.message);
        setStopDesks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStopDesks();
  }, [wilayaId]);

  return { stopDesks, loading, error };
}
