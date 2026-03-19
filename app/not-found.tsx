import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-amber-50 via-white to-green-50 p-6">
      <div className="w-full max-w-4xl rounded-3xl bg-white border border-slate-100 shadow-md p-8 sm:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-lg bg-amber-100 text-amber-700 font-bold text-xl">?</div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">We couldn't find that</h2>
            <p className="mt-2 text-slate-600">This link may be broken or the page may have been removed. Try these options instead.</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 text-center"
              >
                Back to homepage
              </Link>

              <Link
                href="/contact"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-center"
              >
                Contact support
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-56 h-56" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
