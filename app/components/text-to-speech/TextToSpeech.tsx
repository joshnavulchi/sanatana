'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '@app/styles.module.scss';

interface TextToSpeechProps {
  content?: string;
  sectionId?: string;
  className?: string;
}
export default function TextToSpeech({ content = '', sectionId, className = '' }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(() => {
    // Check if speech synthesis is supported on initialization
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    return () => {
      // Cleanup: stop speech when component unmounts
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const getTextContent = () => {
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        return section.innerText || section.textContent || '';
      }
    }
    return content || '';
  };
  const handlePlay = () => {
    if (!isSupported) return;
    const textToRead = getTextContent();
    if (!textToRead) return;
    if (isPaused && utteranceRef.current) {
      // Resume paused speech
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Start new speech
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance;
      // Configure voice settings
      utterance.rate = 1.0; // Speech rate (0.1 to 10)
      utterance.pitch = 1.0; // Voice pitch (0 to 2)
      utterance.volume = 1.0; // Volume (0 to 1)
      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };
      window.speechSynthesis.speak(utterance);
    }
  };
  const handlePause = () => {
    if (!isSupported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };
  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };
  if (!isSupported) {
    return null; // Don't render if not supported
  }

  const containerClass = className.includes('floating')
    ? `${styles.textToSpeech} ${styles.floating}`
    : `${styles.textToSpeech} ${className}`;

  return (
    <span className="containerClass text-lg sm:text-base leading-relaxed font-normal">
      <span className="styles.controls text-lg sm:text-base leading-relaxed font-normal">
        {!isPlaying && !isPaused && (
          <button
            onClick={handlePlay}
            className={styles.playButton}
            aria-label="Play audio"
            title="Play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
        {isPlaying && (
          <button
            onClick={handlePause}
            className={styles.pauseButton}
            aria-label="Pause audio"
            title="Pause"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>
        )}
        {isPaused && (
          <button
            onClick={handlePlay}
            className={styles.resumeButton}
            aria-label="Resume audio"
            title="Resume"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className={styles.stopButton}
            aria-label="Stop audio"
            title="Stop"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          </button>
        )}
      </span>
    </span>
  );
}
