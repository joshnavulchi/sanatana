/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useLocaleSection from '@app/hooks/useLocaleSection';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const locale = useLocaleSection('sharable_strings');

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // 🔑 AUTO scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 bottom-8 right-8 p-2 rounded-full shadow-2xl bg-gradient-to-br from-pink-500 via-amber-400 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white tracking-widest border-4 border-white focus:outline-none focus:ring-4 focus:ring-pink-300 flex items-center justify-center animate-bounce animate-fadeInUp transition-all duration-300"
          aria-label={locale?.scrolltotop?.arialabel || 'Scroll to top'}
          title={locale?.scrolltotop?.title || 'Scroll to top'}
        >
          {/* Up Arrow SVG */}
          <svg
            className="w-7 h-7 animate-pulse"
            fill="none"
            stroke="#ffffff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
