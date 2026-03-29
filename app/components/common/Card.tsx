"use client";

import React from 'react';

type Props = { children?: React.ReactNode; className?: string };

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 border-2 border-amber-100 rounded-2xl shadow-xl p-6 animate-fadeInUp ${className}`}>
      {children}
    </div>
  );
}
