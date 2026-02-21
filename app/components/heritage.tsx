import Link from "next/link";

export default function HeritageFooter() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 border-t border-orange-200">
      {/* Mandala Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="absolute top-5 right-5 w-[50px] h-[50px] rounded-full border-6 border-orange-300 opacity-20 animate-ping"></div>
        <div className="absolute top-8 right-8 w-[25px] h-[25px] rounded-full border-4 border-amber-400 opacity-20 animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto pt-20 text-center">
        {/* Decorative emblem and heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="h-1 w-28 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
          </div>

          <h6 className="text-3xl md:text-4xl font-semibold text-orange-900 tracking-wide">
            Preserving Our Vedic Civilizational Legacy
          </h6>

          <div className="mt-6 max-w-3xl grid gap-4 text-lg text-amber-900 leading-relaxed md:grid-cols-2 md:text-left text-center">
            <p>
              Our heritage contains enduring philosophy, arts, and ethical frameworks that support purposeful living across generations.
            </p>
            <p>
              Identity may evolve, but ancestral knowledge remains vital. We are dedicated to safeguarding and sharing these traditions. <Link href="/sanatanadharma" className="underline">Learn more</Link>.
            </p>
          </div>
        </div>
      </div>
      <ul className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 px-3 pt-6 pb-20">
        <li className="flex items-start gap-3 bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
          <svg className="flex-shrink-0 w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-amber-900">Respect and preserve cultural and ancestral traditions.</span>
        </li>
        <li className="flex items-start gap-3 bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
          <svg className="flex-shrink-0 w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-amber-900">Choose mindful media use; prioritize meaningful activities.</span>
        </li>
        <li className="flex items-start gap-3 bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
          <svg className="flex-shrink-0 w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-amber-900">Foster real-world connections through community and shared activities.</span>
        </li>
        <li className="flex items-start gap-3 bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
          <svg className="flex-shrink-0 w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-amber-900">Reserve quality time with family and close friends to restore balance.</span>
        </li>
        <li className="flex items-start gap-3 bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
          <svg className="flex-shrink-0 w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-amber-900">Explore foundational texts: <Link href="/scriptures/ramayana">Ramayana</Link>, <Link href="/scriptures/mahabharata">Mahabharata</Link>, <Link href="/scriptures/bhagavadgita">Bhagavad Gita</Link>, <Link href="/scriptures/vedas">Vedas</Link>, <Link href="/scriptures/upanishads">Upanishads</Link>, <Link href="/scriptures/puranas">Puranas</Link>.</span>
        </li>
        <li className="flex items-start gap-3 bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
          <svg className="flex-shrink-0 w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-amber-900">Act with purpose and responsibility; contribute in simple, meaningful ways. <Link href="/philosophy/karma">Learn more</Link>.</span>
        </li>
      </ul>
    </section>
  );
}
