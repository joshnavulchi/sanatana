/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useTheme } from '@app/context/theme-context';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div className="relative hidden">
      <button
        className="cursor-not-allowed w-10 h-10 group relative inline-flex items-center p-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 transform hover:scale-105 text-amber-800"
        aria-label="Toggle theme"
        title={`Current theme: ${theme}`}
        onClick={toggle}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-800">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
            <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" />
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="2" />
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
