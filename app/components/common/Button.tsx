"use client";
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
};

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-all duration-200';
  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
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
