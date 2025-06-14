
"use client";

import type { UserProfile } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_KEY = 'moneyMate_mock_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // To prevent layout shifts on initial load
  const router = useRouter();

  useEffect(() => {
    // Check local storage for persisted login state
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as UserProfile;
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error reading auth state from localStorage", error);
      localStorage.removeItem(MOCK_USER_KEY); // Clear corrupted data
    }
    setLoading(false);
  }, []);

  const login = (email: string, name: string = "Demo User") => {
    const mockUser: UserProfile = { name, email };
    try {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error saving auth state to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(MOCK_USER_KEY);
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error("Error removing auth state from localStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
