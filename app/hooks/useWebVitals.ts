import { useEffect } from 'react';
import { onCLS, onLCP, onTTFB, onINP } from 'web-vitals';
import io from 'socket.io-client';

const socket = io('http://localhost:4001');

export function useWebVitals(page: string) {
  useEffect(() => {
    const sendMetric = (metric: any) => {
      socket.emit('dashboard:metric', { page, data: { [metric.name]: metric.value } });
    };
    onCLS(sendMetric);
    // onFID(sendMetric);
    onLCP(sendMetric);
    onTTFB(sendMetric);
    if (onINP) onINP(sendMetric);
  }, [page]);
}
