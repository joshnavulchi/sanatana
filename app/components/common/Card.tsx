"use client";
import React from 'react';

type Props = { children?: React.ReactNode; className?: string };

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}
"use client";
import React from 'react';

type Props = { children?: React.ReactNode; className?: string };

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}
