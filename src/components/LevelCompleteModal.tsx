/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Modal } from './Modal';
import { Star, Award, RotateCcw, ArrowRight, Grid } from 'lucide-react';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelId: number;
  levelTitle: string;
  scoreGained: number;
  totalLevelScore: number;
  stars: number;
  badgeUnlockedTitle?: string;
  onReplay: () => void;
  onNextLevel: () => void;
  onSelectLevel: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  levelId,
  levelTitle,
  scoreGained,
  totalLevelScore,
  stars,
  badgeUnlockedTitle,
  onReplay,
  onNextLevel,
  onSelectLevel,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      speech.speak(
        `Luar biasa! Kamu berhasil menuntaskan ${levelTitle} dengan perolehan ${stars} bintang dan skor ${scoreGained} poin.`
      );
    }
  }, [isOpen, levelTitle, stars, scoreGained]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onSelectLevel}
      title="MISI SELESAI: PENCAPAIAN TERCATAT!"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 text-center">
        {/* Bintang Penghargaan */}
        <div className="flex justify-center items-center gap-4 py-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`transition-all transform ${
                s <= stars
                  ? 'text-amber-400 scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce'
                  : 'text-slate-700 scale-90'
              }`}
              style={{ animationDelay: `${s * 0.15}s`, animationIterationCount: 2 }}
            >
              <Star className="w-16 h-16 fill-current" />
            </div>
          ))}
        </div>

        <div>
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">
            LEVEL {levelId} TUNTAS
          </span>
          <h3 className="text-2xl font-black text-white mt-1">{levelTitle}</h3>
        </div>

        {/* Skor Box */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Poin Sesi Ini</span>
            <span className="text-3xl font-mono font-black text-cyan-400">+{scoreGained}</span>
          </div>
          <div className="border-l border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Skor Akumulasi</span>
            <span className="text-3xl font-mono font-black text-amber-400">{totalLevelScore}</span>
          </div>
        </div>

        {/* Lencana Baru Terbuka */}
        {badgeUnlockedTitle && (
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 p-4 rounded-2xl border border-amber-500/40 flex items-center justify-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400">
              <Award className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                LENCANA PRESTASI BARU DIBUKA!
              </span>
              <h4 className="font-bold text-white text-sm">{badgeUnlockedTitle}</h4>
            </div>
          </div>
        )}

        {/* Navigasi Aksi IFP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onReplay();
            }}
            className="py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> MAIN LAGI
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectLevel();
            }}
            className="py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-cyan-500/30 active:scale-95 transition-all"
          >
            <Grid className="w-4 h-4" /> PILIH LEVEL
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNextLevel();
            }}
            className="py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
          >
            <span>{levelId < 9 ? 'LEVEL BERIKUT' : 'MENU UTAMA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
