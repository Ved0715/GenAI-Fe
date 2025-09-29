'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: initialUser || null,
    isLoading: false, // Start with false - only set to true during operations
    isAuthenticated: !!initialUser,
    error: null,
  });

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setUser = (user: User | null) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }));
  };

  // No complex auth checking needed - server handles this
  useEffect(() => {
    // Only set loading to false if we don't have initialUser
    if (initialUser === undefined) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [initialUser]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const response = await apiClient.login(email, password);
      setUser(response.user);
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { detail: string } } };
        setError(axiosError.response?.data?.detail || 'Login failed');
      } else {
        setError('Network error. Please try again.');
      }
      throw error;
    }
  };

  const register = async (email: string, name: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const response = await apiClient.register(email, name, password);
      setUser(response);
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { detail: string } } };
        setError(axiosError.response?.data?.detail || 'Registration failed');
      } else {
        setError('Network error. Please try again.');
      }
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Log the error but don't throw - we still want to clear the user
      console.error('Logout error:', error);
    } finally {
      setUser(null);

      // Redirect to login page on client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const logoutAll = async (): Promise<void> => {
    try {
      await apiClient.logoutAll();
    } catch (error) {
      // Log the error but don't throw - we still want to clear the user
      console.error('Logout all error:', error);
    } finally {
      setUser(null);

      // Redirect to login page on client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    logoutAll,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}