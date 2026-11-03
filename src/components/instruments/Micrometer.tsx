/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { sound } from '../../utils/audio';
import { ZoomIn, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface MicrometerProps {
  targetMm: number;
  interactive?: boolean;
  onMeasureChange?: (measuredMm: number) => void;
}

export const Micrometer: React.FC<MicrometerProps> = ({
  targetMm,
  interactive = true,
  onMeasureChange,
}) => {
  // Nilai pengukuran dalam mm (misal 5.78 mm)
  const [valMm, setValMm] = useState<number>(targetMm > 0 ? targetMm : 0);
  const [isZoomed, setIsZoomed] = useState<boolean>(true);

  useEffect(() => {
    if (targetMm > 0) {
      setValMm(targetMm);
    }
  }, [targetMm]);

  const updateVal = useCallback((newVal: number) => {
    const clamped = Math.max(0, Math.min(25, Math.round(newVal * 100) / 100)); // kelipatan 0.01 mm
    setValMm(clamped);
    sound.playTick();
    onMeasureChange?.(clamped);
  }, [onMeasureChange]);

  // Perhitungan Fisika:
  // Skala Utama Sleeve:
  // - Garis atas: integer mm (0, 1, 2, 3, ...)
  // - Garis bawah: 0.5 mm
  const intMm = Math.floor(valMm);
  const hasHalfMm = (valMm - intMm) >= 0.5;
  const sleeveDisplay = intMm + (hasHalfMm ? 0.5 : 0);
  // Skala Nonius Thimble (0 - 49):
  const thimbleDivisions = Math.round(((valMm - sleeveDisplay) * 100)) % 50;
  const thimbleMm = (thimbleDivisions * 0.01).toFixed(2);

  // Posisi visual pergeseran thimble (1 mm = 16px)
  const pxPerMm = 16;
  const thimbleOffset = valMm * pxPerMm;

  return (
    <div className="w-full flex flex-col items-center select-none bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/30">
      <div className="w-full flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold text-sm tracking-widest bg-cyan-950/80 px-3 py-1 rounded-md border border-cyan-500/40">
            SIMULASI MIKROMETER SEKRUP DIGITAL (KETELITIAN 0,01 mm)
          </span>
          <span className="text-xs text-slate-400">
            Skala Utama: {sleeveDisplay.toFixed(1)} mm | Skala Putar: Ke-{thimbleDivisions} ({thimbleMm} mm)
          </span>
        </div>
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
          {isZoomed ? 'Kaca Pembesar Aktif' : 'Perbesar Skala'}
        </button>
      </div>

      <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-cyan-500/20 py-4 px-2">
        <svg viewBox="0 0 950 250" className="w-full h-48 drop-shadow-xl">
          <defs>
            <linearGradient id="frameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#172554" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="steelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="thimbleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="30%" stopColor="#f1f5f9" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Bingkai U Mikrometer (C-Frame) */}
          <path
            d="M 120 125 C 120 220, 320 230, 420 180 C 470 150, 470 125, 470 125 L 430 125 C 430 145, 410 170, 380 185 C 300 215, 170 195, 160 125 Z"
            fill="url(#frameGrad)"
            stroke="#0284c7"
            strokeWidth="3"
          />
          <text x="270" y="200" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle" opacity="0.8">
            0 - 25 mm / 0,01 mm
          </text>

          {/* Landasan Tetap (Anvil) di kiri */}
          <rect x="120" y="110" width="20" height="30" fill="url(#steelGrad)" stroke="#1e293b" />

          {/* Benda yang diukur di antara landasan dan poros */}
          {valMm > 0 && (
            <g>
              <rect
                x="140"
                y="112"
                width={Math.max(2, valMm * pxPerMm)}
                height="26"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1.5"
                rx="2"
              />
            </g>
          )}

          {/* Poros Geser (Spindle) yang bergerak */}
          <rect
            x={140 + valMm * pxPerMm}
            y="115"
            width={340 - (140 + valMm * pxPerMm)}
            height="20"
            fill="url(#steelGrad)"
            stroke="#1e293b"
          />

          {/* Tabung Ukur Skala Utama (Sleeve/Barrel) */}
          <rect x="340" y="105" width="260" height="40" fill="url(#steelGrad)" stroke="#1e293b" strokeWidth="2" />
          {/* Garis Horizontal Referensi (Datum line) */}
          <line x1="340" y1="125" x2="600" y2="125" stroke="#0f172a" strokeWidth="2" />

          {/* Garis Skala Utama pada Sleeve: Atas (1 mm), Bawah (0.5 mm) */}
          {Array.from({ length: 26 }).map((_, i) => {
            const x = 360 + i * pxPerMm;
            const is5 = i % 5 === 0;
            return (
              <g key={`sleeve-${i}`}>
                {/* Garis atas (tiap 1 mm) */}
                <line x1={x} y1="125" x2={x} y2={is5 ? '110' : '116'} stroke="#0f172a" strokeWidth={is5 ? 2 : 1} />
                {is5 && (
                  <text x={x} y="102" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                    {i}
                  </text>
                )}
                {/* Garis bawah (tiap 0.5 mm) */}
                {i < 25 && (
                  <line
                    x1={x + pxPerMm / 2}
                    y1="125"
                    x2={x + pxPerMm / 2}
                    y2="135"
                    stroke="#0f172a"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* Bidal Pemutar (Thimble) yang bergeser ke kanan seiring penambahan nilai mm */}
          <g transform={`translate(${360 + thimbleOffset}, 0)`}>
            {/* Bevel thimble edge */}
            <path
              d="M 0 100 L 25 90 L 140 90 L 140 160 L 25 160 L 0 150 Z"
              fill="url(#thimbleGrad)"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Garis Skala Putar Nonius (50 divisi) */}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offset) => {
              const divNum = (thimbleDivisions - offset + 50) % 50;
              const y = 125 + offset * 6;
              const is5 = divNum % 5 === 0;
              return (
                <g key={`thimble-line-${offset}`}>
                  <line x1="0" y1={y} x2={is5 ? '18' : '10'} stroke="#0f172a" strokeWidth={is5 ? 2 : 1} />
                  {is5 && (
                    <text x="22" y={y + 3} fill="#0f172a" fontSize="9" fontWeight="bold">
                      {divNum}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Roda Pemutar Bergerigi (Ratchet stop di ujung) */}
            <rect x="140" y="105" width="40" height="40" rx="3" fill="#334155" stroke="#0284c7" />
            <line x1="150" y1="108" x2="150" y2="142" stroke="#64748b" strokeWidth="2" />
            <line x1="160" y1="108" x2="160" y2="142" stroke="#64748b" strokeWidth="2" />
            <line x1="170" y1="108" x2="170" y2="142" stroke="#64748b" strokeWidth="2" />
          </g>
        </svg>

        {/* Kaca Pembesar Skala Mikrometer */}
        {isZoomed && (
          <div className="mt-2 p-3 bg-slate-900/90 rounded-xl border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <ZoomIn className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Kaca Pembesar Pertemuan Skala</p>
                <p className="text-sm text-slate-200">
                  Skala Utama Sleeve: <strong className="text-yellow-400">{sleeveDisplay.toFixed(1)} mm</strong> + Skala Putar Thimble yang segaris datum: <strong className="text-cyan-400">ke-{thimbleDivisions} × 0,01 = {thimbleMm} mm</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Hasil Pengukuran:</span>
                <span className="text-xl font-mono font-black text-cyan-400">
                  {valMm.toFixed(2)} mm
                </span>
                <span className="text-xs text-slate-400 ml-1">({(valMm * 1000).toFixed(0)} µm)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kontrol Sentuh Besar */}
      {interactive && (
        <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={() => updateVal(valMm - 0.5)}
            className="px-4 py-3 min-w-[70px] bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-white font-bold rounded-xl border border-cyan-500/30 text-base flex items-center justify-center gap-1 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> -0,5 mm
          </button>
          <button
            onClick={() => updateVal(valMm - 0.01)}
            className="px-5 py-3 min-w-[80px] bg-cyan-900/60 hover:bg-cyan-800 active:bg-cyan-600 text-cyan-200 font-bold rounded-xl border border-cyan-400/50 text-base flex items-center justify-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> -0,01 mm
          </button>

          <div className="px-6 py-3 bg-slate-900 rounded-xl border border-cyan-500/50 flex items-center gap-2">
            <span className="text-xs text-slate-400">Putar Bidal:</span>
            <input
              type="range"
              min="0"
              max="15"
              step="0.01"
              value={valMm}
              onChange={(e) => updateVal(parseFloat(e.target.value))}
              className="w-44 accent-cyan-400 h-3 cursor-pointer"
            />
          </div>

          <button
            onClick={() => updateVal(valMm + 0.01)}
            className="px-5 py-3 min-w-[80px] bg-cyan-900/60 hover:bg-cyan-800 active:bg-cyan-600 text-cyan-200 font-bold rounded-xl border border-cyan-400/50 text-base flex items-center justify-center gap-1 transition-all"
          >
            +0,01 mm <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateVal(valMm + 0.5)}
            className="px-4 py-3 min-w-[70px] bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-white font-bold rounded-xl border border-cyan-500/30 text-base flex items-center justify-center gap-1 transition-all"
          >
            +0,5 mm <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => updateVal(0)}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-600 text-sm flex items-center gap-1"
            title="Reset ke Nol"
          >
            <RotateCcw className="w-4 h-4" /> Nol
          </button>
        </div>
      )}
    </div>
  );
};
