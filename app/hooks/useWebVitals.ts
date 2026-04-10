import { useEffect } from 'react';

export function useWebVitals(page: string) {
  useEffect(() => {
    function sendToAnalytics(metric: any) {
      const { name, value } = metric;
      console.log(`[Web Vitals] ${name} on ${page}:`, value);
    }
    // Example usage: sendToAnalytics({ name: 'CLS', value: 0.1 });
  }, [page]);
}

