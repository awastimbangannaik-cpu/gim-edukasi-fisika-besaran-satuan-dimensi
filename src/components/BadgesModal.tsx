/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from './Modal';
import { Badge } from '../types';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, badges }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="RUANG PENGHARGAAN & LENCANA ILMUWAN" maxWidth="max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-slate-300">
            Kumpulkan seluruh 6 lencana kehormatan dengan menuntaskan misi fisika besaran, satuan, dan dimensi!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                b.unlocked
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  b.unlocked
                    ? 'bg-amber-500/20 text-amber-400 border-amber-400 shadow-md shadow-amber-400/30'
                    : 'bg-slate-900 text-slate-600 border-slate-700'
                }`}
              >
                {b.unlocked ? <Award className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">{b.title}</h4>
                  {b.unlocked && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" /> TERCAPAI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-snug">{b.description}</p>
                <span className="text-[11px] text-amber-400/80 block mt-1 font-mono font-medium">
                  Syarat: {b.criteria}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-sm border border-slate-700 active:scale-98 transition-all"
        >
          KEMBALI KE PERMAINAN
        </button>
      </div>
    </Modal>
  );
};
