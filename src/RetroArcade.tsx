import React, { useEffect, useRef, useState } from 'react';
import synth from './audio';

interface FallingItem {
  x: number;
  y: number;
  speed: number;
  text: string;
  isBug: boolean;
  color: string;
  width: number;
}

export default function RetroArcade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game states
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  // Read high score from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pb_arcade_high');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    synth.playClick();
    setScore(0);
    setHealth(100);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = 300);

    // Game loop variables
    let animationId: number;
    let playerX = width / 2;
    const playerWidth = 70;
    const playerHeight = 12;

    const items: FallingItem[] = [];
    const spawnRate = 0.025; // Probability to spawn on each frame

    const skillsPool = ["C++", "React", "Node", "Docker", "Redis", "Java", "Python", "SQL"];
    const bugsPool = ["SEGFAULT", "NPE", "BUG_404", "LEAK", "OVERFLOW", "SYNTAX"];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.clientX - rect.left - playerWidth / 2;
      // Clamp player inside boundaries
      playerX = Math.max(0, Math.min(width - playerWidth, playerX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.touches[0].clientX - rect.left - playerWidth / 2;
      playerX = Math.max(0, Math.min(width - playerWidth, playerX));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    const loop = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw scanner lines (Retro CRT screen effect)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      // Draw Player ship/basket
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(playerX, height - playerHeight - 10, playerWidth, playerHeight);
      ctx.shadowBlur = 0;

      // Spawn falling items
      if (Math.random() < spawnRate) {
        const isBug = Math.random() < 0.35;
        const text = isBug 
          ? bugsPool[Math.floor(Math.random() * bugsPool.length)]
          : skillsPool[Math.floor(Math.random() * skillsPool.length)];
        
        ctx.font = '9px monospace';
        const textWidth = ctx.measureText(text).width + 12;

        items.push({
          x: Math.random() * (width - textWidth) + textWidth / 2,
          y: -20,
          speed: Math.random() * 2 + 2,
          text,
          isBug,
          color: isBug ? '#ef4444' : '#10b981', // Red / Green
          width: textWidth
        });
      }

      // Update and draw items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        // Draw capsule background
        ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(item.x - item.width / 2, item.y - 7, item.width, 14, 6);
        ctx.fill();
        ctx.stroke();

        // Draw text inside capsule
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, item.x, item.y);

        // Check player collision
        const py = height - playerHeight - 10;
        if (
          item.y + 7 >= py && 
          item.y - 7 <= py + playerHeight &&
          item.x + item.width / 2 >= playerX && 
          item.x - item.width / 2 <= playerX + playerWidth
        ) {
          // Collision detected!
          if (item.isBug) {
            // Hit bug: loose health
            setHealth(prev => {
              const next = Math.max(0, prev - 20);
              if (next === 0) {
                setGameOver(true);
                synth.playClick();
              } else {
                synth.playClick();
              }
              return next;
            });
          } else {
            // Caught skill: gain score
            setScore(prev => {
              const next = prev + 10;
              synth.playHover();
              return next;
            });
          }
          items.splice(i, 1);
          continue;
        }

        // Out of boundary check
        if (item.y > height + 20) {
          items.splice(i, 1);
        }
      }

      if (!gameOver) {
        animationId = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, gameOver]);

  // Handle High Score writes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pb_arcade_high', score.toString());
    }
  }, [score, highScore]);

  return (
    <div ref={containerRef} className="w-full bg-[#020617] border border-white/10 rounded-3xl overflow-hidden p-6 space-y-6 shadow-2xl relative">
      <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-3">
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          SYS_ARCADE // ALGORITHM_DODGE
        </span>
        <span className="opacity-40">HI_SCORE: {highScore}</span>
      </div>

      {!isPlaying ? (
        <div className="h-[250px] flex flex-col justify-center items-center text-center space-y-4 font-mono">
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Catch the falling green **data technologies** to scale your score. Dodge the red **runtime bugs** to preserve system health!
          </p>
          <button 
            onClick={startGame}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-full hover:scale-105 transition-transform cursor-pointer focus:outline-none"
          >
            LAUNCH COMPILER GAME
          </button>
        </div>
      ) : gameOver ? (
        <div className="h-[250px] flex flex-col justify-center items-center text-center space-y-4 font-mono">
          <h4 className="text-red-400 font-bold text-lg">SYSTEM FAILURE // GAME OVER</h4>
          <p className="text-xs text-slate-400">
            Final compiled score: <span className="text-emerald-400 font-bold">{score}</span>
          </p>
          <button 
            onClick={startGame}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-full hover:scale-105 transition-transform cursor-pointer focus:outline-none"
          >
            RECOMPILE / PLAY AGAIN
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="opacity-60">HEALTH:</span>
              <div className="w-32 h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>
            <span className="text-emerald-400 font-bold">SCORE: {score}</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#020617] cursor-crosshair">
            <canvas ref={canvasRef} className="w-full block" />
          </div>
        </div>
      )}
    </div>
  );
}
