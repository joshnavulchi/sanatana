export default function HeritageFooter() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 border-t border-orange-200">
      {/* Mandala Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full border-10 border-orange-300 opacity-25 duration-5000 animate-ping"></div>
        <div className="absolute top-5 right-5 w-[50px] h-[50px] rounded-full border-10 border-amber-400 opacity-25 duration-5000 animate-ping"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Decorative Top Line */}
        <div className="flex justify-center mb-8">
          <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></div>
        </div>
        <h3 className="text-3xl md:text-4xl font-semibold text-orange-900 tracking-wide">
          Preserving Our Vedic Civilizational Legacy
        </h3>
        <p className="mt-8 text-base md:text-lg text-amber-900 leading-relaxed max-w-3xl mx-auto">
          For many, religion is not merely a belief system but a sacred inheritance passed down through generations.
          Rooted in profound spiritual and philosophical foundations, our tradition has guided humanity for millennia through knowledge, discipline, and dharmic living.
        </p>
        <p className="mt-6 text-base md:text-lg text-amber-900 leading-relaxed max-w-3xl mx-auto">
          Changing one’s religious identity does not alter one’s ancestry or inherited cultural roots.
          Destiny is shaped by actions and character rather than affiliation alone.
        </p>
        <p className="mt-6 font-semibold text-orange-800">
          We remain committed to protecting and transmitting this ancient civilizational legacy for future generations.
        </p>
      </div>
    </section>
  );
}
