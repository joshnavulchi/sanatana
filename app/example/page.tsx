import React from 'react';
import Container from '@components/common/Container';
import Section from '@components/common/Section';
import Card from '@components/common/Card';
import Link from 'next/link';

const sampleItems = Array.from({ length: 6 }).map((_, i) => ({
  id: `item-${i + 1}`,
  title: `Sample Item ${i + 1}`,
  excerpt: 'This is a short description to demonstrate the listing card layout and spacing.'
}));

export default function Page() {
  return (
    <Container>
      <Section>
        <header className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Listing — Examples</h1>
          <p className="text-base sm:text-lg text-gray-600">A modern, consistent listing layout using the design system.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleItems.map((it) => (
            <Card key={it.id}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{it.title}</h3>
              <p className="text-gray-700 leading-relaxed mt-2">{it.excerpt}</p>
              <div className="mt-4">
                <Link href={`/example/${it.id}`} className="inline-block bg-teal-600 text-white rounded-xl px-4 py-2 hover:bg-teal-700">View</Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </Container>
  );
}
