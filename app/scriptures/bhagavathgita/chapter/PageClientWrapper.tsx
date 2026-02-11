"use client";
import dynamic from 'next/dynamic';

const BhagavathgitaChapterRootClient = dynamic(() => import('./pageclient'), { ssr: false });

export default function PageClientWrapper() {
  return <BhagavathgitaChapterRootClient />;
}