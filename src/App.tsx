import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-hardware-surround flex flex-col items-center p-6 md:p-12 gap-12">
      <header className="w-full max-w-5xl flex justify-between items-end border-b border-black/10 pb-6">
        <div className="space-y-1">
          <span className="status-label">Project Identifier</span>
          <h1 className="text-4xl font-bold tracking-tighter uppercase text-hardware-bg">
            Akshay Beats <span className="text-hardware-muted font-light">v1.0</span>
          </h1>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <span className="status-label">System Clock</span>
          <div className="data-value text-lg">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Snake Game */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-hardware-accent glow-red" />
            <span className="status-label text-hardware-bg font-bold">Module 01: Snake_Logic</span>
          </div>
          <SnakeGame />
        </div>

        {/* Right Column - Music & Stats */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-hardware-bg" />
              <span className="status-label text-hardware-bg font-bold">Module 02: Audio_Engine</span>
            </div>
            <MusicPlayer />
          </div>

          <div className="hardware-widget p-6 space-y-6 border-none shadow-lg">
            <div className="space-y-4">
              <span className="status-label">System Diagnostics</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="status-label text-[8px]">Processor</span>
                  <div className="data-value text-[10px]">ARM_CORTEX_M4</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="status-label text-[8px]">Memory</span>
                  <div className="data-value text-[10px]">512KB_SRAM</div>
                </div>
                <div className="space-y-1">
                  <span className="status-label text-[8px]">Voltage</span>
                  <div className="data-value text-[10px]">3.3V_STABLE</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="status-label text-[8px]">Buffer</span>
                  <div className="data-value text-[10px]">1024_SAMPLES</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hardware-muted/20">
              <span className="status-label mb-2 block">Waveform_Analysis</span>
              <div className="flex items-end justify-between h-8 gap-0.5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-hardware-muted/30"
                    animate={{ height: [4, 20, 8, 16, 4] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5 + Math.random(), 
                      ease: "linear" 
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mt-auto pt-12 border-t border-black/10 flex justify-between items-center">
        <span className="status-label">© 2026 AKSHAY_BEATS_LABS</span>
        <div className="flex gap-4">
          <span className="status-label">SECURE_LINK</span>
          <span className="status-label">ENCRYPTED</span>
        </div>
      </footer>
    </div>
  );
}
