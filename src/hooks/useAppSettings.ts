// src/hooks/useAppSettings.ts
"use client";

import type { Dispatch, SetStateAction } from 'react';
import type { AppSettings, Currency } from '@/types';
import useLocalStorage from './useLocalStorage';

const APP_SETTINGS_STORAGE_KEY = 'moneyMate_appSettings';

const defaultAppSettings: AppSettings = {
  currency: 'USD',
};

interface UseAppSettingsReturn {
  appSettings: AppSettings;
  updateCurrency: (currency: Currency) => void;
  setAppSettings: Dispatch<SetStateAction<AppSettings>>;
}

export default function useAppSettings(): UseAppSettingsReturn {
  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>(
    APP_SETTINGS_STORAGE_KEY,
    defaultAppSettings
  );

  const updateCurrency = (currency: Currency) => {
    setAppSettings((prevSettings) => ({
      ...prevSettings,
      currency,
    }));
  };

  return {
    appSettings,
    updateCurrency,
    setAppSettings,
  };
}
