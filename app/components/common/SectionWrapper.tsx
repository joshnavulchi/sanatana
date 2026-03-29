"use client";
import React from 'react';

type Props = { children?: React.ReactNode; className?: string };

export default function SectionWrapper({ children, className = '' }: Props) {
  return (
    <section className={`py-8 sm:py-10 md:py-12 bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 rounded-2xl shadow-lg animate-fadeInUp ${className}`}>{children}</section>
  );
}
