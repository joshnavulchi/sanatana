"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Loader from './loader';
import useDeferAssets from '@lib/useDeferAssets';

export default function LazyImage({ src, alt, width, height, className, placeholder, onLoad, unoptimized, ...rest }: any) {
  // Only pass rest props that are not src, alt, width, height
  const { ...safeRest } = rest;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const deferReady = useDeferAssets();
  const loadNow = deferReady && visible;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      }
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 animate-fadeInUp ${className}`}
      style={{ minHeight: height ? `${height}px` : undefined }}
    >
      {!loadNow ? (
        <div className="flex items-center justify-center w-full h-full animate-fadeInUp">
          <Loader />
        </div>
      ) : imgError ? (
        <img
          src={`https://via.placeholder.com/${Number(width) || 400}x${Number(height) || 200}?text=${encodeURIComponent(typeof alt === 'string' ? alt : 'Image')}&bg=${encodeURIComponent('#fbbf24')}&fg=${encodeURIComponent('#fff')}`}
          alt={typeof alt === 'string' ? alt : 'placeholder'}
          width={width}
          height={height}
          className="rounded-2xl shadow-lg animate-fadeIn"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={onLoad}
          onError={() => setImgError(true)}
          className="rounded-2xl shadow-lg animate-fadeIn"
          loading="eager"
          unoptimized={unoptimized}
          {...safeRest}
        />
      )}
    </div>
  );
}