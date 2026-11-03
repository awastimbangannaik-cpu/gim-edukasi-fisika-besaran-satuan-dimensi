/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { DiscussionModal } from '../DiscussionModal';
import { ReflectionModal, ReflectionOption } from '../ReflectionModal';
import { LevelCompleteModal } from '../LevelCompleteModal';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Wrench,
  BrainCircuit,
  Volume2,
} from 'lucide-react';

interface Level2Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface ItemCard {
  id: string;
  name: string;
  type: 'base' | 'derived'; // 'base' = pokok, 'derived' = turunan
  unit: string;
  formulaHint: string;
}

const ITEMS: ItemCard[] = [
  { id: '1', name: 'Panjang', type: 'base', unit: 'meter (m)', formulaHint: 'Tunggal, tidak diturunkan dari besaran lain' },
  { id: '2', name: 'Kecepatan', type: 'derived', unit: 'm/s', formulaHint: 'v = jarak / waktu [L][T]⁻¹' },
  { id: '3', name: 'Massa', type: 'base', unit: 'kilogram (kg)', formulaHint: 'Tunggal, besaran pokok SI' },
  { id: '4', name: 'Gaya', type: 'derived', unit: 'Newton (kg·m/s²)', formulaHint: 'F = massa × percepatan' },
  { id: '5', name: 'Kuat Arus Listrik', type: 'base', unit: 'Ampere (A)', formulaHint: 'Tunggal, muatan per detik' },
  { id: '6', name: 'Tekanan', type: 'derived', unit: 'Pascal (N/m²)', formulaHint: 'P = gaya / luas' },
  { id: '7', name: 'Suhu Termodinamika', type: 'base', unit: 'Kelvin (K)', formulaHint: 'Tunggal, derajat termal molekul' },
  { id: '8', name: 'Massa Jenis', type: 'derived', unit: 'kg/m³', formulaHint: 'ρ = massa / volume' },
  { id: '9', name: 'Jumlah Zat', type: 'base', unit: 'mol', formulaHint: 'Tunggal, 6,022 × 10²³ partikel' },
  { id: '10', name: 'Usaha / Energi', type: 'derived', unit: 'Joule (N·m)', formulaHint: 'W = Gaya × perpindahan' },
];

const LEVEL_2_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Mengapa para ilmuwan dalam Konferensi Umum tentang Berat dan Pengukuran (CGPM) hanya menetapkan 7 besaran pokok dan tidak membuat 50 besaran pokok?',
  options: [
    {
      text: 'Karena 7 besaran pokok tersebut sudah cukup minimum, independen satu sama lain, dan dapat menurunkan seluruh ribuan besaran fisis lain di alam semesta secara konsisten.',
      isCorrect: true,
      feedback:
        'Sangat tepat! Prinsip kesederhanaan dan kebebasan independen: dengan hanya 7 pilar ini, setiap konsep dari mekanika hingga termodinamika dapat diturunkan secara logis.',
    },
    {
      text: 'Karena para ilmuwan zaman dulu belum menemukan alat ukur yang cukup canggih untuk mengukur besaran yang lain.',
      isCorrect: false,
      feedback:
        'Keliru. Ini bukan keterbatasan teknologi, melainkan keputusan konseptual agar sistem satuan bersifat minimum dan tidak berulang.',
    },
    {
      text: 'Karena hanya ada 7 negara pendiri yang berhak mengusulkan satu besaran pokok masing-masing.',
      isCorrect: false,
      feedback:
        'Salah. Pemilihan 7 besaran pokok didasarkan pada landasan sains fisika universal, bukan kuota negara.',
    },
  ],
};

export const Level2Detective: React.FC<Level2Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [activeItemIdx, setActiveItemIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [stage, setStage] = useState<'analyze' | 'apply' | 'reflect'>('analyze');

  // Chamber items grouped
  const [baseChamber, setBaseChamber] = useState<ItemCard[]>([]);
  const [derivedChamber, setDerivedChamber] = useState<ItemCard[]>([]);

  // Modals
  const [discussionOpen, setDiscussionOpen] = useState<boolean>(false);
  const [discussionData, setDiscussionData] = useState<{
    isCorrect: boolean;
    title: string;
    explanation: string;
    conceptNote: string;
  }>({ isCorrect: false, title: '', explanation: '', conceptNote: '' });

  const [reflectionOpen, setReflectionOpen] = useState<boolean>(false);
  const [completeOpen, setCompleteOpen] = useState<boolean>(false);

  const currentItem = ITEMS[activeItemIdx];

  useEffect(() => {
    speech.speak(
      'Level Dua: Detektif Besaran Pokok dan Turunan. Pindahkan kartu besaran fisis ke chamber yang tepat: Besaran Pokok atau Besaran Turunan.'
    );
  }, []);

  const handleClassify = (chosenType: 'base' | 'derived') => {
    sound.playClick();
    const isCorrect = currentItem.type === chosenType;
    const isBase = currentItem.type === 'base';

    if (isCorrect) {
      setScore((prev) => prev + 100);
      if (isBase) {
        setBaseChamber((prev) => [...prev, currentItem]);
      } else {
        setDerivedChamber((prev) => [...prev, currentItem]);
      }
    }

    setDiscussionData({
      isCorrect,
      title: isCorrect ? 'Klasifikasi Tepat!' : 'Perlu Evaluasi Klasifikasi',
      explanation: isBase
        ? `${currentItem.name} adalah Besaran Pokok! Besaran ini berdiri sendiri dan satuannya telah ditetapkan secara internasional (${currentItem.unit}).`
        : `${currentItem.name} adalah Besaran Turunan! Besaran ini disusun atau diturunkan dari besaran-besaran pokok melalui hubungan fisis (${currentItem.formulaHint}).`,
      conceptNote: `Karakteristik: ${currentItem.formulaHint}`,
    });
    setDiscussionOpen(true);
  };

  const handleNextItem = () => {
    setDiscussionOpen(false);
    if (activeItemIdx < ITEMS.length - 1) {
      setActiveItemIdx((prev) => prev + 1);
    } else {
      setStage('reflect');
      setReflectionOpen(true);
    }
  };

  const handleCompleteReflection = (isCorrect: boolean) => {
    setReflectionOpen(false);
    const finalScore = score + (isCorrect ? 100 : 0);
    const stars = finalScore >= 900 ? 3 : finalScore >= 600 ? 2 : 1;
    onComplete(finalScore, stars);
    setCompleteOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-md border border-blue-500/40">
            LEVEL 2: DETEKTIF BESARAN
          </span>
          <span className="text-xs text-slate-300">
            Kartu {activeItemIdx + 1} dari {ITEMS.length}
          </span>
        </div>

        {/* 3 Tahap Status */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'analyze'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 1. Menganalisis
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'apply'
                ? 'bg-blue-500 text-slate-950 font-black shadow-md shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> 2. Mengaplikasi
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'reflect'
                ? 'bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> 3. Merefleksi
          </span>
        </div>

        <button
          onClick={() =>
            speech.speak(
              `Kartu besaran: ${currentItem.name}. Satuan ${currentItem.unit}. Apakah ini besaran pokok atau besaran turunan?`
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA KARTU
        </button>
      </div>

      {/* Main Interactive Sorting Arena (Single-Screen Fit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Chamber Kiri: Besaran Pokok */}
        <div className="lg:col-span-4 bg-slate-950/80 rounded-3xl border-2 border-cyan-500/40 p-4 flex flex-col justify-between shadow-xl shadow-cyan-950/50">
          <div className="border-b border-cyan-500/20 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-black text-cyan-300 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> CHAMBER BESARAN POKOK
            </h3>
            <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/40 font-mono">
              {baseChamber.length} / 7
            </span>
          </div>

          <div className="flex-1 my-2 overflow-y-auto space-y-1.5 max-h-48">
            {baseChamber.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic text-center p-4">
                Pindahkan kartu besaran yang berdiri sendiri ke chamber ini.
              </div>
            ) : (
              baseChamber.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/30 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="font-mono text-cyan-400 text-[11px]">{item.unit}</span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => handleClassify('base')}
            className="w-full min-h-[64px] bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-sm rounded-2xl border border-cyan-300 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>MASUKKAN KE BESARAN POKOK</span>
          </button>
        </div>

        {/* Tengah: Kartu Aktif yang Sedang Diuji */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col items-center justify-between shadow-xl text-center">
          <div className="w-full border-b border-slate-800 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              KARTU BESARAN AKTIF
            </span>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-purple-500/30 animate-cyber-pulse">
              <Layers className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white">{currentItem.name}</h2>
            <div className="mt-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-amber-400">
              Satuan Standar: {currentItem.unit}
            </div>

            <p className="mt-3 text-xs text-slate-400 max-w-xs leading-relaxed">
              💡 Petunjuk: {currentItem.formulaHint}
            </p>
          </div>

          <div className="w-full text-xs text-slate-400 pt-2 border-t border-slate-800">
            Tekan salah satu tombol chamber di kiri atau kanan untuk menyortir.
          </div>
        </div>

        {/* Chamber Kanan: Besaran Turunan */}
        <div className="lg:col-span-4 bg-slate-950/80 rounded-3xl border-2 border-purple-500/40 p-4 flex flex-col justify-between shadow-xl shadow-purple-950/50">
          <div className="border-b border-purple-500/20 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-black text-purple-300 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> CHAMBER BESARAN TURUNAN
            </h3>
            <span className="text-xs bg-purple-950 text-purple-400 px-2 py-0.5 rounded border border-purple-500/40 font-mono">
              {derivedChamber.length} Item
            </span>
          </div>

          <div className="flex-1 my-2 overflow-y-auto space-y-1.5 max-h-48">
            {derivedChamber.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic text-center p-4">
                Pindahkan kartu besaran yang diturunkan dari besaran lain ke chamber ini.
              </div>
            ) : (
              derivedChamber.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-purple-950/40 rounded-xl border border-purple-500/30 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="font-mono text-purple-400 text-[11px]">{item.unit}</span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => handleClassify('derived')}
            className="w-full min-h-[64px] bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black text-sm rounded-2xl border border-purple-300 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>MASUKKAN KE BESARAN TURUNAN</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <DiscussionModal
        isOpen={discussionOpen}
        isCorrect={discussionData.isCorrect}
        title={discussionData.title}
        explanation={discussionData.explanation}
        conceptNote={discussionData.conceptNote}
        onNext={handleNextItem}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_2_REFLECTION.prompt}
        options={LEVEL_2_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={2}
        levelTitle="Level 2: Detektif Besaran Pokok & Turunan"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 900 ? 3 : score >= 600 ? 2 : 1}
        badgeUnlockedTitle="Pemilah Presisi"
        onReplay={() => {
          setCompleteOpen(false);
          setActiveItemIdx(0);
          setBaseChamber([]);
          setDerivedChamber([]);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
