import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Convenience hook for authentication API calls
export function useAuthApi() {
  const api = useApi();

  const login = useCallback(
    (email: string, password: string) =>
      api.execute(() => apiClient.login(email, password)),
    [api]
  );

  const register = useCallback(
    (email: string, name: string, password: string) =>
      api.execute(() => apiClient.register(email, name, password)),
    [api]
  );

  const logout = useCallback(
    () => api.execute(() => apiClient.logout()),
    [api]
  );

  const logoutAll = useCallback(
    () => api.execute(() => apiClient.logoutAll()),
    [api]
  );

  const getCurrentUser = useCallback(
    () => api.execute(() => apiClient.getCurrentUser()),
    [api]
  );

  return {
    ...api,
    login,
    register,
    logout,
    logoutAll,
    getCurrentUser,
  };
}