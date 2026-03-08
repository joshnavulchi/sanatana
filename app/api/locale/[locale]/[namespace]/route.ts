import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SUPPORTED_LOCALES } from '@lib/i18n';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string; namespace: string }> }
) {
  const { locale, namespace } = await params;

  // Validate locale to prevent directory traversal
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
  }

  // Sanitize namespace — only allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(namespace)) {
    return NextResponse.json({ error: 'Invalid namespace' }, { status: 400 });
  }

  // Try various file naming patterns
  const candidates = [
    namespace,
    namespace.replace(/-/g, '_'),
    namespace.replace(/_/g, '-'),
    namespace.split('_').reverse().join('_'),
    namespace.split('-').reverse().join('-'),
  ];

  for (const candidate of candidates) {
    const filePath = path.join(process.cwd(), 'data', locale, `${candidate}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      });
    }
  }

  return NextResponse.json({ error: 'Namespace not found' }, { status: 404 });
}
