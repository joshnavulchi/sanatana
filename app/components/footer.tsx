/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-200 bg-[#fffaf3]">
      <div className="content-wrapper px-3 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold text-[#7a2e1f] mb-2">Sanātana Dharma</h3>
            <p className="text-sm text-[#5b2d12]">Timeless teachings, scriptures, and philosophy.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/donate">Donate</Link>
            <Link href="/our-cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
