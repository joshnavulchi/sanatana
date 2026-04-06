'use client';

const AVATARS: ReadonlyArray<{ readonly order: number; readonly name: string }> = [
  { order: 1, name: 'Matsya' },
  { order: 2, name: 'Kurma' },
  { order: 3, name: 'Varaha' },
  { order: 4, name: 'Narasimha' },
  { order: 5, name: 'Vamana' },
  { order: 6, name: 'Parashurama' },
  { order: 7, name: 'Rama' },
  { order: 8, name: 'Krishna' },
  { order: 9, name: 'Buddha' },
  { order: 10, name: 'Kalki' },
];

export default function DashavataraTimeline() {
  return (
    <aside className="bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 rounded-2xl border-2 border-amber-100 shadow-xl p-8 animate-fadeInUp">
      <div className="flex items-center justify-between gap-4 text-lg sm:text-base leading-relaxed font-normal">
        <h3 className="text-pink-700 text-3xl font-extrabold leading-snug mb-3 drop-shadow-lg animate-gradient-x">Dashavatara Timeline</h3>
        <div
          className="h-2 w-32 rounded-full bg-gradient-to-r from-pink-400 via-amber-400 to-rose-400 animate-gradient-x"
          aria-hidden
        />
      </div>

      <ol className="space-y-4">
        {AVATARS.map((a, idx) => (
          <li key={a.order} className="flex items-start gap-4 mb-2 animate-fadeInUp delay-[${idx * 80}ms]">
            <span
              className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-amber-400 to-rose-400 border-4 border-white text-white flex items-center justify-center text-xl font-black shadow-xl animate-pulse"
              aria-label={`Avatar ${a.order}`}
            >
              {a.order}
            </span>
            <div className="flex-1 text-lg sm:text-base leading-relaxed font-normal">
              <div className="text-pink-900 text-lg font-semibold leading-relaxed animate-gradient-x">{a.name}</div>
              <div className="text-pink-800/80 text-lg sm:text-base leading-relaxed font-normal">Vishnu avatar</div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

