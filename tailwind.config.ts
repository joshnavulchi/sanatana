
import type { Config } from 'tailwindcss';

interface ExtendedConfig extends Config {
  safelist?: string[];
}

const config: ExtendedConfig = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Add any dynamic or conditional class names here to prevent purging
  safelist: [
    // Transitions
    'transform',
    'transition-transform',
    'hover:scale-105',
    'hover:scale-95',
    'duration-300',
    'ease-in-out',

    // Animations
    'animate-fade-in',
    'animate-fade-out',
    'animate-slide-up',
    'animate-slide-down',

    // Dynamically used classes (added for purge safety)
    'fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black/40', 'rounded-md', 'bg-black/60', 'backdrop-blur-sm', 'py-12', 'space-y-12', 'relative', 'md:-mx-8', 'px-6', 'md:px-8', 'bg-gradient-to-br', 'from-blue-50', 'via-indigo-50', 'to-blue-50', 'dark:from-blue-950/30', 'dark:via-indigo-950/30', 'dark:to-blue-950/30', 'rounded-2xl', 'overflow-hidden', 'absolute', 'top-0', 'right-0', 'w-64', 'h-64', 'bg-blue-400/10', 'rounded-full', 'blur-3xl', 'bottom-0', 'left-0', 'w-80', 'h-80', 'bg-indigo-400/10', 'z-10', 'gap-3', 'mb-6', 'h-px', 'w-12', 'bg-gradient-to-r', 'from-transparent', 'to-blue-500', 'text-3xl', 'animate-pulse', 'bg-gradient-to-l', 'text-lg', 'md:text-xl', 'text-gray-700', 'dark:text-gray-300', 'leading-relaxed', 'mb-4', 'text-base', 'md:text-lg', 'text-gray-600', 'dark:text-gray-400', 'space-y-6', 'h-12', 'from-blue-100', 'to-indigo-100', 'dark:from-blue-900/50', 'dark:to-indigo-900/50', 'rounded-xl', 'text-2xl', 'shadow-md', 'md:text-3xl', 'font-bold', 'text-gray-900', 'dark:text-white', 'pl-15', 'flex-wrap', 'gap-6', 'bg-white', 'dark:bg-gray-800', 'border-2', 'border-blue-100', 'dark:border-blue-900/30', 'hover:border-blue-300', 'dark:hover:border-blue-700', 'p-6', 'shadow-lg', 'hover:shadow-xl', 'transition-all', 'duration-300', 'transform', 'hover:-translate-y-1', 'mb-3', 'gap-2', 'text-xl', 'text-sm', 'to-indigo-50', 'dark:to-indigo-950/30', 'border-l-4', 'border-blue-500', 'rounded-lg', 'items-start', 'flex-1', 'font-semibold', 'md:p-8', 'gap-4', 'from-gray-50', 'to-gray-100', 'dark:from-gray-700', 'dark:to-gray-800', 'px-4', 'py-3', 'border-gray-200', 'dark:border-gray-600', 'shadow-sm', 'hover:shadow-md', 'w-8', 'h-6', 'inline-block', 'border-white', 'dark:border-gray-900', 'font-medium', 'justify-between', 'hidden', 'md:block', 'left-8', 'w-0', 'bg-gradient-to-b', 'from-blue-400', 'via-indigo-500', 'to-blue-400', 'left-6', 'top-6', 'w-6', 'from-blue-500', 'to-indigo-600', 'border-4', 'md:ml-20', 'group', 'group-hover:text-blue-600', 'dark:group-hover:text-blue-400', 'transition-colors', 'flex-shrink-0', 'px-3', 'py-1', 'text-blue-700', 'dark:text-blue-300', 'italic', 'mb-2', 'space-y-2', 'text-blue-500', 'mt-1', 'pt-4', 'border-t', 'dark:border-gray-700', 'text-indigo-500', 'inline-flex', 'cursor-pointer', 'group/checkbox', 'w-5', 'h-5', 'text-blue-600', 'border-gray-300', 'rounded', 'focus:ring-blue-500', 'group-hover/checkbox:text-blue-600', 'dark:group-hover/checkbox:text-blue-400', 'space-y-8', 'pb-6', 'border-b-2', 'border-amber-200', 'dark:border-amber-800', 'from-amber-50', 'to-orange-50', 'dark:from-amber-950/30', 'dark:to-orange-950/30', 'border-amber-100', 'dark:border-amber-900/30', 'md:text-2xl', 'space-y-3', 'w-2', 'h-2', 'mt-2', 'from-amber-500', 'to-orange-500', 'border-amber-500', 'text-amber-800', 'dark:text-amber-200', 'hover:text-orange-700', 'dark:hover:text-orange-200', 'underline', 'mt-6', 'border-amber-300', 'dark:border-amber-700', 'h4', 'list-disc', 'md', 'sankshepa-slokas', 'text-center', 'mt-10', 'from-amber-600', 'via-orange-500', 'to-amber-600', 'bg-clip-text', 'text-transparent', 'dark:bg-gradient-to-r', 'dark:from-amber-300', 'dark:via-yellow-400', 'dark:to-orange-300', 'dark:text-amber-100', 'font-light', 'text-left', 'bg-white/20', 'scale-x-0', 'group-hover:scale-x-100', 'transition-transform', 'origin-left', 'duration-500', 'group-hover:translate-x-1', 'page-space-xl', 'mb-16', 'md:py-16', 'via-orange-50', 'to-amber-50', 'dark:via-orange-950/30', 'dark:to-amber-950/30', 'bg-amber-400/10', 'bg-orange-400/10', 'w-16', 'to-amber-500', 'text-4xl', 'md:text-4xl', 'lg:text-5xl', 'from-amber-700', 'via-orange-600', 'to-amber-700', 'dark:from-amber-400', 'dark:via-orange-300', 'dark:to-amber-400', 'max-w-3xl', 'mx-auto', 'pt-2', 'bg-amber-500', 'bg-orange-500', 'grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-4', 'gap-8', 'hover:shadow-2xl', 'hover:border-amber-300', 'dark:hover:border-amber-700', 'hover:-translate-y-2', 'no-underline', 'flex-col', 'h-full', 'top-4', 'left-4', 'z-20', 'to-orange-600', 'text-white', 'group-hover:scale-110', 'group-hover:rotate-12', 'w-full', 'h-56', 'bg-gradient-to-t', 'from-black/60', 'via-black/20', 'to-transparent', 'duration-700', 'via-white/20', 'translate-x-', '-100', 'group-hover:translate-x-', '100', 'duration-1000', 'w-24', 'h-24', 'bg-gradient-to-bl', 'from-amber-100/50', 'dark:from-amber-900/20', 'rounded-bl-full', 'line-clamp-2', 'group-hover:text-amber-800', 'dark:group-hover:text-amber-200', 'md:text-base', 'line-clamp-3', 'group-hover:gap-3', 'w-4', 'h-4', 'h-1', 'from-amber-400', 'to-yellow-300', 'dark:from-amber-700', 'dark:via-yellow-600', 'dark:to-orange-400', 'px-5', 'hover:bg-orange-100', 'focus:bg-orange-200', 'focus:text-orange-800', 'dark:hover:bg-amber-900', 'dark:hover:text-yellow-300', 'dark:focus:bg-amber-800', 'dark:focus:text-yellow-200', 'hover:bg-amber-100', 'focus:ring-amber-400', 'bg-white/95', 'border-orange-300', 'pl-2', 'bg-amber-50', 'px-7', 'map-wrapper', 'min-h-screen', 'z-0', 'py-28', 'md:py-0', 'top-1/4', 'bottom-1/3', 'left-1/3', 'dark:bg-black/20', 'backdrop-blur-xl', 'from-amber-500/10', 'to-orange-500/10', 'right-6', 'opacity-10', 'group-hover:opacity-20', 'sm:flex-row', 'group/btn', 'hover:bg-white', 'to-orange-400/20', 'group-hover/btn:scale-x-100', 'group-hover/btn:translate-x-1', 'bg-transparent', 'bg-gradient-to-tl', 'rounded-tl-full', 'from-orange-400/20', 'rounded-br-full', '-z-10', 'animate-ping', 'w-3', 'h-3', 'top-1/3', 'bg-amber-300', 'md:w-full', 'md:items-start', 'md:w-1/4', 'md:w-1/7', 'faq-accordion', 'max-w-4xl', 'pl-20', 'whitespace-pre-line', 'dark:border-amber-600', 'pl-6', 'bg-white/50', 'dark:bg-gray-800/50', 'rounded-r-lg', 'text-gray-400', 'from-gray-900', 'via-blue-950', 'to-gray-900', 'border-amber-500/30', 'bg-red-500/20', 'border-red-500/50', 'bg-red-400', 'opacity-75', 'bg-red-500', 'text-red-300', 'bg-gray-900/80', 'to-red-500', 'duration-100', 'via-white', 'opacity-50', 'via-gray-800', 'border-amber-400/40', 'to-orange-600/10', 'text-gray-300', 'bg-amber-500/20', 'border-amber-500/50', 'bg-blue-500/20', 'border-blue-500/50', 'text-blue-300', 'from-gray-700', 'to-gray-800', 'hover:from-gray-600', 'hover:to-gray-700', 'hover:via-orange-600', 'hover:to-amber-700', 'hover:shadow-amber-500/50', 'bg-gray-800/50', 'border-gray-700', '-bottom-1', 'bg-gray-900', 'border-r', 'rotate-45', 'bg-green-500', 'text-green-400', 'bg-yellow-500', 'text-red-400', 'z-9', 'top-32', 'max-w-xs', 'md:max-w-sm', '-left-2', 'via-purple-500', 'to-pink-500', 'hover:from-blue-600', 'hover:to-pink-600', 'dark:border-gray-800', 'focus:ring-pink-300', 'text-right', 'items-baseline', 'justify-end', 'font-mono', 'ml-1', 'from-yellow-200', 'via-yellow-100', 'dark:from-yellow-900', 'dark:via-yellow-800', 'text-yellow-500', 'dark:text-yellow-300', 'text-yellow-700', 'dark:text-yellow-200', 'text-yellow-800', 'dark:text-yellow-100', 'from-indigo-200', 'via-purple-100', 'dark:from-indigo-900', 'dark:via-purple-800', 'text-purple-500', 'dark:text-purple-300', 'text-purple-700', 'dark:text-purple-200', 'text-purple-800', 'dark:text-purple-100', 'mb-12', 'text-amber-700/80', 'md:gap-2', 'opacity-20', 'group-hover:opacity-30', 'from-orange-50', 'to-yellow-50', 'border-orange-200/50', 'text-orange-800', 'from-yellow-50', 'border-yellow-200/50', 'via-orange-500/10', 'to-amber-500/10', 'from-amber-100/80', 'to-orange-100/80', 'border-amber-300/30', 'border-amber-200/40', 'border-orange-200/40', 'border-yellow-200/40', 'z-', 'pointer-events-auto', 'via-blue-50', 'to-blue-100', 'dark:via-blue-950', 'dark:to-blue-900', 'border-blue-400', 'dark:border-blue-700', 'max-w-lg', 'md:max-w-4xl', 'mx-4', 'animate-fadeInUp', 'hover:text-blue-700', 'dark:hover:text-blue-400', 'focus:ring-blue-400', 'md:w-1/3', 'md:w-2/3', 'bg-blue-50', 'accent-blue-500', 'bg-gray-200', 'dark:bg-gray-700', 'hover:bg-gray-300', 'dark:hover:bg-gray-600', 'bg-blue-500', 'hover:bg-blue-600', 'hover:bg-green-600', 'md:p-6', 'max-w-6xl', 'dark:bg-gray-900/95', 'from-amber-500/5', 'to-orange-500/5', 'underline-offset-2', 'hover:-translate-y-0', 'whitespace-nowrap', 'to-orange-50/30', 'dark:border-amber-800/50', 'group-focus-within:scale-150', 'text-orange-500', 'resize-none', 'bg-green-50', 'dark:bg-green-900/20', 'border-green-200', 'dark:border-green-800', 'text-green-700', 'dark:text-green-300', 'bg-red-50', 'dark:bg-red-900/20', 'border-red-200', 'dark:border-red-800', 'text-red-700', 'dark:text-red-300', 'hover:to-amber-600', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:transform-none', 'opacity-25', 'md:justify-between', 'basis-1/5', 'border-gray-500', '/70', 'border-t-blue-500', 'mr-3', 'pl-0!', 'mb-0!', 'hover:text-amber-600', 'dark:hover:text-amber-400', 'after:absolute', 'after:bottom-0', 'after:left-0', 'after:w-0', 'after:h-0', 'after:bg-amber-600', 'dark:after:bg-amber-400', 'hover:after:w-full', 'after:transition-all', 'after:duration-300', 'bg-amber-100/50', 'mx-3', 'dark:text-amber-600', 'md:px-6', 'dark:via-amber-950/30', 'bg-gradient-to-tr', 'from-orange-400/10', 'group-hover:rotate-6', 'group-hover:text-amber-600', 'dark:group-hover:text-amber-400', 'pl-16', 'mt-16'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'custom-yellow': '#fdae50',
        'custom-red': '#fa5952',
        'custom-orange': '#fa5952',
        'custom-violet': '#403e87',
        'custom-blue': '#325492',
        'custom-deep-blue': '#162039',
      },
      transitionProperty: {
        all: 'all',
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity: 'opacity',
        transform: 'transform',
      },
    },
  },
  plugins: [],
};

export default config;