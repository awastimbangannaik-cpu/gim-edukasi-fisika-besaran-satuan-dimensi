/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Modal } from './Modal';
import { CheckCircle2, AlertTriangle, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { speech } from '../utils/speech';
import { sound } from '../utils/audio';

interface DiscussionModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  title: string;
  explanation: string;
  conceptNote?: string;
  onNext: () => void;
  onRetry?: () => void;
  nextButtonLabel?: string;
}

export const DiscussionModal: React.FC<DiscussionModalProps> = ({
  isOpen,
  isCorrect,
  title,
  explanation,
  conceptNote,
  onNext,
  onRetry,
  nextButtonLabel = 'LANJUTKAN MISI',
}) => {
  useEffect(() => {
    if (isOpen) {
      if (isCorrect) {
        sound.playCorrect();
        speech.speak(`Hebat! Jawabanmu tepat. ${explanation}`);
      } else {
        sound.playIncorrect();
        speech.speak(`Belum tepat! Mari kita pelajari alasannya. ${explanation}`);
      }
    }
  }, [isOpen, isCorrect, explanation]);

  const readExplanation = () => {
    sound.playClick();
    speech.speak(explanation);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onNext}
      title={isCorrect ? 'ANALISIS ILMIAH: TEPAT!' : 'ANALISIS ILMIAH: EVALUASI KONSEP'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Banner Status */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-4 ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="font-black text-lg text-white">{title}</h3>
            <p className="text-xs opacity-90">
              {isCorrect
                ? 'Analisis fisikamu terbukti akurat dan sesuai prinsip ilmiah.'
                : 'Jangan berkecil hati, ilmuwan selalu belajar dari evaluasi eksperimen.'}
            </p>
          </div>
        </div>

        {/* Isi Pembahasan Ilmiah */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              PEMBAHASAN KONSEP FISIKA
            </span>
            <button
              onClick={readExplanation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold border border-cyan-500/30 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4" /> BACA PEMBAHASAN
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {explanation}
          </p>

          {conceptNote && (
            <div className="mt-3 p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30">
              <span className="text-[11px] font-bold text-cyan-400 block mb-0.5">
                KATA KUNCI MATERI:
              </span>
              <p className="text-xs text-slate-300 italic">{conceptNote}</p>
            </div>
          )}
        </div>

        {/* Tombol Aksi IFP */}
        <div className="flex items-center gap-3">
          {!isCorrect && onRetry && (
            <button
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 border border-slate-600 active:scale-98 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> COBA LAGI
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onNext();
            }}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-98 transition-all"
          >
            <span>{nextButtonLabel}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
