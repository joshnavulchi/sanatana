/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Loader from '@components/loader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-base leading-relaxed font-normal">
      <div className="rounded-md bg-black/60 backdrop-blur-sm text-base leading-relaxed font-normal">
        <Loader />
      </div>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
