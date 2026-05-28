// ==================== REUSABLE API HOOKS ====================

import { useState, useEffect, useCallback } from 'react';
import { FetchResult } from '../types';

// ==================== RETURN TYPES ====================

interface UseApiReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseApiSingleReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ==================== HOOK: LIST DATA ====================

export const useApi = <T>(
  apiFn: () => Promise<FetchResult<T[]>>
): UseApiReturn<T> => {
  const [data, setData]       = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFn();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch');
        setData([]);
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Unexpected error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ==================== HOOK: SINGLE ITEM BY ID ====================

export const useApiSingle = <T>(
  apiFn: (id: string) => Promise<FetchResult<T>>,
  id: string
): UseApiSingleReturn<T> => {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await apiFn(id);

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch');
        setData(null);
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Unexpected error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFn, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};