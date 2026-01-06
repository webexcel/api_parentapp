import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

function AudioPlayer({ src, className }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <audio ref={audioRef} src={src} />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Progress Bar */}
      <div className="flex-grow">
        <div
          className="h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="flex-shrink-0 text-sm text-gray-500">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}

export default AudioPlayer;
