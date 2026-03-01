'use client';
import { useWebVitals } from '@app/hooks/useWebVitals';

export default function WebVitalsReporter({ page }: { page: string }) {
  useWebVitals(page);
  return null;
}
