"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
  showPlaylist = true,
}: AudioPlayerProps) {
  const playlist: Track[] = useMemo(
    () => (Array.isArray(tracks) ? tracks : [tracks]),
    [tracks]
  );

  const [currentIndex, setCurrentIndex] = useState<number>(
    Math.min(Math.max(0, initialIndex), Math.max(0, playlist.length - 1))
  );
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
        setCurrentIndex((idx) =>
          idx + 1 < playlist.length ? idx + 1 : 0
        );
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
        audioRef.current.currentTime = Math.min(
          audioRef.current.currentTime + 5,
          duration
        );
      } else if (e.code === "ArrowLeft") {
        audioRef.current.currentTime = Math.max(
          audioRef.current.currentTime - 5,
          0
        );
      } else if (e.key.toLowerCase() === "m") {
        setIsMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [duration, isPlaying]);

  const handleSeekMouseDown = () => setIsSeeking(true);
  const handleSeekChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
  };
  const handleSeekMouseUp: React.MouseEventHandler<HTMLInputElement> = (e) => {
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
    setCurrentIndex((idx) => (idx - 1 + playlist.length) % playlist.length);
  };

  const handleNext = () => {
    if (playlist.length <= 1) return;
    setCurrentIndex((idx) => (idx + 1) % playlist.length);
  };

  return (
    <div
      className={className}
      style={{
        maxWidth: 560,
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* Media */}
      <audio ref={audioRef} preload="metadata">
        {currentTrack.sources.map((s, i) => (
          <source key={i} src={s.src} type={s.type} />
        ))}
        Your browser does not support the audio element.
      </audio>

      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {currentTrack.poster ? (
          <img
            src={currentTrack.poster}
            alt={currentTrack.title ?? "cover"}
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
              display: "grid",
              placeItems: "center",
              color: "#374151",
              fontWeight: 700,
            }}
          >
            ♪
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: "#111827",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            title={currentTrack.title}
          >
            {currentTrack.title ?? "Untitled Track"}
          </div>
          {currentTrack.artist ? (
            <div style={{ color: "#6b7280", fontSize: 13 }}>
              {currentTrack.artist}
            </div>
          ) : null}
        </div>

        {/* Loop & Mute */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setIsLoop((l) => !l)}
            aria-pressed={isLoop}
            title={isLoop ? "Loop: On" : "Loop: Off"}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: isLoop ? "#eef2ff" : "#fff",
              color: isLoop ? "#4338ca" : "#111827",
              cursor: "pointer",
            }}
          >
            ⟲
          </button>
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            aria-pressed={isMuted}
            title={isMuted ? "Unmute (M)" : "Mute (M)"}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: isMuted ? "#fee2e2" : "#fff",
              color: isMuted ? "#b91c1c" : "#111827",
              cursor: "pointer",
            }}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            position: "relative",
            height: 8,
            background: "#f3f4f6",
            borderRadius: 999,
          }}
        >
          {/* Buffered bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width:
                duration > 0
                  ? `${(bufferedEnd / duration) * 100}%`
                  : "0%",
              background: "#e5e7eb",
              borderRadius: 999,
            }}
            aria-hidden
          />
          {/* Input range overlays on top but we also show a filled track via CSS gradient */}
          <input
            ref={progressRef}
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            aria-label="Seek"
            style={{
              appearance: "none",
              width: "100%",
              height: 8,
              background: "transparent",
              position: "relative",
              zIndex: 2,
              cursor: "pointer",
            }}
          />
          {/* Filled progress bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width:
                duration > 0
                  ? `${(currentTime / duration) * 100}%`
                  : "0%",
              background:
                "linear-gradient(90deg, #6366f1 0%, #22c55e 100%)",
              borderRadius: 999,
            }}
            aria-hidden
          />
        </div>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {playlist.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            title="Previous"
            style={btnStyle}
          >
            ⏮
          </button>
        )}
        <button
          type="button"
          onClick={handlePlayPause}
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          style={{ ...btnStyle, fontSize: 18 }}
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>
        {playlist.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            title="Next"
            style={btnStyle}
          >
            ⏭
          </button>
        )}

        {/* Volume */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginLeft: "auto",
          }}
        >
          <span style={{ fontSize: 12, color: "#6b7280" }}>Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (v === 0 && !isMuted) setIsMuted(true);
              if (v > 0 && isMuted) setIsMuted(false);
            }}
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && playlist.length > 1 && (
        <div
          style={{
            marginTop: 12,
            borderTop: "1px dashed #e5e7eb",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {playlist.map((t, i) => {
            const active = i === currentIndex;
            return (
              <button
                key={t.id ?? i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: active ? "#eff6ff" : "#fff",
                  color: active ? "#1d4ed8" : "#111827",
                  cursor: "pointer",
                }}
                title={t.title}
              >
                {t.title ?? `Track ${i + 1}`}
                {t.artist ? ` — ${t.artist}` : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};