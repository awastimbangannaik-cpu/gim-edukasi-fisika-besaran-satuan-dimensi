/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface StopwatchAnalogProps {
  onTimeUpdate?: (seconds: number) => void;
}

export const StopwatchAnalog: React.FC<StopwatchAnalogProps> = ({ onTimeUpdate }) => {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      timerRef.current = window.setInterval(() => {
        const now = performance.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;
        setElapsedMs((prev) => {
          const next = prev + delta;
          onTimeUpdate?.(next / 1000);
          return next;
        });
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onTimeUpdate]);

  const toggleRun = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const reset = () => {
    sound.playClick();
    setIsRunning(false);
    setElapsedMs(0);
    onTimeUpdate?.(0);
  };

  const totalSeconds = elapsedMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes % 30) / 30) * 360;

  return (
    <div className="flex flex-col items-center p-3 bg-slate-950/80 rounded-2xl border border-cyan-500/30">
      <div className="relative w-48 h-48 my-2">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
          {/* Casing Stopwatch */}
          <circle cx="100" cy="100" r="95" fill="#0f172a" stroke="#0284c7" strokeWidth="4" />
          <circle cx="100" cy="100" r="86" fill="#1e293b" stroke="#334155" strokeWidth="2" />

          {/* Tombol Atas Crown */}
          <rect x="92" y="0" width="16" height="10" fill="#64748b" rx="2" />

          {/* Garis Skala Detik (60 tanda) */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 * Math.PI) / 180;
            const is5 = i % 5 === 0;
            const r1 = 84;
            const r2 = is5 ? 72 : 78;
            const x1 = 100 + r1 * Math.sin(angle);
            const y1 = 100 - r1 * Math.cos(angle);
            const x2 = 100 + r2 * Math.sin(angle);
            const y2 = 100 - r2 * Math.cos(angle);

            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={is5 ? '#38bdf8' : '#64748b'} strokeWidth={is5 ? 2 : 1} />
                {is5 && (
                  <text
                    x={100 + 64 * Math.sin(angle)}
                    y={100 - 64 * Math.cos(angle) + 4}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {i === 0 ? 60 : i}
                  </text>
                )}
              </g>
            );
          })}

          {/* Jarum Menit Kecil (Dial Atas) */}
          <circle cx="100" cy="65" r="20" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <line
            x1="100"
            y1="65"
            x2={100 + 14 * Math.sin((minuteAngle * Math.PI) / 180)}
            y2={65 - 14 * Math.cos((minuteAngle * Math.PI) / 180)}
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* Jarum Detik Utama */}
          <line
            x1="100"
            y1="100"
            x2={100 + 68 * Math.sin((secondAngle * Math.PI) / 180)}
            y2={100 - 68 * Math.cos((secondAngle * Math.PI) / 180)}
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="#f43f5e" />
        </svg>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl font-mono font-black text-cyan-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">
          {String(minutes).padStart(2, '0')}:{seconds.toFixed(2).padStart(5, '0')} s
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleRun}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Jeda' : 'Mulai'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-sm flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
};
