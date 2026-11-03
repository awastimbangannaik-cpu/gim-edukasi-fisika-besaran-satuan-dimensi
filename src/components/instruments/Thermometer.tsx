/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { sound } from '../../utils/audio';

interface ThermometerProps {
  temperatureC: number;
  interactive?: boolean;
  onTempChange?: (tempC: number) => void;
}

export const Thermometer: React.FC<ThermometerProps> = ({
  temperatureC,
  interactive = false,
  onTempChange,
}) => {
  // Rentang -10 C sampai 110 C
  const clampedC = Math.max(-10, Math.min(110, temperatureC));
  const kelvin = (clampedC + 273.15).toFixed(1);

  // Tinggi kolom cairan merah (antara y=20 dan y=220, total range 200px untuk 120 C)
  const percent = (clampedC - (-10)) / 120;
  const mercuryTopY = 220 - percent * 190;

  return (
    <div className="flex flex-col items-center p-3 bg-slate-950/80 rounded-2xl border border-cyan-500/30">
      <div className="relative w-36 h-64">
        <svg viewBox="0 0 120 280" className="w-full h-full drop-shadow-xl">
          {/* Batang Kaca Termometer */}
          <rect x="50" y="20" width="20" height="210" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          {/* Bohlam Raksa Bawah */}
          <circle cx="60" cy="240" r="22" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />

          {/* Kolom Cairan Raksa Merah */}
          <rect
            x="56"
            y={mercuryTopY}
            width="8"
            height={240 - mercuryTopY}
            fill="#ef4444"
            rx="3"
          />

          {/* Garis Skala Celsius di Kiri (-10 s.d. 110 C) */}
          {[-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((t) => {
            const p = (t - (-10)) / 120;
            const y = 220 - p * 190;
            return (
              <g key={`c-${t}`}>
                <line x1="42" y1={y} x2="50" y2={y} stroke="#94a3b8" strokeWidth={t % 50 === 0 ? 2 : 1} />
                {t % 20 === 0 && (
                  <text x="38" y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    {t}°
                  </text>
                )}
              </g>
            );
          })}
          <text x="25" y="16" fill="#38bdf8" fontSize="9" fontWeight="bold">°C</text>

          {/* Garis Skala Kelvin di Kanan */}
          <text x="80" y="16" fill="#a855f7" fontSize="9" fontWeight="bold">K</text>
        </svg>
      </div>

      <div className="flex flex-col items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
        <span className="text-sm font-mono font-black text-rose-400">
          {clampedC.toFixed(1)} °C
        </span>
        <span className="text-xs text-purple-300 font-mono">
          = {kelvin} K (SI)
        </span>
      </div>

      {interactive && (
        <div className="mt-2 w-full">
          <input
            type="range"
            min="-10"
            max="110"
            step="1"
            value={clampedC}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onTempChange?.(val);
              sound.playTick();
            }}
            className="w-full accent-rose-500 h-2 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
