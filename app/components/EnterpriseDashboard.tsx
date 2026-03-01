'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4001');

export default function EnterpriseDashboard() {
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    socket.on('dashboard:update', setData);
    return () => { socket.off('dashboard:update'); };
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 my-12 py-10 bg-gradient-to-br from-blue-50 via-white to-amber-50 rounded-3xl shadow-2xl border border-blue-200">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-1">Enterprise Dashboard</h1>
          <p className="text-base text-blue-700 font-medium">Real-time Web Vitals & Metrics</p>
        </div>
        <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold shadow">Live</span>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data).length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-blue-200 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <span className="text-lg text-blue-500 font-semibold">Waiting for live data...</span>
            <span className="text-sm text-blue-400 mt-2">Open site pages to send metrics</span>
          </div>
        ) : (
          Object.entries(data).map(([page, metrics]) => (
            <div key={page} className="bg-white border border-blue-100 rounded-xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Active" />
                <h2 className="text-xl font-bold text-blue-800">{page.charAt(0).toUpperCase() + page.slice(1)}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(metrics).map(([key, value]) => {
                  if (key === 'lastUpdated') return null;
                  // Color logic for web-vitals
                  let color = 'text-green-700 bg-green-100';
                  if (typeof value === 'number') {
                    // Example thresholds (customize per metric)
                    if (key === 'LCP') {
                      if (value > 4) color = 'text-red-700 bg-red-100';
                      else if (value > 2.5) color = 'text-orange-700 bg-orange-100';
                      else if (value > 1.5) color = 'text-yellow-700 bg-yellow-100';
                    } else if (key === 'FID' || key === 'INP') {
                      if (value > 300) color = 'text-red-700 bg-red-100';
                      else if (value > 200) color = 'text-orange-700 bg-orange-100';
                      else if (value > 100) color = 'text-yellow-700 bg-yellow-100';
                    } else if (key === 'CLS') {
                      if (value > 0.25) color = 'text-red-700 bg-red-100';
                      else if (value > 0.1) color = 'text-orange-700 bg-orange-100';
                      else if (value > 0.05) color = 'text-yellow-700 bg-yellow-100';
                    } else if (key === 'TTFB') {
                      if (value > 800) color = 'text-red-700 bg-red-100';
                      else if (value > 600) color = 'text-orange-700 bg-orange-100';
                      else if (value > 300) color = 'text-yellow-700 bg-yellow-100';
                    }
                  }
                  return (
                    <div key={key} className={`flex flex-col items-start rounded-lg px-3 py-2 ${color}`}>
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{key}</span>
                      <span className="text-base font-bold">{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-blue-400">Last updated: {metrics.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : '-'}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
