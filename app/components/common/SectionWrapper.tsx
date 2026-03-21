"use client";
import React from 'react';

type Props = { children?: React.ReactNode; className?: string };

export default function SectionWrapper({ children, className = '' }: Props) {
  return (
    <section className={`py-8 sm:py-10 md:py-12 ${className}`}>{children}</section>
  );
}
