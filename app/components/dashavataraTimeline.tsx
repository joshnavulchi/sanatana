'use client';

// import React, { useState, useEffect } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';

import React from 'react';


interface Avatar {
  order: number;
  name: string;
  type: string;
  yuga: string;
  purpose: string;
  primary_antagonist?: string;
  primary_event?: string;
  weapon?: string;
  status?: string;
  historical_identity?: string;
  associated_texts: string[];
  symbolism: string;
  evolutionary_symbolism: string;
}

interface Interpretations {
  theological_view: string;
  symbolic_view: string;
  comparative_mythology_view: string;
  cyclical_time_concept: string;
}

interface DashavataraLocaleSchema {
  dashavatara: Avatar[];
  interpretations: Interpretations;
}

export default function DashavataraTimeline({
  locale,
}: {
  locale?: string;
}) {
  // Correct quotes + typing
  const loc = useLocaleSection<DashavataraLocaleSchema>(
    'sharable_strings'
  );

  if (!loc?.dashavatara) {
    return null; // or loading fallback
  }

  const { dashavatara, interpretations } = loc;

  return (
    <section className="bg-gradient-to-b from-amber-50 via-white to-orange-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-4xl font-bold text-center text-orange-800 mb-16">
          Dasavatara Timeline
        </h1>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-1 bg-orange-200 h-full" />

          <div className="space-y-20">
            {dashavatara
              .sort((a, b) => a.order - b.order)
              .map((avatar, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={avatar.order}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isLeft ? 'md:justify-start' : 'md:justify-end'
                    }`}
                  >
                    <div
                      className={`w-full md:w-5/12 ${
                        isLeft ? 'md:pr-12' : 'md:pl-12'
                      }`}
                    >
                      <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition">

                        <h2 className="text-xl font-semibold text-orange-700">
                          {avatar.name}
                        </h2>

                        <p className="text-sm text-gray-500 mb-2">
                          {avatar.type} • {avatar.yuga}
                          {avatar.status && ` • ${avatar.status}`}
                        </p>

                        <p className="text-gray-700 mb-3">
                          {avatar.purpose}
                        </p>

                        {avatar.primary_antagonist && (
                          <p className="text-sm text-gray-600">
                            <strong>Antagonist:</strong>{' '}
                            {avatar.primary_antagonist}
                          </p>
                        )}

                        {avatar.primary_event && (
                          <p className="text-sm text-gray-600">
                            <strong>Event:</strong>{' '}
                            {avatar.primary_event}
                          </p>
                        )}

                        {avatar.weapon && (
                          <p className="text-sm text-gray-600">
                            <strong>Weapon:</strong> {avatar.weapon}
                          </p>
                        )}

                        {avatar.historical_identity && (
                          <p className="text-sm text-gray-600">
                            <strong>Identity:</strong>{' '}
                            {avatar.historical_identity}
                          </p>
                        )}

                        <div className="mt-3">
                          <p className="text-sm">
                            <strong>Symbolism:</strong>{' '}
                            {avatar.symbolism}
                          </p>
                          <p className="text-sm mt-1">
                            <strong>Evolution:</strong>{' '}
                            {avatar.evolutionary_symbolism}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {avatar.associated_texts.map((text, i) => (
                            <span
                              key={i}
                              className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                            >
                              {text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Marker */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-600 text-white font-bold border-4 border-white shadow">
                        {avatar.order}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Interpretations */}
        {interpretations && (
          <div className="mt-24 bg-white rounded-2xl p-10 shadow-lg border border-orange-100">
            <h2 className="text-2xl font-semibold text-orange-800 mb-6 text-center">
              Interpretations
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-gray-700">
              <div>
                <h3 className="font-medium text-orange-600 mb-2">
                  Theological View
                </h3>
                <p>{interpretations.theological_view}</p>
              </div>

              <div>
                <h3 className="font-medium text-orange-600 mb-2">
                  Symbolic View
                </h3>
                <p>{interpretations.symbolic_view}</p>
              </div>

              <div>
                <h3 className="font-medium text-orange-600 mb-2">
                  Comparative Mythology
                </h3>
                <p>{interpretations.comparative_mythology_view}</p>
              </div>

              <div>
                <h3 className="font-medium text-orange-600 mb-2">
                  Cyclical Time Concept
                </h3>
                <p>{interpretations.cyclical_time_concept}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}