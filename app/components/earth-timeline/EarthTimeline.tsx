"use client";
import { useState, useEffect, useRef } from 'react';

// Simplified continental data for different geological periods
// Each period has simplified path data representing continents
const timelineData = [
  {
    year: -200000000, // 200 million years ago - Pangaea
    name: "Pangaea",
    description: "All continents joined as one supercontinent",
    continents: [
      "M 400 300 Q 420 280 450 270 Q 480 260 520 265 Q 560 270 580 290 Q 600 310 590 340 Q 580 370 560 390 Q 540 410 510 420 Q 480 430 450 425 Q 420 420 400 400 Q 380 380 380 350 Q 380 320 400 300 Z"
    ],
    color: "#8B4513"
  },
  {
    year: -100000000, // 100 million years ago - Early separation
    name: "Early Separation",
    description: "Continents beginning to drift apart",
    continents: [
      "M 380 280 Q 400 270 430 275 Q 460 280 480 295 Q 500 310 495 335 Q 490 360 470 375 Q 450 390 420 385 Q 390 380 375 360 Q 360 340 365 315 Q 370 290 380 280 Z",
      "M 520 320 Q 540 315 565 322 Q 590 329 605 345 Q 620 361 615 382 Q 610 403 590 413 Q 570 423 545 418 Q 520 413 510 395 Q 500 377 508 358 Q 516 339 520 320 Z"
    ],
    color: "#A0522D"
  },
  {
    year: -50000000, // 50 million years ago
    name: "Continental Drift",
    description: "Major continental masses separating",
    continents: [
      "M 200 250 Q 220 240 250 245 Q 280 250 300 270 Q 320 290 315 320 Q 310 350 285 365 Q 260 380 230 372 Q 200 364 190 340 Q 180 316 190 292 Q 200 268 200 250 Z",
      "M 380 280 Q 395 275 420 280 Q 445 285 460 300 Q 475 315 472 335 Q 469 355 455 368 Q 441 381 420 377 Q 399 373 388 358 Q 377 343 382 323 Q 387 303 380 280 Z",
      "M 560 340 Q 575 335 600 340 Q 625 345 640 360 Q 655 375 650 395 Q 645 415 625 425 Q 605 435 580 430 Q 555 425 545 408 Q 535 391 542 372 Q 549 353 560 340 Z",
      "M 420 450 Q 440 445 470 448 Q 500 451 520 465 Q 540 479 538 500 Q 536 521 520 533 Q 504 545 480 542 Q 456 539 445 525 Q 434 511 438 493 Q 442 475 420 450 Z"
    ],
    color: "#CD853F"
  },
  {
    year: 0, // Present day (simplified)
    name: "Present Day",
    description: "Current continental configuration",
    continents: [
      // Africa
      "M 480 350 Q 490 340 510 345 Q 530 350 545 365 Q 560 380 558 400 Q 556 420 540 435 Q 524 450 505 448 Q 486 446 475 432 Q 464 418 466 398 Q 468 378 480 350 Z",
      // Europe
      "M 520 280 Q 535 275 555 278 Q 575 281 590 293 Q 605 305 603 322 Q 601 339 588 350 Q 575 361 558 359 Q 541 357 530 345 Q 519 333 520 316 Q 521 299 520 280 Z",
      // Asia
      "M 600 300 Q 620 295 650 300 Q 680 305 700 320 Q 720 335 718 355 Q 716 375 698 388 Q 680 401 655 398 Q 630 395 615 380 Q 600 365 602 345 Q 604 325 600 300 Z",
      // North America
      "M 250 280 Q 270 270 300 275 Q 330 280 350 298 Q 370 316 368 340 Q 366 364 348 380 Q 330 396 305 392 Q 280 388 265 372 Q 250 356 252 335 Q 254 314 250 280 Z",
      // South America
      "M 320 400 Q 335 392 360 395 Q 385 398 402 413 Q 419 428 417 448 Q 415 468 400 482 Q 385 496 363 493 Q 341 490 328 476 Q 315 462 317 443 Q 319 424 320 400 Z",
      // Australia
      "M 700 440 Q 715 435 740 438 Q 765 441 780 455 Q 795 469 793 488 Q 791 507 776 518 Q 761 529 740 527 Q 719 525 708 512 Q 697 499 699 481 Q 701 463 700 440 Z",
      // Antarctica
      "M 400 550 Q 430 545 480 548 Q 530 551 560 563 Q 590 575 588 595 Q 586 615 560 625 Q 534 635 490 632 Q 446 629 420 617 Q 394 605 395 586 Q 396 567 400 550 Z"
    ],
    color: "#228B22"
  },
  {
    year: 50000000, // 50 million years future
    name: "Future Earth",
    description: "Projected continental drift",
    continents: [
      "M 450 320 Q 470 310 500 315 Q 530 320 550 338 Q 570 356 568 380 Q 566 404 548 420 Q 530 436 503 433 Q 476 430 460 414 Q 444 398 446 374 Q 448 350 450 320 Z",
      "M 350 300 Q 365 295 390 298 Q 415 301 430 315 Q 445 329 443 348 Q 441 367 428 379 Q 415 391 393 389 Q 371 387 360 375 Q 349 363 350 345 Q 351 327 350 300 Z",
      "M 580 360 Q 595 355 620 358 Q 645 361 660 375 Q 675 389 673 408 Q 671 427 658 438 Q 645 449 623 447 Q 601 445 590 433 Q 579 421 580 403 Q 581 385 580 360 Z"
    ],
    color: "#32CD32"
  },
  {
    year: 250000000, // 250 million years future - New Pangaea
    name: "Pangaea Proxima",
    description: "Continents reunited as new supercontinent",
    continents: [
      "M 420 320 Q 445 305 480 310 Q 515 315 540 335 Q 565 355 560 385 Q 555 415 532 435 Q 509 455 475 453 Q 441 451 420 430 Q 399 409 402 380 Q 405 351 420 320 Z"
    ],
    color: "#9ACD32"
  }
];

interface EarthTimelineProps {
  autoPlay?: boolean;
  speed?: number;
  className?: string;
}

export default function EarthTimeline({ autoPlay = true, speed = 3000, className = '' }: EarthTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(3); // Start at present day
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % timelineData.length);
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    // Smooth progress animation
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressPercent = Math.min((elapsed / speed) * 100, 100);
      setProgress(progressPercent);

      if (progressPercent < 100 && isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [currentIndex, isPlaying, speed]);

  const currentPeriod = timelineData[currentIndex];
  const nextPeriod = timelineData[(currentIndex + 1) % timelineData.length];

  const formatYear = (year: number) => {
    if (year === 0) return "Present Day";
    const absYear = Math.abs(year);
    if (absYear >= 1000000) {
      return `${(absYear / 1000000).toFixed(0)}M years ${year < 0 ? 'ago' : 'future'}`;
    }
    return `${(absYear / 1000).toFixed(0)}K years ${year < 0 ? 'ago' : 'future'}`;
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main SVG Container */}
      <div className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/30">
        {/* Decorative stars background */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* SVG World Map */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto"
          style={{ minHeight: '400px' }}
        >
          {/* Ocean */}
          <rect width="1000" height="700" fill="url(#oceanGradient)" />
          
          {/* Gradients */}
          <defs>
            <radialGradient id="oceanGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
            <filter id="continentGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <g stroke="#ffffff" strokeWidth="0.5" opacity="0.1">
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 70} x2="1000" y2={i * 70} />
            ))}
            {[...Array(14)].map((_, i) => (
              <line key={`v${i}`} x1={i * 71.4} y1="0" x2={i * 71.4} y2="700" />
            ))}
          </g>

          {/* Current continents */}
          {currentPeriod.continents.map((path, index) => (
            <path
              key={`current-${index}`}
              d={path}
              fill={currentPeriod.color}
              stroke="#654321"
              strokeWidth="2"
              filter="url(#continentGlow)"
              opacity={1 - (progress / 200)}
              style={{
                transition: 'opacity 0.3s ease-in-out',
                transformOrigin: 'center',
              }}
            >
              <animateTransform
                attributeName="transform"
                type="scale"
                from="1"
                to="1.02"
                dur="4s"
                repeatCount="indefinite"
                additive="sum"
              />
            </path>
          ))}

          {/* Next continents (fading in) */}
          {isPlaying && nextPeriod.continents.map((path, index) => (
            <path
              key={`next-${index}`}
              d={path}
              fill={nextPeriod.color}
              stroke="#654321"
              strokeWidth="2"
              filter="url(#continentGlow)"
              opacity={progress / 200}
              style={{
                transition: 'opacity 0.3s ease-in-out',
                transformOrigin: 'center',
              }}
            />
          ))}

          {/* Period name overlay */}
          <text
            x="500"
            y="50"
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="32"
            fontWeight="bold"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))'
            }}
          >
            {currentPeriod.name}
          </text>
          
          <text
            x="500"
            y="90"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="18"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
          >
            {formatYear(currentPeriod.year)}
          </text>
        </svg>

        {/* Progress bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-400/30 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            🌍
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{currentPeriod.name}</h3>
            <p className="text-gray-300 leading-relaxed">{currentPeriod.description}</p>
            <p className="text-amber-400 font-semibold mt-2">{formatYear(currentPeriod.year)}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-4">
        {/* Play controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => goToIndex((currentIndex - 1 + timelineData.length) % timelineData.length)}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </>
              )}
            </span>
          </button>

          <button
            onClick={() => goToIndex((currentIndex + 1) % timelineData.length)}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Timeline dots */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {timelineData.map((period, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`
                group relative
                w-12 h-12 rounded-full
                transition-all duration-300
                ${index === currentIndex 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 scale-125 shadow-lg shadow-amber-500/50' 
                  : 'bg-gray-700 hover:bg-gray-600 hover:scale-110'
                }
              `}
              title={`${period.name} - ${formatYear(period.year)}`}
            >
              <div className={`
                absolute -bottom-8 left-1/2 -translate-x-1/2
                px-2 py-1 rounded
                bg-gray-900 text-white text-xs
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                whitespace-nowrap
                pointer-events-none
                z-10
              `}>
                {period.name}
              </div>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-300 text-center leading-relaxed">
            <span className="font-semibold text-amber-400">Timeline:</span> From 200 million years ago through present day to 250 million years in the future. 
            Watch continents drift, separate, and eventually reunite as the Earth's tectonic plates continue their eternal dance.
          </p>
        </div>
      </div>
    </div>
  );
}
