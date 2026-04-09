import Link from "next/link";
import { createGenerateMetadata } from '@lib/pageUtils';

export const metadata = {
  title: 'Page Not Found | Sanātana Dharma',
  description: 'The page you are looking for does not exist. Return to the home page of Sanātana Dharma.',
  alternates: {
    canonical: 'https://sanatanadharmam.in/404',
  },
};

export default function Custom404() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 md:px-6 bg-gradient-to-br from-rose-100 via-amber-50 to-pink-200 animate-gradient-x">
      <div className="max-w-5xl w-full rounded-xl bg-white shadow-xl p-4 sm:p-8 text-lg sm:text-base leading-relaxed font-normal">
        <div className="flex flex-col md:flex-row items-center gap-4 text-lg sm:text-base leading-relaxed font-normal">
          <div className="flex-shrink-0 text-rose-600 text-lg sm:text-base leading-relaxed font-normal">404</div>
          <div>
            <h2 className="text-slate-900 text-2xl font-semibold leading-snug mb-3">Page not found</h2>
            <p className="text-slate-600 text-lg sm:text-base leading-relaxed mb-4 font-normal">The page you're looking for doesn't exist or has been moved.</p>

            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-base leading-relaxed font-normal">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-lg sm:text-base font-medium text-white hover:bg-rose-700"
              >
                Go home
              </Link>

              <Link
                href="/"
                className="text-lg sm:text-base text-slate-600 underline-offset-2 hover:underline"
              >
                Visit homepage
              </Link>
            </div>
          </div>

          <div className="hidden md:block ml-auto text-lg sm:text-base leading-relaxed font-normal">
            <svg width="140" height="140" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="8" y="8" width="144" height="144" rx="20" fill="#FFF1F2" />
              <circle cx="80" cy="60" r="28" fill="#FDECEA" />
              <path d="M40 120c20-22 60-22 80 0" stroke="#FFD1D6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}

export const generateMetadata = {
  title: '404 — Page not found',
  description: "The requested page couldn't be found.",
};

