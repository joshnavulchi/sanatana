"use client";
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sanatana_welcome_dismissed';


export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(true);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    // On mount, check localStorage and hide if dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') {
      queueMicrotask(() => {
        setIsVisible(false);
        setDoNotShowAgain(true);
      });
    }
  }, []);

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-3">
      <div
        className={`
          max-w-4xl mx-auto
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Decorative top border with gradient */}
        <div className="h-1 w-full bg-linear-to-r from-transparent via-amber-300 to-transparent mb-6 rounded-full" />

        {/* Main welcome card */}
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close welcome message"
            className="cursor-pointer absolute -top-4 -right-4 z-30 w-10 h-10 bg-white/70 backdrop-blur-sm border border-amber-200 rounded-full shadow-md flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6 text-amber-700 group-hover:text-amber-900 transition-colors drop-shadow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Ornamental corners */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-amber-200/40 rounded-tl-2xl" />
          <div className="absolute -top-4 -right-4 w-16 h-16 border-r-2 border-t-2 border-amber-200/40 rounded-tr-2xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border-l-2 border-b-2 border-amber-200/40 rounded-bl-2xl" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-amber-200/40 rounded-br-2xl" />

          {/* Content container */}
          <div className="bg-white/75 backdrop-blur-sm border border-amber-100 rounded-2xl shadow-lg p-6 md:p-12 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" className="text-amber-800" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-4">
              {/* Greeting with Om symbol */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-12 bg-linear-to-r from-transparent to-amber-300" />
                <span className="text-5xl text-amber-800 animate-pulse">ॐ</span>
                <div className="h-px w-12 bg-linear-to-l from-transparent to-amber-300" />
              </div>

              {/* Welcome title */}
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-amber-800">
                Namaste & Welcome
              </h2>

              {/* Sanskrit blessing */}
              <p className="text-lg sm:text-md italic text-amber-700 tracking-wide">
                स्वागतम् । आपका स्वागत है
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce anim-delay-0" />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce anim-delay-150" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce anim-delay-300" />
              </div>

              {/* Main message */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-md leading-relaxed text-gray-700">
                  We are deeply honored and blessed by your presence here.
                </p>
                <p className="text-md leading-relaxed text-gray-700">
                  Thank you for taking this sacred step towards understanding and embracing the
                  <span className="font-semibold text-amber-700"> eternal truths of Sanātana Dharma</span>
                  — the timeless wisdom that illuminates the path to inner peace, righteousness, and spiritual awakening.
                </p>
                <p className="text-md leading-relaxed text-gray-700">
                  May your journey through these ancient teachings bring you
                  <span className="font-semibold text-amber-600"> clarity, devotion, and divine grace</span>.
                </p>
              </div>

              {/* Closing blessing */}
              <div className="pt-6 space-y-2">
                <p className="text-base text-amber-700 font-medium tracking-wide">
                  सत्यमेव जयते । धर्मो रक्षति रक्षितः
                </p>
                <p className="text-lg text-gray-600 italic">
                  Truth Alone Triumphs · Dharma Protects Those Who Protect It
                </p>
              </div>

              {/* Decorative lotus at bottom */}
              <div className="pt-6 flex justify-center">
                <svg className="w-16 h-16 text-amber-500/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 9 5 9 9C9 11.21 10.79 13 13 13C13 13 13 15 13 17C13 19.21 11.21 21 9 21C9 21 9 19 9 17C9 14.79 7.21 13 5 13C5 13 5 11 5 9C5 6.79 6.79 5 9 5C9 5 11 5 11 5C11 5 11 3 11 2H12M12 2C12 2 15 5 15 9C15 11.21 13.21 13 11 13C11 13 11 15 11 17C11 19.21 12.79 21 15 21C15 21 15 19 15 17C15 14.79 16.79 13 19 13C19 13 19 11 19 9C19 6.79 17.21 5 15 5C15 5 13 5 13 5C13 5 13 3 13 2H12Z" />
                </svg>
              </div>

              {/* Do not show again checkbox and close button */}
              <div className="pt-6 border-t border-amber-200/30 mt-6 flex flex-col items-center gap-4">
                <label className="flex items-center justify-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={doNotShowAgain}
                    onChange={(e) => setDoNotShowAgain(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-amber-300 text-amber-700 focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 cursor-pointer transition-all"
                  />
                  <span className="text-sm md:text-base text-gray-700 group-hover:text-amber-700 transition-colors">
                    Do not show this welcome message again
                  </span>
                </label>
                <button
                  onClick={handleClose}
                  className="cursor-pointer px-6 py-2 rounded-full bg-amber-600 text-white font-semibold border border-amber-600 shadow-md transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-amber-200/50 active:scale-95 mt-2"
                >
                  <span className="relative z-10 tracking-widest text-base select-none">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom border with gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-8 rounded-full" />
      </div>
    </div>
  );
}