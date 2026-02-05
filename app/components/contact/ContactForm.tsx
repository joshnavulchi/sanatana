/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import React, { useEffect, useMemo, useState } from 'react';
import useLocaleSection from '../../hooks/useLocaleSection';

type Field = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type Props = {
  fields?: Field[];
  submitButton?: { label?: string; action?: string } | null;
};

export default function ContactForm({ fields, submitButton }: Props) {
  const localeObj = useLocaleSection('sharable_strings');
  const defaults: Field[] = useMemo(() => ([
    { name: 'name', type: 'text', label: localeObj?.contactForm?.name || 'Name', placeholder: localeObj?.contactForm?.placeholderName || '' },
    { name: 'email', type: 'email', label: localeObj?.contactForm?.email || 'Email', placeholder: localeObj?.contactForm?.placeholderEmail || '', required: true },
    { name: 'message', type: 'textarea', label: localeObj?.contactForm?.message || 'Message', placeholder: localeObj?.contactForm?.placeholderMessage || '', required: true }
  ]), [localeObj]);

  const usedFields = Array.isArray(fields) && fields.length > 0 ? fields : defaults;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of usedFields) init[f.name] = '';
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const f of usedFields) init[f.name] = '';
    setValues(init);
  }, [JSON.stringify(usedFields)]);

  const handleChange = (name: string, v: string) => setValues(s => ({ ...s, [name]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    for (const f of usedFields) {
      if (f.required && !values[f.name]) {
        setErrorMessage(localeObj?.contactForm?.validationError || 'Please fill required fields');
        return;
      }
    }
    setSubmitting(true);
    try {
      const action = (submitButton && submitButton.action) ? submitButton.action : '/api/contact';
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccessMessage(localeObj?.contactForm?.thanks || 'Thank you — message sent.');
        const init: Record<string, string> = {};
        for (const f of usedFields) init[f.name] = '';
        setValues(init);
      } else {
        setErrorMessage((data && data.error) ? String(data.error) : (localeObj?.contactForm?.error || 'Failed to send message'));
      }
    } catch (err: any) {
      setErrorMessage(err && err.message ? err.message : (localeObj?.contactForm?.error || 'Failed to send message'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!usedFields || usedFields.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-gray-900 dark:via-amber-950/20 dark:to-orange-950/20 rounded-3xl shadow-2xl border-2 border-amber-200/50 dark:border-amber-800/50 overflow-hidden">
        {/* Decorative header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-8 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Get In Touch</h3>
            <p className="text-white/90 text-sm">We&apos;d love to hear from you</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="p-8 space-y-6">
          {usedFields.map((f) => (
            <div key={f.name} className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-focus-within:scale-150 transition-transform duration-300"></span>
                {f.label || f.name}
                {f.required && <span className="text-orange-500 text-xs">*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={values[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:border-amber-500 dark:focus:border-amber-600 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-sm hover:shadow-md"
                  rows={6}
                  placeholder={f.placeholder || ''}
                  required={!!f.required}
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={values[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:border-amber-500 dark:focus:border-amber-600 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md"
                  placeholder={f.placeholder || ''}
                  required={!!f.required}
                />
              )}
            </div>
          ))}

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {localeObj?.contactForm?.sending || 'Sending...'}
                </>
              ) : (
                <>
                  <span>{(submitButton && submitButton.label) ? submitButton.label : (localeObj?.contactForm?.sendMessage || 'Send Message')}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
      </div>
    </form>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
