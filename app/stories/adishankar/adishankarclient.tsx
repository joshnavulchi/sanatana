"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';

export default function AdvishankarClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_adhishankaracharya');

  const title = ns?.title || 'stories_adhishankaracharya';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for AdiShankaracharya';

  return (
    <PageLayout
      metaKey="stories_adhishankaracharya"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className="layout-sm"
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}