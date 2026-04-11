/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Loader from '@components/loader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-100 via-pink-100 to-rose-100 animate-gradient-x">
      <div className="rounded-3xl bg-white/80 shadow-2xl p-8 backdrop-blur-xl border-4 border-amber-100 animate-fadeInUp">
        <Loader />
        <div className="mt-4 text-center text-amber-700 font-semibold animate-pulse">Loading, please wait…</div>
      </div>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

