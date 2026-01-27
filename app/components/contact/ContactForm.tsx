/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useT } from '../../hooks/useT';

import styles from './contactform.module.scss';

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
  const t = useT();
  const defaults: Field[] = useMemo(() => ([
    { name: 'name', type: 'text', label: t('contactForm.name') || 'Name', placeholder: t('contactForm.placeholderName') || '' },
    { name: 'email', type: 'email', label: t('contactForm.email') || 'Email', placeholder: t('contactForm.placeholderEmail') || '', required: true },
    { name: 'message', type: 'textarea', label: t('contactForm.message') || 'Message', placeholder: t('contactForm.placeholderMessage') || '', required: true }
  ]), [t]);

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
  }, [usedFields]);

  const handleChange = (name: string, v: string) => setValues(s => ({ ...s, [name]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    for (const f of usedFields) {
      if (f.required && !values[f.name]) {
        setErrorMessage(t('contactForm.validationError') || 'Please fill required fields');
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
        setSuccessMessage(t('contactForm.thanks') || 'Thank you — message sent.');
        const init: Record<string, string> = {};
        for (const f of usedFields) init[f.name] = '';
        setValues(init);
      } else {
        setErrorMessage((data && data.error) ? String(data.error) : (t('contactForm.error') || 'Failed to send message'));
      }
    } catch (err: unknown) {
      setErrorMessage(err && typeof err === 'object' && 'message' in err ? String(err.message) : (t('contactForm.error') || 'Failed to send message'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!usedFields || usedFields.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className={`${styles.contactform}`}>
      {usedFields.map((f) => (
        <div key={f.name} className="mb-4">
          <label className="block font-medium mb-1">{f.label || f.name}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={values[f.name] || ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="border border-b-2 w-full"
              rows={6}
              placeholder={f.placeholder || ''}
            />
          ) : (
            <input
              type={f.type || 'text'}
              value={values[f.name] || ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="border border-b-2 w-full"
              placeholder={f.placeholder || ''}
              required={!!f.required}
            />
          )}
        </div>
      ))}

      {successMessage ? <div className="text-green-600 mb-3">{successMessage}</div> : null}
      {errorMessage ? <div className="text-red-600 mb-3">{errorMessage}</div> : null}
      <div>
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? (t('contactForm.sending') || 'Sending...') : ((submitButton && submitButton.label) ? submitButton.label : (t('contactForm.sendMessage') || 'Send Message'))}
        </button>
      </div>
    </form>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
