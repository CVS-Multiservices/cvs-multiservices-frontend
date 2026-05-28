import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/dataService';
import { AllData } from '../types';

// ==================== STORE RETURN TYPE ====================
interface DataStoreReturn extends AllData {
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ==================== INITIAL STATE ====================
const initialState: AllData = {
  slides:           [],
  stats:            [],
  features:         [],
  partners:         [],
  blogs:            [],
  team:             [],
  ongoingProjects:  [],
  upcomingProjects: [],
  achievements:     [],
  timeline:         [],
  testimonials:     [],
  jobs:             [],
  csr:              [],
  gallery:          [],
  contact:          [],
  links:          [],
};

// ==================== HOOK ====================
export const useDataStore = (): DataStoreReturn => {
  const [allData, setAllData] = useState<AllData>(initialState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  const loadAll = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const result = await dataService.getAll();
      setAllData(result);
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    ...allData,
    loading,
    error,
    refetch: loadAll,
  };
};