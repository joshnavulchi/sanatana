"use client";

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { useLocale } from '@app/context/locale-context';
import { t as serverT } from '@lib/i18n';

export function useT() {
  const { locale } = useLocale();
  return (key: string) => serverT(key, locale);
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
