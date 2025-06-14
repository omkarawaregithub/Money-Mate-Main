
"use client";

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

// Helper function to get initial theme
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'; // Default for server 
  }
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
    return storedTheme;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light'); // Default, will be updated by useEffect

  // Effect for initial theme setting from localStorage or system preference
  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []); // Empty dependency array: run once on mount

  // Effect for applying theme class to HTML and saving to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') { 
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        // localStorage may not be available (e.g. private browsing)
        console.warn('Could not save theme to localStorage:', e);
      }
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);
  
  const setCurrentTheme = useCallback((newTheme: Theme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
    }
  }, []);

  return { theme, toggleTheme, setTheme: setCurrentTheme };
}
