import Link from "next/link";

export default function HeritageFooter() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 border-t border-orange-200">
      {/* Mandala Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="absolute top-5 right-5 w-[50px] h-[50px] rounded-full border-6 border-orange-300 opacity-20 animate-ping"></div>
        <div className="absolute top-8 right-8 w-[25px] h-[25px] rounded-full border-4 border-amber-400 opacity-20 animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Decorative Top Line */}
        <div className="flex justify-center mb-8">
          <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></div>
        </div>
        <h6 className="text-3xl font-semibold text-orange-900 tracking-wide">
          Preserving Our Vedic Civilizational Legacy
        </h6>
        <p className="mt-8 text-lg md:text-md text-amber-900 leading-relaxed">
          For many, religion is not merely a belief system but a sacred inheritance passed down through generations.
          Rooted in profound spiritual and philosophical foundations, our tradition has guided humanity for millennia through knowledge, discipline, and dharmic living.
        </p>
        <p className="mt-6 text-lg md:text-md text-amber-900 leading-relaxed">
          Changing one’s religious identity does not alter one’s ancestry or inherited cultural roots.
          Destiny is shaped by actions and character rather than affiliation alone.
        </p>
        <p className="mt-6 text-lg md:text-md font-semibold text-orange-800">
          We remain committed to protecting and transmitting this ancient civilizational legacy for future generations. <Link href="/sanatanadharma" className="underline">Learn more about our mission.</Link>
        </p>
      </div>
      <ul className="mx-auto max-w-7xl text-lg md:text-md hidden">
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>Why so curiosity in others life?</span>
        </li>
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>What will you get to spending hours in youtube, instagram, facebook, whatsapp? Stop them.</span>
        </li>
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>You need entertainment means real people play games.</span>
        </li>
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>You need relax means spend time with family or nearest friends.</span>
        </li>
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>You want to be meaning full to your life. A lot of things there to read from our own roots. Like <Link href="/scriptures/ramayana" title="Ramayana">Ramayana</Link>, <Link href="/scriptures/mahabharata" title="Mahabharata">Mahabharata</Link>, <Link href="/scriptures/bhagavadgita" title="Bhagavad Gita">Bhagavad Gita</Link>, <Link href="/scriptures/vedas" title="Vedas">Vedas</Link>, <Link href="/scriptures/upanishads" title="Upanishads">Upanishads</Link>, <Link href="/scriptures/puranas" title="Puranas">Puranas</Link>, etc.</span>
        </li>
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>You did not come for time pass or entertain some peoples. You came to help peoples in a simple ways.</span>
        </li>
        <li className="flex text-lg md:text-md text-amber-900 mb-2!">
          <div className="min-w-10">
            <svg className="relative top-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform " fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span>You did not come for work, earn money, get famous, not a machine. You came with some responsibilities which was ignored in your past births. <Link href="/philosophy/karma" title="karma">read this...</Link></span>
        </li>
      </ul>
    </section>
  );
}
