import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../itihasapartclient';
import {
  isMahabharataParvaSlug,
  MAHABHARATA_PARVAS,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../itihasa-utils';

type Params = { parva: string };

export function generateStaticParams() {
  return MAHABHARATA_PARVAS.map((parva) => ({ parva }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { parva } = await props.params;
  const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { parva } = await props.params;
  if (!isMahabharataParvaSlug(parva)) notFound();

  return (
    <ItihasaPartClient
      namespace={`itihasa_mahabharata_${toUnderscoreSlug(parva)}`}
      titleFallback={toTitleFromSlug(parva)}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Itihasa', href: '/itihasa' },
        { label: 'Mahabharata', href: '/itihasa/mahabharata' },
        { label: toTitleFromSlug(parva) },
      ]}
      nextHref={`/itihasa/mahabharata/${parva}/chapter-1`}
      nextLabel="Open Chapter 1"
    />
  );
}
