import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-[400px] items-end px-2">
        <div className="flex flex-col">
          <span className="status-label">Score Unit</span>
          <div className="data-value text-2xl text-hardware-text">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="status-label">Status</span>
          <div className={`data-value text-xs ${isPaused ? 'text-hardware-muted' : 'text-hardware-accent animate-pulse'}`}>
            {gameOver ? 'CRITICAL_FAILURE' : isPaused ? 'STANDBY' : 'ACTIVE_LINK'}
          </div>
        </div>
      </div>

      <div 
        className="hardware-widget relative border-2 border-hardware-muted/20 overflow-hidden"
        style={{ 
          width: 'min(90vw, 400px)', 
          height: 'min(90vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ 
          backgroundImage: `linear-gradient(to right, #8E9299 1px, transparent 1px), linear-gradient(to bottom, #8E9299 1px, transparent 1px)`,
          backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
        }} />

        {/* Snake rendering */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`rounded-sm ${i === 0 ? 'bg-hardware-text glow-white' : 'bg-hardware-text/40'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food rendering */}
        <div
          className="bg-hardware-accent rounded-full glow-red animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '2px'
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-hardware-bg/95 flex flex-col items-center justify-center gap-6 z-10 p-8 text-center">
            <div className="space-y-1">
              <span className="status-label text-hardware-accent">System Error</span>
              <h2 className="text-3xl font-bold text-hardware-accent tracking-tighter">TERMINATED</h2>
            </div>
            <div className="space-y-1">
              <span className="status-label">Final Data</span>
              <p className="data-value text-xl">{score} PTS</p>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-2 bg-hardware-text text-hardware-bg font-mono text-xs font-bold rounded-sm hover:bg-hardware-muted transition-colors uppercase tracking-widest"
            >
              <RotateCcw size={14} />
              Reboot System
            </button>
          </div>
        )}

        {/* Start/Pause Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-hardware-bg/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <button
              onClick={() => setIsPaused(false)}
              className="group flex flex-col items-center gap-2"
            >
              <div className="p-6 rounded-full border border-dashed border-hardware-muted group-hover:border-hardware-text transition-colors">
                <Play size={32} className="text-hardware-muted group-hover:text-hardware-text transition-colors" fill="currentColor" />
              </div>
              <span className="status-label group-hover:text-hardware-text transition-colors">Initialize</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between w-full max-w-[400px] px-2">
        <span className="status-label">Input: ArrowKeys</span>
        <span className="status-label">Mode: Specialist_v1</span>
      </div>
    </div>
  );
};
