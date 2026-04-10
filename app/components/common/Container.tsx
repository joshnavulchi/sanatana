"use client";
import React from 'react';

type Props = { children?: React.ReactNode; className?: string };

export default function Container({ children, className = '' }: Props) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 rounded-2xl shadow-lg animate-fadeInUp ${className}`}>{children}</div>
  );
}

