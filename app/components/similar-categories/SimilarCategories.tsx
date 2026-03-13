import Link from 'next/link';

type SimilarCategoriesProps = {
  title?: string;
  maxItems?: number;
  excludeCurrent?: boolean;
};

export default function SimilarCategories({ title = 'Explore', maxItems = 8 }: SimilarCategoriesProps) {
  const links = [
    { href: '/vedas', label: 'Vedas' },
    { href: '/upanishads', label: 'Upanishads' },
    { href: '/puranas', label: 'Puranas' },
    { href: '/itihasa', label: 'Itihasa' },
    { href: '/philosophy', label: 'Philosophy' },
    { href: '/vedic-philosophy', label: 'Vedic Philosophy' },
    { href: '/sanatanadharma', label: 'Sanatana Dharma' },
    { href: '/festivals', label: 'Festivals' },
  ].slice(0, maxItems);

  return (
    <section className="rounded-xl border border-amber-200 bg-white p-4">
      <h3 className="font-semibold text-[#7a2e1f] mb-3">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm text-[#5b2d12] hover:text-[#9a3412]">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
