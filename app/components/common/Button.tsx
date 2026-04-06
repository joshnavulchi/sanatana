"use client";

import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
};

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-200 animate-fadeInUp';
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-amber-500 via-pink-400 to-rose-400 text-white hover:from-amber-600 hover:to-rose-500 animate-gradient-x',
    secondary: 'bg-white/80 border border-rose-200 text-rose-700 hover:bg-rose-50',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

