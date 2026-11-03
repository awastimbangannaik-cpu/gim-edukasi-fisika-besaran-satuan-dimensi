/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';

export interface ReflectionOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

interface ReflectionModalProps {
  isOpen: boolean;
  questionPrompt: string;
  options: ReflectionOption[];
  onCompleteReflection: (selectedCorrect: boolean) => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  questionPrompt,
  options,
  onCompleteReflection,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(null);
      setHasSubmitted(false);
      speech.speak(`Tahap Merefleksi. ${questionPrompt}`);
    }
  }, [isOpen, questionPrompt]);

  const handleSelect = (idx: number) => {
    sound.playClick();
    setSelectedIndex(idx);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    const chosen = options[selectedIndex];
    setHasSubmitted(true);
    if (chosen.isCorrect) {
      sound.playCorrect();
      speech.speak(`Refleksi tepat! ${chosen.feedback}`);
    } else {
      sound.playIncorrect();
      speech.speak(`Mari telaah kembali. ${chosen.feedback}`);
    }
  };

  const handleFinish = () => {
    if (selectedIndex === null) return;
    sound.playClick();
    onCompleteReflection(options[selectedIndex].isCorrect);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="TAHAP 3: MEREFLEKSI PEMAHAMAN KONSEP"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Header Tahap Refleksi */}
        <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 p-4 rounded-2xl border border-purple-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-400">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest block">
                EVALUASI METAKOGNITIF FISIKA
              </span>
              <h3 className="font-bold text-white text-base">
                Refleksi Pemikiran & Pencegahan Miskonsepsi
              </h3>
            </div>
          </div>
          <button
            onClick={() => speech.speak(questionPrompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/40"
          >
            <Volume2 className="w-4 h-4" /> BACA PERTANYAAN
          </button>
        </div>

        {/* Pertanyaan Refleksi */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-700">
          <p className="text-base text-slate-100 font-semibold leading-relaxed">
            {questionPrompt}
          </p>
        </div>

        {/* Pilihan Refleksi */}
        <div className="space-y-3">
          {options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            let itemStyle = 'bg-slate-900/90 border-slate-700 hover:border-purple-400 text-slate-200';
            if (hasSubmitted) {
              if (opt.isCorrect) {
                itemStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold';
              } else if (isSelected && !opt.isCorrect) {
                itemStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
              }
            } else if (isSelected) {
              itemStyle = 'bg-purple-950/80 border-purple-400 text-white font-bold shadow-lg shadow-purple-950/50';
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-4 transition-all active:scale-[0.99] ${itemStyle}`}
              >
                <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-slate-600">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-snug">{opt.text}</p>
                  {hasSubmitted && (isSelected || opt.isCorrect) && (
                    <p className="mt-2 text-xs italic opacity-95">
                      💡 {opt.feedback}
                    </p>
                  )}
                </div>
                {hasSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                {hasSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tombol Aksi */}
        <div className="pt-2">
          {!hasSubmitted ? (
            <button
              disabled={selectedIndex === null}
              onClick={handleSubmit}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-98 transition-all"
            >
              SIMPAN JAWABAN REFLEKSI
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
            >
              <span>LIHAT HASIL LEVEL & PENILAIAN</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
