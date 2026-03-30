import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS = [
  {
    id: 1,
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/bollywood1/200/200"
  },
  {
    id: 2,
    title: "Kesariya",
    artist: "Pritam, Arijit Singh",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/bollywood2/200/200"
  },
  {
    id: 3,
    title: "Chaiyya Chaiyya",
    artist: "A.R. Rahman",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/bollywood3/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="hardware-widget p-6 w-full max-w-[400px] flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="status-label">Signal Source</span>
          <h3 className="text-xl font-bold tracking-tighter uppercase">{currentTrack.title}</h3>
          <p className="text-xs font-mono text-hardware-muted uppercase">{currentTrack.artist}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="status-label">Output</span>
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-hardware-accent glow-red' : 'bg-hardware-muted/20'}`} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 radial-track" />
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-full object-cover grayscale opacity-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-0.5 items-end h-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-hardware-text"
                    animate={{ height: [4, 16, 8, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="status-label">Progress</span>
              <span className="data-value text-[10px]">{Math.floor(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-hardware-muted/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-hardware-text"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={handlePrev} className="p-2 text-hardware-muted hover:text-hardware-text transition-colors">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full border border-hardware-text flex items-center justify-center text-hardware-text hover:bg-hardware-text hover:text-hardware-bg transition-all"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
            </button>
            <button onClick={handleNext} className="p-2 text-hardware-muted hover:text-hardware-text transition-colors">
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-hardware-muted/10">
        <div className="space-y-1">
          <span className="status-label">Bitrate</span>
          <div className="data-value">320 KBPS</div>
        </div>
        <div className="space-y-1 text-right">
          <span className="status-label">Format</span>
          <div className="data-value">BOLLYWOOD_PCM</div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
};
