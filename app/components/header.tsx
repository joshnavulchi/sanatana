/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';
import LanguageDropdown from './language-dropdown/language-dropdown';

export default async function Header() {
  const nav = [
    { href: '/', label: 'Home' },
    { href: '/vedas', label: 'Vedas' },
    { href: '/upanishads', label: 'Upanishads' },
    { href: '/puranas', label: 'Puranas' },
    { href: '/itihasa', label: 'Itihasa' },
    { href: '/philosophy', label: 'Philosophy' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200 bg-white/95 backdrop-blur">
      <div className="content-wrapper px-3 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-[#7a2e1f]">Sanātana Dharma</Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-[#5b2d12] hover:text-[#9a3412]">
              {item.label}
            </Link>
          ))}
        </nav>
        <LanguageDropdown pathname="/" />
      </div>
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
