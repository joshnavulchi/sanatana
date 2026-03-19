"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// Unique audioplayer redesign inspired by digital clock
// Circular progress, animated play/pause, bold time display, themed colors
const page = {
  browser_does: "Your browser does not support the audio element.",
  vol: "Vol"
};

const CIRCLE_RADIUS = 48;
const CIRCLE_STROKE = 6;
const CIRCLE_CIRCUM = 2 * Math.PI * CIRCLE_RADIUS;
type AudioSource = {
  src: string;
  type?: string; // e.g., "audio/mpeg", "audio/ogg", "audio/wav"
};
type Track = {
  id: string | number;
  title?: string;
  artist?: string;
  sources: AudioSource[];
  poster?: string; // optional cover image
};
type AudioPlayerProps = {
  /** Single track or playlist */
  tracks: Track[] | Track;

  /** Start with this track index if playlist */
  initialIndex?: number;

  /** Autoplay (may be blocked by browser without user gesture) */
  autoPlay?: boolean;

  /** Start muted (helps with autoplay) */
  muted?: boolean;

  /** Loop the current track */
  loop?: boolean;

  /** ClassName for container */
  className?: string;

  /** Show simple playlist list and next/prev buttons */
  showPlaylist?: boolean;
};
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
export default function AudioPlayer({
  tracks,
  initialIndex = 0,
  autoPlay = false,
  muted = false,
  loop = false,
  className,
  showPlaylist = true
}: AudioPlayerProps) {
  const playlist: Track[] = useMemo(() => Array.isArray(tracks) ? tracks : [tracks], [tracks]);
  const [currentIndex, setCurrentIndex] = useState<number>(Math.min(Math.max(0, initialIndex), Math.max(0, playlist.length - 1)));
  const currentTrack = playlist[currentIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [isLoop, setIsLoop] = useState<boolean>(loop);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = isLoop;
    audio.muted = isMuted;
    audio.volume = volume;
    audio.load();
    const tryPlay = async () => {
      if (autoPlay) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          // Autoplay blocked by browser—user will need to click play
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    };

    // Reset time UI
    setCurrentTime(0);
    setDuration(0);
    setBufferedEnd(0);

    // Slight delay ensures media is ready enough before play attempt
    const t = setTimeout(tryPlay, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Keep audio element properties in sync when toggles change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = isLoop;
  }, [isLoop]);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // Attach audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
      // Update buffered end for a simple buffer bar
      try {
        if (audio.buffered.length > 0) {
          const end = audio.buffered.end(audio.buffered.length - 1);
          setBufferedEnd(Math.min(end, audio.duration || Infinity));
        }
      } catch {
        // ignore DOM exceptions
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      if (playlist.length > 1 && !isLoop) {
        // go to next track or stop at end
        setCurrentIndex(idx => idx + 1 < playlist.length ? idx + 1 : 0);
      }
    };
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isSeeking, playlist.length, isLoop]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!audioRef.current) return;
      if (e.code === "Space") {
        e.preventDefault();
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
      } else if (e.code === "ArrowRight") {
        audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
      } else if (e.code === "ArrowLeft") {
        audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
      } else if (e.key.toLowerCase() === "m") {
        setIsMuted(m => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [duration, isPlaying]);
  const handleSeekMouseDown = () => setIsSeeking(true);
  const handleSeekChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const val = Number(e.target.value);
    setCurrentTime(val);
  };
  const handleSeekMouseUp: React.MouseEventHandler<HTMLInputElement> = e => {
    if (!audioRef.current || !progressRef.current) return;
    audioRef.current.currentTime = Number(progressRef.current.value);
    setIsSeeking(false);
  };
  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch {
        // play blocked or failed
      }
    }
  };
  const handlePrev = () => {
    if (playlist.length <= 1) return;
    setCurrentIndex(idx => (idx - 1 + playlist.length) % playlist.length);
  };
  const handleNext = () => {
    if (playlist.length <= 1) return;
    setCurrentIndex(idx => (idx + 1) % playlist.length);
  };
  return <div className={`fixed z-9 top-25 md:top-24 left-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg rounded-full tracking-widest border-2 border-white  focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all duration-300 flex cursor-pointer`}>
      {/* Media */}
      <audio ref={audioRef} preload="metadata">
        {currentTrack.sources.map((s, i) => <source key={i} src={s.src} type={s.type} />)} {page.browser_does} </audio>

      {/* Circular Progress & Play/Pause */}
      <div className="relative w-[30px] h-[30px]">
        <svg width={24} height={24}>
          <circle cx={24} cy={24} r={CIRCLE_RADIUS} stroke="#e0e7ff" strokeWidth={CIRCLE_STROKE} fill="none" />
          <circle cx={24} cy={24} r={CIRCLE_RADIUS} stroke="#6366f1" strokeWidth={CIRCLE_STROKE} fill="none" strokeDasharray={CIRCLE_CIRCUM} strokeDashoffset={CIRCLE_CIRCUM / 2} style={{
          transition: "stroke-dashoffset 0.3s linear"
        }} />
        </svg>
        <button type="button" onClick={handlePlayPause} title={isPlaying ? "Pause (Space)" : "Play (Space)"} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all">
          {isPlaying ? <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg> : <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>}
        </button>
      </div>

      {/* No time display */}

      {/* Track Info */}
      <div className="text-center w-full hidden">
        <div className="font-semibold text-xl md:text-lg text-indigo-900 truncate" title={currentTrack.title}>
          {currentTrack.title ?? "Untitled Track"}
        </div>
        {currentTrack.artist ? <div className="text-gray-500 text-base md:text-md">{currentTrack.artist}</div> : null}
      </div>

      {/* Controls */}
      <div className="gap-4 items-center hidden">
        {playlist.length > 1 && <button type="button" onClick={handlePrev} title="Previous" className="px-3 py-2 rounded-lg border border-indigo-200 bg-white text-base md:text-md text-indigo-700 hover:bg-indigo-50">⏮</button>}
        <button type="button" onClick={() => setIsLoop(l => !l)} aria-pressed={isLoop} title={isLoop ? "Loop: On" : "Loop: Off"} className={`px-3 py-2 rounded-lg border border-indigo-200 bg-white text-indigo-700 text-base md:text-md ${isLoop ? 'bg-indigo-100 text-indigo-900' : ''}`}>⟲</button>
        <button type="button" onClick={() => setIsMuted(m => !m)} aria-pressed={isMuted} title={isMuted ? "Unmute (M)" : "Mute (M)"} className={`px-3 py-2 rounded-lg border border-red-200 bg-white text-red-700 text-base md:text-md ${isMuted ? 'bg-red-100 text-red-900' : ''}`}>{isMuted ? "🔇" : "🔊"}</button>
        {playlist.length > 1 && <button type="button" onClick={handleNext} title="Next" className="px-3 py-2 rounded-lg border border-indigo-200 bg-white text-base md:text-md text-indigo-700 hover:bg-indigo-50">⏭</button>}
      </div>

      {/* Volume */}
      <div className="items-center gap-2 hidden">
        <span className="text-gray-500 text-base md:text-md">{page.vol}</span>
        <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={e => {
        const v = Number(e.target.value);
        setVolume(v);
        if (v === 0 && !isMuted) setIsMuted(true);
        if (v > 0 && isMuted) setIsMuted(false);
      }} aria-label="Volume" className="accent-indigo-500" />
      </div>

      {/* Playlist */}
      {showPlaylist && playlist.length > 1 && <div className="mt-3 pt-3 border-t border-dashed border-indigo-200 hidden flex-col gap-1 w-full">
          {playlist.map((t, i) => {
        const active = i === currentIndex;
        return <button key={t.id ?? i} onClick={() => setCurrentIndex(i)} className={`text-left px-3 py-2 rounded-lg border border-indigo-200 ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-indigo-900'} cursor-pointer`} title={t.title}>
                {t.title ?? `Track ${i + 1}`}
                {t.artist ? ` — ${t.artist}` : ""}
              </button>;
      })}
        </div>}
    </div>;
}
const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer"
};