"use client";

// import { useEffect, useState } from 'react';
const page = {
  artha: "Artha",
  as_individu: "As is the individual, so is the universe",
  atman_true: "The Atman, your true self, is eternal and divine.",
  brahmach: "Brahmacharya",
  desires: "(desires), and",
  dharma: "Dharma",
  essence_life: "The Essence of Life",
  eternal_soul: "आत्मा - The Eternal Soul",
  eternal_truth: "eternal truth",
  every_action: "Every action creates karma, shaping our destiny.",
  four_stages: "आश्रम - The Four Stages of Life",
  grihasth: "Grihastha",
  have_right: "— You have the right to perform your duty, but the fruits belong to the divine.",
  househol_family: "Householder - Family & Duty",
  illusion_truth: "माया - Illusion & Truth",
  kama: "Kama",
  know_thyself: "Know Thyself",
  law_action: "कर्म - Law of Action",
  liberati: "(liberation).",
  life_divine: "Life is the divine opportunity to realize your true nature—not this temporary body,\n                  but the immortal consciousness that witnesses all, untouched by birth or death,\n                  pleasure or pain. This realization is the highest goal of human existence.",
  life_play: "Life is a play of Maya, the cosmic illusion. True wisdom lies in seeing beyond appearances to recognize the",
  life_s: "पुरुषार्थ - Life`'`s Purpose",
  life_sacred: "Life is a sacred journey toward the four Purusharthas:",
  moksha: "Moksha",
  never_born: "— It is never born, nor does it die. Life is the soul`'`s journey to realize its oneness with Brahman.",
  pervades_all: "that pervades all existence.",
  prosperi: "(prosperity),",
  renuncia_complete: "Renunciation - Complete Liberation",
  retireme_detachme: "Retirement - Detachment & Reflection",
  righteou: "(righteousness),",
  sannyasa: "Sannyasa",
  student_life: "Student Life - Learning & Discipline",
  vanapras: "Vanaprastha"
};

export default function DefinitionOfLife() {
  const isVisible = true;
  //const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   setIsVisible(true);
  // }, []);

  return <div className="py-6 px-3">
      <div className={`
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-3xl text-amber-800">🕉️</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent mb-2"> {page.essence_life} </h2>
          <p className="text-lg text-amber-700/80 font-serif italic">
            जीवनस्य परमं तत्त्वम्
          </p>
        </div>

        {/* Main content grid */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-2 mb-12">
          {/* Card 1: Purpose */}
          <div className="w-full md:w-1/4 relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              🎯
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-3">{page.life_s}</h3>
            <p className="text-gray-700 leading-relaxed"> {page.life_sacred} <span className="font-semibold text-amber-700"> {page.dharma}</span> {page.righteou} <span className="font-semibold text-orange-600"> {page.artha}</span> {page.prosperi} <span className="font-semibold text-amber-700"> {page.kama}</span> {page.desires} <span className="font-semibold text-orange-600"> {page.moksha}</span> {page.liberati} </p>
          </div>

          {/* Card 2: Atman */}
          <div className="w-full md:w-1/4 relative bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              ✨
            </div>
            <h3 className="text-xl font-bold text-orange-800 mb-3">{page.eternal_soul}</h3>
            <p className="text-gray-700 leading-relaxed"> {page.atman_true} <span className="italic"> `&quot;`न जायते म्रियते वा`&quot;` </span> {page.never_born} </p>
          </div>

          {/* Card 3: Karma */}
          <div className="w-full md:w-1/4 relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              ⚖️
            </div>
            <h3 className="text-xl font-bold text-yellow-800 mb-3">{page.law_action}</h3>
            <p className="text-gray-700 leading-relaxed"> {page.every_action} <span className="font-semibold text-amber-700"> `&quot;`कर्मण्येवाधिकारस्ते`&quot;`</span> {page.have_right} </p>
          </div>

          {/* Card 4: Maya & Reality */}
          <div className="w-full md:w-1/4 relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              🌌
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-3">{page.illusion_truth}</h3>
            <p className="text-gray-700 leading-relaxed"> {page.life_play} <span className="font-semibold text-orange-600"> {page.eternal_truth}</span> {page.pervades_all} </p>
          </div>
        </div>

        {/* Central wisdom quote */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-amber-100/80 to-orange-100/80 rounded-2xl p-8 border-2 border-amber-300/30 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <p className="text-2xl md:text-3xl font-serif text-amber-900 leading-relaxed">
                `&quot;`आत्मानं विद्धि`&quot;`
              </p>
              <p className="text-xl md:text-2xl text-gray-700 font-medium"> {page.know_thyself} </p>
              <div className="pt-4 border-t border-amber-300/30 mt-4">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"> {page.life_divine} </p>
              </div>
            </div>
          </div>
        </div>

        {/* Four stages of life */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-amber-800 mb-6"> {page.four_stages} </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-amber-50 to-white border border-amber-200/40 flex-1">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold text-amber-800 mb-1">{page.brahmach}</h4>
              <p className="text-sm text-gray-600">{page.student_life}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-orange-50 to-white border border-orange-200/40">
              <div className="text-3xl mb-2">🏡</div>
              <h4 className="font-bold text-orange-800 mb-1">{page.grihasth}</h4>
              <p className="text-sm text-gray-600">{page.househol_family}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-yellow-50 to-white border border-yellow-200/40">
              <div className="text-3xl mb-2">🌳</div>
              <h4 className="font-bold text-yellow-800 mb-1">{page.vanapras}</h4>
              <p className="text-sm text-gray-600">{page.retireme_detachme}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-amber-50 to-white border border-amber-200/40">
              <div className="text-3xl mb-2">🧘</div>
              <h4 className="font-bold text-amber-800 mb-1">{page.sannyasa}</h4>
              <p className="text-sm text-gray-600">{page.renuncia_complete}</p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center mt-12 pt-8 border-t border-amber-200/30">
          <p className="text-sm text-amber-700 font-medium">
            यत् पिण्डे तत् ब्रह्माण्डे
          </p>
          <p className="text-xs text-gray-500 italic mt-1"> {page.as_individu} </p>
        </div>
      </div>
    </div>;
}