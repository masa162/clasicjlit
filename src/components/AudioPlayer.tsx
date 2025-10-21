/**
 * Audio Player Component
 * 
 * Features:
 * - Play/Pause, Seek, Forward/Rewind
 * - Playback speed adjustment
 * - Continuous playback (auto-play next chapter)
 * - Accessible controls
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n';

interface AudioPlayerProps {
  src: string;
  onEnded?: () => void;
  autoPlayNext?: boolean;
  nextChapterUrl?: string;
}

export default function AudioPlayer({ 
  src, 
  onEnded,
  autoPlayNext = true,
  nextChapterUrl 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      
      // Trigger custom onEnded callback
      if (onEnded) {
        onEnded();
      }
      
      // Auto-play next chapter if enabled
      if (autoPlayNext && nextChapterUrl) {
        setTimeout(() => {
          window.location.href = nextChapterUrl;
        }, 1000); // 1 second delay before navigating
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onEnded, autoPlayNext, nextChapterUrl]);

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
  }, [src]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Number(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, duration);
    }
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  };

  const formatTime = (time: number): string => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 w-full bg-white shadow-sm">
      <audio 
        ref={audioRef} 
        src={src} 
        preload="metadata"
        aria-label="Audio player"
      />
      
      {/* Seek Bar */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-mono text-gray-700 min-w-[45px]">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={isLoading}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Seek audio"
        />
        <span className="text-sm font-mono text-gray-700 min-w-[45px] text-right">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={handleRewind} 
            disabled={isLoading}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Rewind 10 seconds"
          >
            ⏪ 10s
          </button>
          
          <button 
            onClick={togglePlayPause} 
            disabled={isLoading}
            className="px-8 py-4 rounded-full bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
            aria-label={isPlaying ? t('pause') : t('play')}
          >
            {isLoading ? t('loading') : isPlaying ? '⏸ ' + t('pause') : '▶ ' + t('play')}
          </button>
          
          <button 
            onClick={handleForward} 
            disabled={isLoading}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Forward 10 seconds"
          >
            10s ⏩
          </button>
        </div>

        {/* Playback Rate */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">{t('speed')}:</span>
          {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => handlePlaybackRateChange(rate)}
              disabled={isLoading}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                playbackRate === rate 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`Set playback speed to ${rate}x`}
              aria-pressed={playbackRate === rate}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Next Chapter Info */}
        {autoPlayNext && nextChapterUrl && (
          <div className="text-center text-sm text-gray-500 mt-2">
            {t('next')} chapter will auto-play
          </div>
        )}
      </div>
    </div>
  );
}
