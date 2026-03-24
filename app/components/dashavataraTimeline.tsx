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
    <aside className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 text-base leading-relaxed font-normal">
        <h2 className="text-orange-800 text-2xl font-semibold leading-snug mb-3">
          Dashavatara Timeline
        </h2>
        <div
          className="h-1 w-24 rounded-full bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 text-base leading-relaxed font-normal"
          aria-hidden
        />
      </div>

      <ol className="space-y-3">
        {AVATARS.map((a) => (
          <li key={a.order} className="flex items-start gap-3 mb-2">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-base leading-relaxed font-normal"
              aria-label={`Avatar ${a.order}`}
            >
              {a.order}
            </span>
            <div className="flex-1 text-base leading-relaxed font-normal">
              <div className="text-amber-900 text-base leading-relaxed font-normal">{a.name}</div>
              <div className="text-amber-800/80 text-base leading-relaxed font-normal">Vishnu avatar</div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
