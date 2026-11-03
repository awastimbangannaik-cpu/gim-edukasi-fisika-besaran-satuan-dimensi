/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from './Modal';
import { Tv, Touchpad, HelpCircle, Eye, Wrench, BrainCircuit, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PANDUAN PEMBELAJARAN & PENGGUNAAN IFP 75 INCI" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Intro IFP */}
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/60 p-4 rounded-2xl border border-cyan-500/30 flex items-start gap-4">
          <div className="p-3 bg-cyan-500/20 text-cyan-300 rounded-2xl border border-cyan-400 shrink-0">
            <Tv className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Dioptimalkan Khusus untuk Interactive Flat Panel (IFP) Hisense 75 Inci
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Game ini berjalan pada tata letak <strong>Single-Screen Fixed Layout (16:9)</strong> tanpa scrolling. Seluruh tombol, tuas geser, instrumen, dan teks berukuran besar sehingga sangat nyaman disentuh dengan jari maupun stylus oleh murid dan guru di depan kelas.
            </p>
          </div>
        </div>

        {/* 3 Tahapan Pembelajaran */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> 3 Tahapan Pembelajaran Fisika Fase E
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/20">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 font-black">
                1
              </div>
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <Eye className="w-4 h-4 text-cyan-400" /> TAHAP MENGANALISIS
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Amati fenomena visual, animasi gerak, skala alat ukur, atau tabel data. Temukan pola dan besaran fisis yang mendasarinya.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-blue-500/20">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 font-black">
                2
              </div>
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <Wrench className="w-4 h-4 text-blue-400" /> TAHAP MENGAPLIKASI
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lakukan interaksi langsung: geser jangka sorong, putar bidal mikrometer, pasangkan kartu SI, atau rakit formula lambang dimensi.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-purple-500/20">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 font-black">
                3
              </div>
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                <BrainCircuit className="w-4 h-4 text-purple-400" /> TAHAP MEREFLEKSI
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluasi konsep fisis yang telah diterapkan, kenali potensi kesalahan berpikir (miskonsepsi), dan perkuat pemahaman ilmiah.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Navigasi IFP */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Touchpad className="w-4 h-4 text-cyan-400" /> Tips Interaksi Layar Sentuh
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Tekan tombol <strong>LAYAR PENUH</strong> di kanan atas untuk pengalaman visual terbaik di IFP.</li>
            <li>Gunakan tombol <strong>Ulangi Narator</strong> (ikon putar) agar narator membacakan kembali soal atau petunjuk tantangan.</li>
            <li>Semua 9 level <strong>LANGSUNG TERBUKA</strong> dan dapat dimainkan secara bebas kapan saja untuk kebutuhan materi guru.</li>
            <li>Pada Jangka Sorong dan Mikrometer Sekrup, gunakan tombol mikro-step (<strong>+0,05 mm</strong> / <strong>+0,01 mm</strong>) untuk akurasi presisi tinggi.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-2xl text-base shadow-lg shadow-cyan-600/30 active:scale-98 transition-all"
        >
          SAYA MENGERTI, AYO MULAI BELAJAR!
        </button>
      </div>
    </Modal>
  );
};
