"use client";
import { useEffect, useRef, useState } from "react";

export default function FooterAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlayer(true);
      if (audioRef.current) {
        audioRef.current.volume = 0.2; // Set low volume
        audioRef.current.loop = true; // Ensure looping
        audioRef.current.play().catch(() => { });
      }
    }, 60000); // 1 minute
    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{ position: 'fixed', left: 0, bottom: 0, height: '0', width: '100%', zIndex: 1000, textAlign: 'center', background: 'transparent' }}>
      {showPlayer && (
        <>
          <audio
            ref={audioRef}
            src="/krishna-flute.mp3"
            preload="auto"
            style={{ width: 120, height: 30, display: 'none' }}
            onError={() => setError(true)}
          />
          {error && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }}>
              Krishna flute audio not found. Please upload krishna-flute.mp3 in public folder.<br />
              <audio controls style={{ width: 120, height: 30 }}>
                <source src="" type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </>
      )}
    </div>
  );
}
