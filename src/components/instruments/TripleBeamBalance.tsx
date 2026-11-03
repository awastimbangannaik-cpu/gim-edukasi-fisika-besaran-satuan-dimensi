/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Scale, Check } from 'lucide-react';

interface TripleBeamBalanceProps {
  targetMassG: number; // Nilai massa benda yang ditaruh di piringan
  onBalanced?: (isBalanced: boolean) => void;
}

export const TripleBeamBalance: React.FC<TripleBeamBalanceProps> = ({
  targetMassG,
  onBalanced,
}) => {
  // Lengan 1: Ratusan gram (0, 100, 200, 300, 400, 500)
  const [beam100, setBeam100] = useState<number>(0);
  // Lengan 2: Puluhan gram (0, 10, 20, ..., 100)
  const [beam10, setBeam10] = useState<number>(0);
  // Lengan 3: Satuan & desimal gram (0.0 sampai 10.0, step 0.1)
  const [beam1, setBeam1] = useState<number>(0);

  const totalReading = beam100 + beam10 + beam1;
  const difference = totalReading - targetMassG;
  const isBalanced = Math.abs(difference) <= 0.05;

  useEffect(() => {
    onBalanced?.(isBalanced);
  }, [isBalanced, onBalanced]);

  // Pointer angle (0 saat seimbang, miring ke bawah/atas saat tidak seimbang)
  const pointerAngle = Math.max(-20, Math.min(20, -difference * 3));

  return (
    <div className="w-full flex flex-col items-center select-none bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/30">
      <div className="w-full flex justify-between items-center mb-2 px-2">
        <span className="text-cyan-400 font-bold text-sm tracking-widest bg-cyan-950/80 px-3 py-1 rounded-md border border-cyan-500/40 flex items-center gap-2">
          <Scale className="w-4 h-4" />
          SIMULASI NERACA OHAUS TIGA LENGAN (KETELITIAN 0,1 g)
        </span>
        <div className="flex items-center gap-2">
          {isBalanced ? (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 animate-pulse">
              <Check className="w-4 h-4" /> SEIMBANG SEMPURNA
            </span>
          ) : (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-md text-xs font-semibold">
              Geser anting beban hingga jarum tepat di angka 0
            </span>
          )}
        </div>
      </div>

      {/* Visual Neraca Ohaus */}
      <div className="w-full bg-slate-900 rounded-xl border border-cyan-500/20 p-4">
        <svg viewBox="0 0 900 200" className="w-full h-44">
          {/* Dudukan Neraca (Base) */}
          <rect x="150" y="160" width="600" height="25" fill="#1e293b" rx="4" stroke="#475569" />
          {/* Tiang Penyangga Tengah (Pivot Fulcrum) */}
          <polygon points="320,160 300,70 340,70" fill="#334155" stroke="#64748b" />

          {/* Piringan Beban di Kiri */}
          <g>
            <line x1="220" y1="70" x2="220" y2="120" stroke="#94a3b8" strokeWidth="2" />
            <ellipse cx="220" cy="120" rx="45" ry="12" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
            {/* Benda misterius di piringan */}
            <rect x="200" y="80" width="40" height="36" fill="#f59e0b" stroke="#b45309" strokeWidth="2" rx="4" />
            <text x="220" y="102" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Benda</text>
          </g>

          {/* Batang 3 Lengan (Triple Beams) */}
          {/* Lengan Belakang: Ratusan (0 - 500 g) */}
          <rect x="290" y="55" width="480" height="12" fill="#475569" stroke="#94a3b8" />
          {/* Lengan Tengah: Puluhan (0 - 100 g) */}
          <rect x="290" y="75" width="480" height="12" fill="#334155" stroke="#94a3b8" />
          {/* Lengan Depan: Satuan (0 - 10 g) */}
          <rect x="290" y="95" width="480" height="12" fill="#1e293b" stroke="#94a3b8" />

          {/* Jarum Penunjuk Seimbang di Ujung Kanan */}
          <g transform={`translate(770, 85) rotate(${pointerAngle})`}>
            <line x1="0" y1="0" x2="60" y2="0" stroke="#f43f5e" strokeWidth="3" />
            <circle cx="60" cy="0" r="3" fill="#f43f5e" />
          </g>
          {/* Skala Nol Penyeimbang */}
          <g transform="translate(830, 85)">
            <line x1="0" y1="-25" x2="0" y2="25" stroke="#475569" strokeWidth="2" />
            <line x1="0" y1="0" x2="10" y2="0" stroke="#10b981" strokeWidth="3" />
            <text x="14" y="4" fill="#10b981" fontSize="12" fontWeight="bold">0</text>
          </g>
        </svg>

        {/* Panel Kontrol 3 Lengan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {/* Lengan 1: 100 gram */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-700">
            <span className="text-xs text-cyan-400 font-bold block mb-1">Lengan Belakang (Ratusan Gram):</span>
            <div className="flex items-center justify-between">
              {[0, 100, 200, 300, 400, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setBeam100(val);
                    sound.playTick();
                  }}
                  className={`px-2 py-2 text-xs font-bold rounded-lg transition-all ${
                    beam100 === val
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val}g
                </button>
              ))}
            </div>
          </div>

          {/* Lengan 2: 10 gram */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-700">
            <span className="text-xs text-blue-400 font-bold block mb-1">Lengan Tengah (Puluhan Gram):</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setBeam10(val);
                    sound.playTick();
                  }}
                  className={`px-2 py-2 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    beam10 === val
                      ? 'bg-blue-500 text-slate-950 font-black shadow-lg shadow-blue-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val}g
                </button>
              ))}
            </div>
          </div>

          {/* Lengan 3: Satuan 0-10 g (step 0.1) */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-purple-400 font-bold">Lengan Depan (0,0 - 10,0 g):</span>
              <span className="text-xs font-mono text-purple-300 font-bold">{beam1.toFixed(1)} g</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={beam1}
              onChange={(e) => {
                setBeam1(parseFloat(e.target.value));
                sound.playTick();
              }}
              className="w-full accent-purple-400 h-3 cursor-pointer"
            />
          </div>
        </div>

        {/* Rekap Total Bacaan */}
        <div className="mt-3 flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-xl border border-cyan-500/30">
          <span className="text-sm text-slate-300">
            Perhitungan: {beam100} g + {beam10} g + {beam1.toFixed(1)} g
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Terbaca:</span>
            <span className="text-2xl font-mono font-black text-cyan-400">
              {totalReading.toFixed(1)} g
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
