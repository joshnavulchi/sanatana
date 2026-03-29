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
"use client";
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' };

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'rounded-xl px-4 py-2 font-medium ui-transition';
  const primary = 'bg-teal-600 text-white hover:bg-teal-700';
  const secondary = 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  const cls = `${base} ${variant === 'primary' ? primary : secondary} ${className}`;
  return (
    <button className={cls} {...rest}>{children}</button>
  );
}
