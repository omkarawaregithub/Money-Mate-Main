// src/context/AppSettingsContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { AppSettings, Currency } from '@/types';
import useAppSettings from '@/hooks/useAppSettings';

interface AppSettingsContextType {
  appSettings: AppSettings;
  updateCurrency: (currency: Currency) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const { appSettings, updateCurrency } = useAppSettings();

  return (
    <AppSettingsContext.Provider value={{ appSettings, updateCurrency }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettingsContext must be used within an AppSettingsProvider');
  }
  return context;
}
