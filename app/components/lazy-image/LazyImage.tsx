"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import Loader from '../loader/loader';
import useDeferAssets from '../../../lib/useDeferAssets';

type Props = {
  src: ImageProps['src'];
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  unoptimized?: boolean;
} & Partial<ImageProps>;

export default function LazyImage({ src, alt = '', width, height, className, placeholder, onLoad, unoptimized, ...rest }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
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
    <div ref={containerRef} className={className} style={{ minHeight: height ? `${height}px` : undefined }}>
      {!loadNow ? (placeholder ?? <Loader />) : (
        // @ts-expect-error next/image typings are finicky with dynamic props
        <Image src={src} alt={alt} width={width} height={height} onLoad={onLoad} loading="eager" unoptimized={unoptimized} {...(rest as ImageProps)} />
      )}
    </div>
  );
}
