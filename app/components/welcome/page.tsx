"use client";
import { useEffect, useState } from 'react';

export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div 
        className={`
          max-w-4xl mx-auto
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Decorative top border with gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-8 rounded-full" />
        
        {/* Main welcome card */}
        <div className="relative">
          {/* Ornamental corners */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-amber-400/30 rounded-tl-2xl" />
          <div className="absolute -top-4 -right-4 w-16 h-16 border-r-2 border-t-2 border-amber-400/30 rounded-tr-2xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border-l-2 border-b-2 border-amber-400/30 rounded-bl-2xl" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-amber-400/30 rounded-br-2xl" />
          
          {/* Content container */}
          <div className="
            bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/80
            backdrop-blur-sm
            border border-amber-200/50
            rounded-2xl
            shadow-2xl shadow-amber-500/10
            p-8 md:p-12
            relative
            overflow-hidden
          ">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" className="text-amber-600" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-6">
              {/* Greeting with Om symbol */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-5xl font-serif text-amber-600 animate-pulse">ॐ</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              {/* Welcome title */}
              <h2 className="
                text-4xl md:text-5xl lg:text-6xl
                font-bold
                bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700
                bg-clip-text text-transparent
                tracking-tight
                leading-tight
              ">
                Namaste & Welcome
              </h2>

              {/* Sanskrit blessing */}
              <p className="
                text-xl md:text-2xl
                font-serif italic
                text-amber-800/80
                tracking-wide
              ">
                स्वागतम् । आपका स्वागत है
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>

              {/* Main message */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  We are deeply honored and blessed by your presence here.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Thank you for taking this sacred step towards understanding and embracing the 
                  <span className="font-semibold text-amber-700"> eternal truths of Sanātana Dharma</span>
                  — the timeless wisdom that illuminates the path to inner peace, righteousness, and spiritual awakening.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  May your journey through these ancient teachings bring you 
                  <span className="font-semibold text-orange-600"> clarity, devotion, and divine grace</span>.
                </p>
              </div>

              {/* Closing blessing */}
              <div className="pt-6 space-y-2">
                <p className="text-sm md:text-base text-amber-700 font-medium tracking-wide">
                  सत्यमेव जयते । धर्मो रक्षति रक्षितः
                </p>
                <p className="text-xs md:text-sm text-gray-500 italic">
                  Truth Alone Triumphs · Dharma Protects Those Who Protect It
                </p>
              </div>

              {/* Decorative lotus at bottom */}
              <div className="pt-8 flex justify-center">
                <svg className="w-16 h-16 text-amber-500/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 9 5 9 9C9 11.21 10.79 13 13 13C13 13 13 15 13 17C13 19.21 11.21 21 9 21C9 21 9 19 9 17C9 14.79 7.21 13 5 13C5 13 5 11 5 9C5 6.79 6.79 5 9 5C9 5 11 5 11 5C11 5 11 3 11 2H12M12 2C12 2 15 5 15 9C15 11.21 13.21 13 11 13C11 13 11 15 11 17C11 19.21 12.79 21 15 21C15 21 15 19 15 17C15 14.79 16.79 13 19 13C19 13 19 11 19 9C19 6.79 17.21 5 15 5C15 5 13 5 13 5C13 5 13 3 13 2H12Z" />
                </svg>
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