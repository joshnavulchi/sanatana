import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-rose-100 via-amber-50 to-pink-200 animate-gradient-x">
      <div className="w-full max-w-4xl rounded-3xl bg-white/90 shadow-2xl p-4 sm:p-12 text-lg sm:text-base leading-relaxed font-normal border-4 border-amber-100 backdrop-blur-xl animate-fadeInUp">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-lg sm:text-base leading-relaxed font-normal">
          <div>
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-200 via-pink-200 to-rose-200 shadow-lg text-3xl font-bold text-amber-700 animate-bounce">?</div>

            <h2 className="text-rose-900 text-3xl font-extrabold leading-snug mb-3 drop-shadow-lg animate-fadeIn">We couldn't find that</h2>
            <p className="text-rose-600 text-lg sm:text-base leading-relaxed mb-4 font-normal animate-fadeIn delay-100">This link may be broken or the page may have been removed. Try these options instead.</p>

            <div className="flex flex-col sm:flex-row gap-3 text-lg sm:text-base leading-relaxed font-normal">
              <Link
                href="/"
                className="rounded-full bg-gradient-to-r from-amber-500 via-pink-400 to-rose-400 px-6 py-3 text-lg sm:text-base font-semibold text-white shadow-lg hover:from-amber-600 hover:to-rose-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-200 animate-pulse text-center"
              >
                Back to homepage
              </Link>

              <Link
                href="/contact"
                className="rounded-full px-6 py-3 text-lg sm:text-base font-semibold text-rose-700 bg-white/80 shadow hover:bg-rose-50 transition-all duration-300 text-center border border-rose-200 animate-fadeIn delay-200"
              >
                Contact support
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center text-lg sm:text-base leading-relaxed font-normal animate-fadeInUp delay-200">
            <svg viewBox="0 0 200 200" className="w-56 h-56 drop-shadow-2xl animate-spin-slow" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="100%" stopColor="#FEF3C7" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="180" height="180" rx="24" fill="url(#g1)" />
              <path d="M50 140c18-24 82-24 100 0" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
              <circle cx="70" cy="70" r="18" fill="#FDE68A" />
              <circle cx="130" cy="70" r="12" fill="#FDE68A" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}

export const generateMetadata = {
  title: 'Not Found',
  description: "We couldn't find that page.",
};
