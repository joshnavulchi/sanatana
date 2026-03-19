/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SlugClient from './slugclient';

const VALID_SLUGS = [
  'isha-upanishad', 'kena-upanishad', 'katha-upanishad', 'prashna-upanishad',
  'mundaka-upanishad', 'mandukya-upanishad', 'taittiriya-upanishad', 'aitareya-upanishad',
  'chandogya-upanishad', 'brihadaranyaka-upanishad', 'shvetashvatara-upanishad',
  'kaushitaki-upanishad', 'maitri-upanishad',
];

export const dynamicParams = false;

export async function generateStaticParams() {
  // Solution: strict static export
  // Replace with source and locale check if available
  // Example: getAllStories() and filter localeExists
  // For now, use VALID_SLUGS as static
  return VALID_SLUGS
    .filter((slug) => !!slug)
    .map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`upanishads_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return (
    <>
      <StructuredData metaKey={`upanishads_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
