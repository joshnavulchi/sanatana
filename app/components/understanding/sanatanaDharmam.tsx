"use client";
import { useEffect, useState } from 'react';
import { loadLocaleNamespace } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import LazyImage from '../lazy-image/LazyImage';

export default function UnderstandingOfSanatana() {
  const { locale } = useLocale();

  const [sections, setSections] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load the `home` namespace once for this locale and update state.
    setIsVisible(true);
    let cancelled = false;
    loadLocaleNamespace(locale, 'home').then((ns: any) => {
      if (cancelled) return;
      if (ns && Array.isArray(ns.sections)) {
        setSections(ns.sections);
      } else if (ns && ns.home && Array.isArray(ns.home.sections)) {
        setSections(ns.home.sections);
      }
    }).catch(() => { });
    return () => { cancelled = true; };
  }, [locale]);

  return (
    <div className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-amber-950/20 dark:to-gray-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="content-wrapper relative z-10">
        {sections.map((section: any, sectionIndex: number) => {
          return (
            <div 
              key={section.id} 
              className={`
                mb-20 last:mb-0
                transition-all duration-1000 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
              style={{ transitionDelay: `${sectionIndex * 150}ms` }}
            >
              {/* Section Header */}
              <div className="mx-auto max-w-5xl text-center mb-12 md:mb-16 space-y-6">
                {/* Decorative top accent */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
                  <span className="text-2xl text-amber-500 dark:text-amber-400">✦</span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
                </div>

                <h3 className={`
                  text-3xl md:text-4xl lg:text-5xl 
                  font-bold 
                  bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 
                  dark:from-amber-400 dark:via-orange-300 dark:to-amber-400
                  bg-clip-text text-transparent
                  leading-tight
                  ${!section?.nodecaration ? 'pb-4 mb-6 relative after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-transparent after:via-amber-500 after:to-transparent after:rounded-full' : ''}
                `}>
                  {section.title}
                </h3>
                
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  {section.content}
                </p>
                
                {section?.src && (
                  <div className="flex justify-center pt-4">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
                      <LazyImage 
                        src={section.src} 
                        alt={section.title} 
                        width={320} 
                        height={320} 
                        className="relative object-cover rounded-xl shadow-xl transform group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cards Grid */}
              <div className={`mx-auto ${section?.items?.length === 4 ? 'max-w-7xl' : 'max-w-7xl'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8`}>
                {section?.items && section?.items.map((topic: any, itemIndex: number) => (
                  <div 
                    key={itemIndex} 
                    className="
                      group relative
                      bg-white dark:bg-gray-800
                      rounded-2xl 
                      shadow-lg hover:shadow-2xl
                      border border-amber-100 dark:border-amber-900/30
                      hover:border-amber-300 dark:hover:border-amber-700
                      p-6 md:p-8
                      transition-all duration-500
                      transform hover:-translate-y-2
                      overflow-hidden
                    "
                  >
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="relative text-center space-y-4">
                      {/* Icon/Image */}
                      {topic.src && (
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                            <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 p-4 rounded-full transform group-hover:rotate-12 transition-transform duration-500">
                              <LazyImage 
                                src={topic.src} 
                                alt={topic.title} 
                                width={76} 
                                height={76} 
                                className="object-cover" 
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                        {topic.title}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed min-h-[60px]">
                        {topic.description}
                      </p>
                      
                      {/* Read More Link */}
                      <Link 
                        href={topic.href} 
                        title={topic.title} 
                        className="
                          inline-flex items-center gap-2
                          text-amber-600 dark:text-amber-400 
                          hover:text-orange-600 dark:hover:text-orange-400
                          font-semibold text-sm
                          no-underline
                          group/link
                          transition-colors duration-300
                        "
                      >
                        Read more
                        <svg 
                          className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}

                {/* Points Cards */}
                {section?.points && section?.points.map((point: any, pointIndex: number) => (
                  <div 
                    key={pointIndex} 
                    className="
                      group relative
                      bg-gradient-to-br from-white to-amber-50/50 
                      dark:from-gray-800 dark:to-amber-950/30
                      rounded-2xl 
                      shadow-lg hover:shadow-2xl
                      border-2 border-amber-200/50 dark:border-amber-800/50
                      hover:border-amber-400 dark:hover:border-amber-600
                      p-6 md:p-8
                      transition-all duration-500
                      transform hover:-translate-y-2 hover:scale-105
                      overflow-hidden
                    "
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="relative text-center space-y-4">
                      {/* Icon/Image */}
                      {section?.pointSrc && section?.pointSrc[pointIndex] && (
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative bg-white dark:bg-gray-900 p-3 rounded-full shadow-md transform group-hover:rotate-6 transition-transform duration-500">
                              <LazyImage 
                                src={section?.pointSrc[pointIndex]} 
                                width={76} 
                                height={76} 
                                alt={point} 
                                className="object-cover" 
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Point Text */}
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                        {point}
                      </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-amber-300/30 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-orange-300/30 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}