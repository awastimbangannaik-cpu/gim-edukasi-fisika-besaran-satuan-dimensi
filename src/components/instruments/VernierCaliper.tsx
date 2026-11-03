/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { ZoomIn, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface VernierCaliperProps {
  targetMm: number; // Nilai target yang harus diukur/dicocokkan
  interactive?: boolean;
  onMeasureChange?: (measuredMm: number) => void;
  showObject?: boolean;
}

export const VernierCaliper: React.FC<VernierCaliperProps> = ({
  targetMm,
  interactive = true,
  onMeasureChange,
  showObject = true,
}) => {
  // Posisi nonius dalam mm (skala 0.05 mm ketelitian, misal 24.35 mm)
  const [sliderMm, setSliderMm] = useState<number>(targetMm > 0 ? targetMm : 0);
  const [isZoomed, setIsZoomed] = useState<boolean>(true);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startMm = useRef<number>(0);

  // 1 mm = 12 pixels pada visual scale
  const pxPerMm = 12;

  useEffect(() => {
    if (targetMm > 0) {
      setSliderMm(targetMm);
    }
  }, [targetMm]);

  const updatePosition = useCallback((newMm: number) => {
    const clamped = Math.max(0, Math.min(80, Math.round(newMm * 20) / 20)); // kelipatan 0.05 mm
    setSliderMm(clamped);
    sound.playTick();
    onMeasureChange?.(clamped);
  }, [onMeasureChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    startX.current = e.clientX;
    startMm.current = sliderMm;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !interactive) return;
    const deltaPx = e.clientX - startX.current;
    const deltaMm = deltaPx / pxPerMm;
    updatePosition(startMm.current + deltaMm);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Perhitungan ilmiah akurat:
  // Skala Utama: integer mm (misal 24 mm)
  // Sisa nonius: (sliderMm - skalaUtama) dalam kelipatan 0.05 mm (0 to 19 garis)
  const mainScaleVal = Math.floor(sliderMm);
  const noniusDivisions = Math.round((sliderMm - mainScaleVal) / 0.05);
  const noniusFraction = (noniusDivisions * 0.05).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center select-none bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/30">
      <div className="w-full flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold text-sm tracking-widest bg-cyan-950/80 px-3 py-1 rounded-md border border-cyan-500/40">
            SIMULASI JANGKA SORONG DIGITAL (KETELITIAN 0,05 mm)
          </span>
          <span className="text-xs text-slate-400">
            Skala Utama: {mainScaleVal} mm | Skala Nonius: Ke-{noniusDivisions} ({noniusFraction} mm)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
            {isZoomed ? 'Kaca Pembesar Aktif' : 'Perbesar Skala'}
          </button>
        </div>
      </div>

      {/* Area visual interaktif Jangka Sorong */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-cyan-500/20 py-6 px-4">
        <svg
          viewBox="0 0 1100 240"
          className="w-full h-44 drop-shadow-lg"
          style={{ touchAction: 'none' }}
        >
          <defs>
            {/* Gradien logam rahang jangka sorong */}
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="sliderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="objectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Batang Utama (Main Beam) */}
          <rect x="70" y="70" width="1020" height="50" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1.5" rx="3" />

          {/* Rahang Tetap Bawah */}
          <path
            d="M 70 70 L 70 210 L 100 210 L 100 120 L 140 120 L 140 70 Z"
            fill="url(#metalGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Rahang Tetap Atas (Pengukur dalam) */}
          <path
            d="M 70 70 L 70 10 L 95 10 L 100 70 Z"
            fill="url(#metalGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Garis-garis Skala Utama (0 sampai 75 mm) */}
          {Array.from({ length: 76 }).map((_, i) => {
            const x = 100 + i * pxPerMm;
            const isCm = i % 10 === 0;
            const isHalfCm = i % 5 === 0 && !isCm;
            const y1 = 120;
            const y2 = isCm ? 95 : isHalfCm ? 104 : 110;
            return (
              <g key={`main-${i}`}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke="#0f172a" strokeWidth={isCm ? 2 : 1} />
                {isCm && (
                  <text
                    x={x}
                    y={90}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {i / 10}
                  </text>
                )}
              </g>
            );
          })}
          <text x="1010" y="90" fill="#1e293b" fontSize="12" fontWeight="bold">cm</text>

          {/* Benda yang sedang diukur (terletak di antara rahang tetap dan rahang geser) */}
          {showObject && sliderMm > 0 && (
            <g>
              <rect
                x="100"
                y="140"
                width={Math.max(2, sliderMm * pxPerMm)}
                height="50"
                fill="url(#objectGrad)"
                stroke="#b45309"
                strokeWidth="2"
                rx="4"
              />
              <text
                x={100 + (sliderMm * pxPerMm) / 2}
                y="170"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
              >
                Benda Uji
              </text>
            </g>
          )}

          {/* Rahang Geser (Movable Vernier Jaw) yang bergerak sepanjang X */}
          <g
            transform={`translate(${sliderMm * pxPerMm}, 0)`}
            className={interactive ? 'cursor-ew-resize' : ''}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Frame Rahang Geser */}
            <path
              d="M 100 60 L 100 210 L 125 210 L 135 140 L 328 140 L 328 60 Z"
              fill="url(#metalGrad)"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Rahang Geser Atas */}
            <path
              d="M 100 60 L 100 10 L 122 10 L 130 60 Z"
              fill="url(#metalGrad)"
              stroke="#0284c7"
              strokeWidth="1.5"
            />

            {/* Jendela Skala Nonius Transparan */}
            <rect
              x="100"
              y="68"
              width="228"
              height="55"
              fill="url(#sliderGrad)"
              stroke="#0284c7"
              strokeWidth="1"
            />

            {/* Skala Nonius: 20 skala = 39 mm (panjang 1 skala nonius = 1.95 mm visual skala) */}
            {Array.from({ length: 21 }).map((_, j) => {
              // 20 pembagian nonius = 19 divisi skala utama (masing-masing 0.05 mm per divisi)
              const nx = 100 + j * (pxPerMm * 0.95);
              const isMajor = j % 2 === 0;
              const ny1 = 70;
              const ny2 = isMajor ? 88 : 80;
              return (
                <g key={`nonius-${j}`}>
                  <line x1={nx} y1={ny1} x2={nx} y2={ny2} stroke="#0369a1" strokeWidth={isMajor ? 2 : 1.2} />
                  {isMajor && (
                    <text
                      x={nx}
                      y={98}
                      textAnchor="middle"
                      fill="#0284c7"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {j / 2}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Pegangan Sentuh / Thumb Grip */}
            <rect x="290" y="150" width="30" height="45" rx="5" fill="#0284c7" />
            <line x1="298" y1="160" x2="298" y2="185" stroke="#ffffff" strokeWidth="2" />
            <line x1="305" y1="160" x2="305" y2="185" stroke="#ffffff" strokeWidth="2" />
            <line x1="312" y1="160" x2="312" y2="185" stroke="#ffffff" strokeWidth="2" />
            <text x="305" y="210" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">GESER</text>
          </g>
        </svg>

        {/* Kaca Pembesar (Magnifier Window) untuk IFP Classroom Viewing */}
        {isZoomed && (
          <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <ZoomIn className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Kaca Pembesar Titik Skala Garis</p>
                <p className="text-sm text-slate-200">
                  Amati angka nol nonius berada di <strong className="text-yellow-400">{mainScaleVal} mm</strong>, lalu cari garis nonius yang paling lurus sejajar: <strong className="text-cyan-400">ke-{noniusDivisions} ({noniusFraction} mm)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Pengukuran:</span>
                <span className="text-xl font-mono font-black text-cyan-400">
                  {sliderMm.toFixed(2)} mm
                </span>
                <span className="text-xs text-slate-400 ml-1">({(sliderMm / 10).toFixed(3)} cm)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kontrol Sentuh Besar Ramah IFP 75 Inci */}
      {interactive && (
        <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={() => updatePosition(sliderMm - 1)}
            className="px-5 py-3 min-w-[70px] bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-white font-bold rounded-xl border border-cyan-500/30 text-base flex items-center justify-center gap-1 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> -1 mm
          </button>
          <button
            onClick={() => updatePosition(sliderMm - 0.05)}
            className="px-5 py-3 min-w-[80px] bg-cyan-900/60 hover:bg-cyan-800 active:bg-cyan-600 text-cyan-200 font-bold rounded-xl border border-cyan-400/50 text-base flex items-center justify-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> -0,05 mm
          </button>

          <div className="px-6 py-3 bg-slate-900 rounded-xl border border-cyan-500/50 flex items-center gap-2">
            <span className="text-xs text-slate-400">Geser Rahang:</span>
            <input
              type="range"
              min="0"
              max="60"
              step="0.05"
              value={sliderMm}
              onChange={(e) => updatePosition(parseFloat(e.target.value))}
              className="w-44 accent-cyan-400 h-3 cursor-pointer"
            />
          </div>

          <button
            onClick={() => updatePosition(sliderMm + 0.05)}
            className="px-5 py-3 min-w-[80px] bg-cyan-900/60 hover:bg-cyan-800 active:bg-cyan-600 text-cyan-200 font-bold rounded-xl border border-cyan-400/50 text-base flex items-center justify-center gap-1 transition-all"
          >
            +0,05 mm <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => updatePosition(sliderMm + 1)}
            className="px-5 py-3 min-w-[70px] bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-white font-bold rounded-xl border border-cyan-500/30 text-base flex items-center justify-center gap-1 transition-all"
          >
            +1 mm <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => updatePosition(0)}
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
