"use client";
// import { useEffect, useState } from 'react';

export default function DefinitionOfLife() {
  const isVisible = true;
  //const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   setIsVisible(true);
  // }, []);

  return (
    <div className="mx-auto max-w-7xl py-6 px-3">
      <div
        className={`
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-3xl text-amber-800">🕉️</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text mb-2">
            The Essence of Life
          </h2>
          <p className="text-lg text-amber-700/80  italic">
            जीवनस्य परमं तत्त्वम्
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-12">
          {/* Card 1: Purpose */}
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              🎯
            </div>
            <h3 className="text-xl md:text-lg font-bold text-amber-800 mb-3">पुरुषार्थ - Life&apos;s Purpose</h3>
            <p className=" leading-relaxed">
              Life is a sacred journey toward the four Purusharthas:
              <span className="font-semibold text-amber-700"> Dharma</span> (righteousness),
              <span className="font-semibold text-orange-600"> Artha</span> (prosperity),
              <span className="font-semibold text-amber-700"> Kama</span> (desires), and
              <span className="font-semibold text-orange-600"> Moksha</span> (liberation).
            </p>
          </div>

          {/* Card 2: Atman */}
          <div className="relative bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              ✨
            </div>
            <h3 className="text-xl md:text-lg font-bold text-orange-800 mb-3">आत्मा - The Eternal Soul</h3>
            <p className=" leading-relaxed">
              The Atman, your true self, is eternal and divine.
              <span className="italic"> `&quot;`न जायते म्रियते वा`&quot;` </span>
              — It is never born, nor does it die. Life is the soul&apos;s journey to realize its oneness with Brahman.
            </p>
          </div>

          {/* Card 3: Karma */}
          <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              ⚖️
            </div>
            <h3 className="text-xl md:text-lg font-bold text-yellow-800 mb-3">कर्म - Law of Action</h3>
            <p className=" leading-relaxed">
              Every action creates karma, shaping our destiny.
              <span className="font-semibold text-amber-700"> `&quot;`कर्मण्येवाधिकारस्ते`&quot;`</span>
              — You have the right to perform your duty, but the fruits belong to the divine.
            </p>
          </div>

          {/* Card 4: Maya & Reality */}
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              🌌
            </div>
            <h3 className="text-xl md:text-lg font-bold text-amber-800 mb-3">माया - Illusion & Truth</h3>
            <p className=" leading-relaxed">
              Life is a play of Maya, the cosmic illusion. True wisdom lies in seeing beyond appearances to recognize the
              <span className="font-semibold text-orange-600"> eternal truth</span> that pervades all existence.
            </p>
          </div>
        </div>

        {/* Central wisdom quote */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-amber-100/80 to-orange-100/80 rounded-2xl p-8 border-2 border-amber-300/30 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <p className="text-2xl md:text-3xl  text-amber-900 leading-relaxed">
                `&quot;`आत्मानं विद्धि`&quot;`
              </p>
              <p className="text-xl md:text-lg md:text-2xl font-medium">
                Know Thyself
              </p>
              <div className="pt-4 border-t border-amber-300/30 mt-4">
                <p className="text-xl md:text-lg md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Life is the divine opportunity to realize your true nature—not this temporary body,
                  but the immortal consciousness that witnesses all, untouched by birth or death,
                  pleasure or pain. This realization is the highest goal of human existence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Four stages of life */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-amber-800 mb-6">
            आश्रम - The Four Stages of Life
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 my-6">
            <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg bg-gradient-to-b from-amber-50 to-white border border-amber-200/40 flex-1">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold text-amber-800 mb-1">Brahmacharya</h4>
              <p className="text-xl md:text-lg text-gray-600">Student Life - Learning & Discipline</p>
            </div>
            <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg bg-gradient-to-b from-orange-50 to-white border border-orange-200/40">
              <div className="text-3xl mb-2">🏡</div>
              <h4 className="font-bold text-orange-800 mb-1">Grihastha</h4>
              <p className="text-xl md:text-lg text-gray-600">Householder - Family & Duty</p>
            </div>
            <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg bg-gradient-to-b from-yellow-50 to-white border border-yellow-200/40">
              <div className="text-3xl mb-2">🌳</div>
              <h4 className="font-bold text-yellow-800 mb-1">Vanaprastha</h4>
              <p className="text-xl md:text-lg text-gray-600">Retirement - Detachment & Reflection</p>
            </div>
            <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg bg-gradient-to-b from-amber-50 to-white border border-amber-200/40">
              <div className="text-3xl mb-2">🧘</div>
              <h4 className="font-bold text-amber-800 mb-1">Sannyasa</h4>
              <p className="text-xl md:text-lg text-gray-600">Renunciation - Complete Liberation</p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center mt-12 pt-8 border-t border-amber-200/30">
          <p className="text-xl md:text-lg text-amber-700 font-medium">
            यत् पिण्डे तत् ब्रह्माण्डे
          </p>
          <p className="text-sm text-gray-500 italic mt-1">
            As is the individual, so is the universe
          </p>
        </div>
      </div>
    </div>
  );
}
