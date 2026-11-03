/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { LEVELS_CONFIG } from '../utils/storage';
import { LevelProgress } from '../types';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import {
  Search,
  Layers,
  CheckCircle2,
  Gauge,
  Repeat,
  Boxes,
  Calculator,
  Globe,
  Zap,
  Star,
  ArrowLeft,
  Unlock,
} from 'lucide-react';

interface LevelSelectMenuProps {
  progress: Record<number, LevelProgress>;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Search,
  Layers,
  CheckCircle2,
  Gauge,
  Repeat,
  Boxes,
  Calculator,
  Globe,
  Zap,
};

export const LevelSelectMenu: React.FC<LevelSelectMenuProps> = ({
  progress,
  onSelectLevel,
  onBack,
}) => {
  useEffect(() => {
    speech.speak(
      'Silakan pilih misi yang ingin kalian pelajari. Seluruh sembilan level telah terbuka penuh sejak awal untuk dieksplorasi!'
    );
  }, []);

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid cyber-vignette">
      {/* Header Level Select */}
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 active:scale-95 transition-all text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> KEMBALI KE BERANDA
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              PILIH MISI LABORATORIUM <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Unlock className="w-3 h-3" /> 9 LEVEL TERBUKA PENUH</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pilih materi Fisika yang ingin dipelajari atau diuji bersama di kelas
            </p>
          </div>
        </div>
      </div>

      {/* Grid 9 Kartu Level (Fit Single-Screen 16:9 IFP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 my-auto h-full max-h-[calc(100vh-170px)]">
        {LEVELS_CONFIG.map((lvl) => {
          const IconComp = ICON_MAP[lvl.icon] || Zap;
          const currentProg = progress[lvl.id] || { score: 0, stars: 0, completed: false };
          const isBoss = lvl.id === 9;

          return (
            <button
              key={lvl.id}
              onClick={() => {
                sound.playClick();
                onSelectLevel(lvl.id);
              }}
              className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] group overflow-hidden ${
                isBoss
                  ? 'bg-gradient-to-br from-orange-950/60 via-slate-900 to-red-950/40 border-orange-500/50 hover:border-orange-400 shadow-lg shadow-orange-950/50'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border-cyan-500/30 hover:border-cyan-400 shadow-md shadow-cyan-950/40'
              }`}
            >
              {/* Header Kartu */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${lvl.accentColor}20`,
                      borderColor: lvl.accentColor,
                      color: lvl.accentColor,
                    }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block mb-0.5"
                      style={{
                        backgroundColor: `${lvl.accentColor}30`,
                        color: lvl.accentColor,
                      }}
                    >
                      LEVEL {lvl.id}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                      {lvl.codename}
                    </h3>
                  </div>
                </div>

                {/* Bintang Perolehan */}
                <div className="flex items-center gap-0.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-700">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 ${
                        starIdx <= currentProg.stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Deskripsi Materi */}
              <div className="my-2">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {lvl.description}
                </p>
                <span className="text-[11px] font-mono font-medium text-cyan-400/90 block mt-1">
                  Materi: {lvl.topic}
                </span>
              </div>

              {/* Footer Kartu */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  Skor: <strong className="text-white font-mono">{currentProg.score}</strong>
                </span>
                <span
                  className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  style={{ color: lvl.accentColor }}
                >
                  MULAI MISI →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Petunjuk Bawah */}
      <div className="text-center shrink-0 pt-1">
        <p className="text-xs text-slate-400">
          Setiap level menguji 3 tahap: <strong className="text-cyan-300">Menganalisis</strong> ➔ <strong className="text-blue-300">Mengaplikasi</strong> ➔ <strong className="text-purple-300">Merefleksi</strong>
        </p>
      </div>
    </div>
  );
};
