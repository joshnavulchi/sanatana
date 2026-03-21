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
