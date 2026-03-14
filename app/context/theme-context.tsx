/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import storage from '@lib/storage';

// Ensure theme key is always persisted in localStorage
storage.addLocalKey('sd_theme');

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = storage.getItem('sd_theme', { type: 'local' });
      return (stored as Theme) || 'light';
    } catch {
      return 'light';
    }
  });
  const [isLoaded, setIsLoaded] = useState(true);

  // No need for extra effects to set theme or isLoaded

  useEffect(() => {
    if (!isLoaded) return;
    function apply(t: Theme) {
      const root = document.documentElement;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = t === 'dark' || (t === 'system' && prefersDark);
      root.classList.remove('theme-dark', 'theme-light');
      root.removeAttribute('data-theme');
      if (isDark) {
        root.classList.add('dark');
        root.classList.add('theme-dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('theme-light');
        root.setAttribute('data-theme', 'light');
      }
    }
    apply(theme);
    try {
      storage.setItem('sd_theme', theme);
    } catch (err) {
      // ignore
    }
  }, [theme, isLoaded]);

  function setTheme(t: Theme) {
    setThemeState(t);
  }

  function toggle() {
    setThemeState((s) => {
      const next = s === 'dark' ? 'light' : 'dark';
      try {
        storage.setItem('sd_theme', next);
      } catch (err) {
        // ignore
      }
      return next;
    });
  }

  if (!isLoaded) return null;
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
