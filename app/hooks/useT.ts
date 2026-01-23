/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useLocale } from '../context/locale-context';
import { t as serverT, getLocaleObject } from '../../lib/i18n';
import { useState, useEffect } from 'react';

export function useT() {
  const { locale, isLoading } = useLocale();
  const [, forceUpdate] = useState(0);

  // Force re-render when locale finishes loading
  useEffect(() => {
    if (!isLoading) {
      const localeObj = getLocaleObject(locale);
      if (localeObj && typeof localeObj === 'object' && Object.keys(localeObj).length > 0) {
        forceUpdate(prev => prev + 1);
      }
    }
  }, [locale, isLoading]);

  return (key: string) => {
    return serverT(key, locale);
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
