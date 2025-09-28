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
    isLoading: initialUser === undefined && typeof window !== 'undefined', // Only loading if initialUser is undefined
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

  // Only check authentication on mount if initialUser is undefined
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    if (initialUser !== undefined) {
      // If initialUser is explicitly provided (even if null), don't auto-check
      setLoading(false);
      return;
    }

    // Only auto-check if we're on a protected route that needs auth
    const currentPath = window.location.pathname;
    const needsAuth = currentPath.startsWith('/dashboard');

    if (!needsAuth) {
      setUser(null); // Set as not authenticated for public pages
      return;
    }

    const checkAuth = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // User is not authenticated, this is normal
        setUser(null);
      }
    };

    checkAuth();
  }, [initialUser]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('AuthContext: Starting login for', email);
      setLoading(true);
      clearError();

      console.log('AuthContext: Calling apiClient.login');
      const response = await apiClient.login(email, password);
      console.log('AuthContext: Login response received', response);
      setUser(response.user);
    } catch (error) {
      console.error('AuthContext: Login error', error);
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