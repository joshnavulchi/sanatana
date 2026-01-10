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
    <div className="cookies-preference-wrapper fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white border rounded shadow-md flex flex-col items-center gap-2">
        <div className="w-full flex items-start justify-between">
          <b>Cookie Preference Manager</b>
          <button className="button inline-block shadow-sm bg-amber-400 hover:bg-amber-200 no-underline" aria-label="close" onClick={onClose}>✕</button>
        </div>

        <div className="md:mx-auto md:min-w-5xl md:flex md:gap-4">
          <nav role="menu" className="w-full md:w-1/4">
            <ul>
              {TABS.map((t, idx) => (
                <li key={idx}>
                  <button className="button inline-block shadow-sm bg-amber-400 hover:bg-amber-200 no-underline" onClick={() => setActive(t.id)} >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full md:w-3/4">
            <b>{TABS.find(t => t.id === active)?.title}</b>
            <div>
              <small>{TABS.find(t => t.id === active)?.description}</small>
            </div>

            {active === 'your-privacy' && (
              <div>
                <small>We use cookies to help improve the site, analyze traffic, and serve personalized content when you consent.</small>
              </div>
            )}

            {active === 'strictly-necessary' && (
              <div>
                <small>These cookies are essential for basic site operation and cannot be declined.</small>
                <label>
                  <input type="checkbox" checked disabled />
                  <span>Strictly necessary (always enabled)</span>
                </label>
              </div>
            )}

            {active !== 'your-privacy' && active !== 'strictly-necessary' && (
              <>
                <small>Enable {TABS.find(t => t.id === active)?.title}</small>
                <div className="flex gap-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        active === 'functionality' ? !!prefs.functionality : active === 'performance' ? !!prefs.performance : !!prefs.targeting
                      }
                      onChange={() => toggle(active === 'functionality' ? 'functionality' : active === 'performance' ? 'performance' : 'targeting')}
                    />
                  </label>
                  <small>You can change this later by opening the Cookie Preference Manager.</small>
                </div>
              </>
            )}
            {active === 'targeting' && (
              <div className="mt-2">
                <small>Third-party cookies for analytics and advertising may be set when you enable targeting/performance features. These are controlled by external providers and are only set when you opt in.</small>
              </div>
            )}
            <div className="buttons-group flex gap-2">
              <button className="button inline-block shadow-sm bg-amber-400 hover:bg-amber-200 no-underline" onClick={onClose}>Cancel</button>
              <button className="button inline-block shadow-sm bg-amber-400 hover:bg-amber-200 no-underline" onClick={save}>Save preferences</button>
              <button className="button inline-block shadow-sm bg-green-400 hover:bg-green-200 no-underline" onClick={acceptAll}>Accept all</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */