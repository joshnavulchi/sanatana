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
          break;
        }
      }
    }, { rootMargin: '300px', threshold: 0.01 });

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="className text-base leading-relaxed font-normal" style={{ minHeight: height ? `${height}px` : undefined }}>
      {!loadNow ? (<Loader />) : imgError ? (
        <img
          src={`https://via.placeholder.com/${Number(width) || 400}x${Number(height) || 200}?text=${encodeURIComponent(typeof alt === 'string' ? alt : 'Image')}&bg=${encodeURIComponent('#fbbf24')}&fg=${encodeURIComponent('#fff')}`}
          alt={typeof alt === 'string' ? alt : 'placeholder'}
          width={width}
          height={height}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={onLoad}
          onError={() => setImgError(true)}
          loading="eager"
          unoptimized={unoptimized}
          {...safeRest}
        />
        
      )}
    </div>
  );
}