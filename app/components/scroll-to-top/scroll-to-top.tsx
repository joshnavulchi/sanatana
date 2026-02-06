/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useLocaleSection from '../../hooks/useLocaleSection';

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
          className="fixed z-40 bottom-8 right-8 p-1 rounded-4xl shadow-md no-underline transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg rounded-full tracking-widest border-2 border-white dark:border-gray-800 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all duration-300 flex cursor-pointer"
          aria-label={locale?.scrolltotop?.arialabel || 'Scroll to top'}
          title={locale?.scrolltotop?.title || 'Scroll to top'}
        >
          {/* Up Arrow SVG */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="#ffffff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
