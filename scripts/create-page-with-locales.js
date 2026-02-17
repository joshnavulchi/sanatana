#!/usr/bin/env node
/**
 * Script to scaffold a new Next.js page with locale rendering logic and default PageLayout usage.
 * Usage: node create-page-with-locales.js
 * After running, you will be prompted to provide the path to your JSON locale file.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function main() {
  const pageName = await ask('Enter the new page name (e.g., mypage): ');
  const pageDir = path.join('app', pageName);
  const pageFile = path.join(pageDir, 'page.tsx');

  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

  const pageContent = `"use client";
import React from 'react';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '@/app/hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

function renderData(data: any, keyPrefix = ''): React.ReactNode {
  if (Array.isArray(data)) {
    return (
      <ul>
        {data.map((item, idx) => (
          <li key={keyPrefix + idx}>{renderData(item, keyPrefix + idx + '-')}</li>
        ))}
      </ul>
    );
  } else if (data && typeof data === 'object') {
    return (
      <div style={{ marginLeft: 16 }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={keyPrefix + key} style={{ marginBottom: 8 }}>
            <strong>{key}:</strong> {typeof value === 'object' ? renderData(value, keyPrefix + key + '-') : String(value)}
          </div>
        ))}
      </div>
    );
  } else {
    return <span>{String(data)}</span>;
  }
}

export default function ${capitalize(pageName)}Page() {
  const { locale } = useLocale();
  const data = useLocaleSection('${pageName}');

  if (!data || !data.title) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <PageLayout
      metaKey="${pageName}"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: '${capitalize(pageName)}' }]}
      className="layout-md"
    >
      <div className="max-w-2xl mx-auto py-8">
        <h3 className="text-3xl font-bold mb-4">{data.title}</h3>
        <div className="prose prose-lg">
          {renderData(data)}
        </div>
      </div>
    </PageLayout>
  );
}

`; // <-- CLOSE the template literal here

  // Write the generated page file and prompt for JSON path
  fs.writeFileSync(pageFile, pageContent, 'utf8');
  console.log(`Page created at ${pageFile}`);
  rl.question('Please provide the path to your JSON locale file: ', (jsonPath) => {
    console.log(`You entered: ${jsonPath}`);
    rl.close();
  });
}

main();