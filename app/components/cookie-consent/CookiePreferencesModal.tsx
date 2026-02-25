/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (prefs: Record<string, boolean>) => void;
  initial?: Record<string, boolean>;
};

const TABS = [
  { id: 'your-privacy', title: 'Your Privacy', description: 'Overview of how we handle your data and cookies.' },
  { id: 'strictly-necessary', title: 'Strictly Necessary Cookies', description: 'These cookies are required for the website to function and cannot be switched off.' },
  { id: 'functionality', title: 'Functionality Cookies', description: 'Enable enhanced site features and remember choices you make.' },
  { id: 'performance', title: 'Performance Cookies', description: 'Collect information about site performance to help us improve.' },
  { id: 'targeting', title: 'Targeting Cookies', description: 'Used to deliver adverts more relevant to you and your interests.' }
];

export default function CookiePreferencesModal({ open, onClose, onSave, initial = {} }: Props) {
  const [active, setActive] = useState<string>('your-privacy');
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    strictlyNecessary: true,
    functionality: !!initial.functionality,
    performance: !!initial.performance,
    targeting: !!initial.targeting,
  });

  if (!open) return null;

  function toggle(key: string) {
    if (key === 'strictlyNecessary') return; // cannot toggle
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function save() {
    onSave(prefs);
    onClose();
  }

  function acceptAll() {
    const all = { strictlyNecessary: true, functionality: true, performance: true, targeting: true };
    setPrefs(all);
    onSave(all);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Close cookie preferences modal" />
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 border-2 border-blue-400 shadow-2xl rounded-2xl max-w-lg md:max-w-4xl w-full mx-4 p-6 flex flex-col gap-4 animate-fadeInUp">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-700">Cookie Preferences</span>
          <button className="cursor-pointer text-blue-500 hover:text-blue-700 text-2xl font-bold px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="close" onClick={onClose}>✕</button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <nav role="menu" className="md:w-1/3 w-full">
            <ul className="space-y-2">
              {TABS.map((t, idx) => (
                <li key={idx}>
                  <button
                    className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${active === t.id ? 'bg-blue-100 text-blue-700' : 'bg-transparent  hover:bg-blue-50'}`}
                    onClick={() => setActive(t.id)}
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:w-2/3 w-full">
            <div className="mb-2">
              <span className="text-md font-semibold text-blue-700">{TABS.find(t => t.id === active)?.title}</span>
              <div className="text-sm text-gray-500">{TABS.find(t => t.id === active)?.description}</div>
            </div>
            {active === 'your-privacy' && (
              <div className="bg-blue-50 rounded-lg p-3 text-xs ">
                We use cookies to help improve the site, analyze traffic, and serve personalized content when you consent.
              </div>
            )}
            {active === 'strictly-necessary' && (
              <div className="bg-gray-100 rounded-lg p-3 text-sm flex items-center gap-2">
                <input type="checkbox" checked disabled className="accent-blue-500" />
                <span>Strictly necessary (always enabled)</span>
              </div>
            )}
            {active !== 'your-privacy' && active !== 'strictly-necessary' && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={active === 'functionality' ? !!prefs.functionality : active === 'performance' ? !!prefs.performance : !!prefs.targeting}
                  onChange={() => toggle(active === 'functionality' ? 'functionality' : active === 'performance' ? 'performance' : 'targeting')}
                />
                <span className="text-xs">Enable {TABS.find(t => t.id === active)?.title}</span>
              </div>
            )}
            {active === 'targeting' && (
              <div className="mt-2 text-sm">
                Third-party cookies for analytics and advertising may be set when you enable targeting/performance features. These are controlled by external providers and are only set when you opt in.
              </div>
            )}
            <div className="flex gap-3 mt-4 justify-end">
              <button className="cursor-pointer px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition" onClick={onClose}>Cancel</button>
              <button className="cursor-pointer px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition" onClick={save}>Save preferences</button>
              <button className="cursor-pointer px-3 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition" onClick={acceptAll}>Accept all</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */