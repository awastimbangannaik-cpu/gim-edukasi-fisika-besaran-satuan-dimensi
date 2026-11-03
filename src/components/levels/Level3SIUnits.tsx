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
import { CheckCircle2, Sparkles, Volume2, Eye, Wrench, BrainCircuit, Atom } from 'lucide-react';

interface Level3Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface SIPair {
  id: number;
  quantity: string;
  unit: string;
  symbol: string;
  standardFact: string;
}

const SI_STANDARDS: SIPair[] = [
  { id: 1, quantity: 'Panjang', unit: 'meter', symbol: 'm', standardFact: 'Jarak yang ditempuh cahaya dalam ruang hampa selama 1/299.792.458 sekon.' },
  { id: 2, quantity: 'Massa', unit: 'kilogram', symbol: 'kg', standardFact: 'Didefinisikan ulang pada 2019 menggunakan nilai tetap konstanta Planck h.' },
  { id: 3, quantity: 'Waktu', unit: 'sekon', symbol: 's', standardFact: 'Durasi 9.192.631.770 periode radiasi transisi hiperhalus atom Sesium-133.' },
  { id: 4, quantity: 'Kuat Arus Listrik', unit: 'Ampere', symbol: 'A', standardFact: 'Berdasarkan muatan elementer elektron e = 1,602176634 × 10⁻¹⁹ Coulomb.' },
  { id: 5, quantity: 'Suhu Termodinamika', unit: 'Kelvin', symbol: 'K', standardFact: 'Berdasarkan nilai tetap konstanta Boltzmann k = 1,380649 × 10⁻²³ J/K.' },
  { id: 6, quantity: 'Jumlah Zat', unit: 'mol', symbol: 'mol', standardFact: 'Tepat mengandung 6,02214076 × 10²³ partikel elementer (Konstanta Avogadro).' },
  { id: 7, quantity: 'Intensitas Cahaya', unit: 'candela', symbol: 'cd', standardFact: 'Intensitas pancaran sumber monokromatis berfrekuensi 540 × 10¹² Hz.' },
];

const LEVEL_3_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Mengapa dalam Sistem Internasional (SI) satuan baku untuk suhu adalah Kelvin (K), bukan derajat Celsius (°C) yang umum kita jumpai sehari-hari?',
  options: [
    {
      text: 'Karena skala Kelvin memiliki titik nol mutlak (0 K) di mana energi kinetik partikel materi mencapai titik minimum teoritis, tanpa nilai suhu negatif semu.',
      isCorrect: true,
      feedback:
        'Tepat sekali! Nol mutlak 0 K (-273,15 °C) adalah batas fisis alam semesta di mana gerakan termal molekul terhenti. Ini membuat perumusan termodinamika seperti hukum gas ideal PV = nRT bekerja secara konsisten.',
    },
    {
      text: 'Karena derajat Celsius hanya diakui di benua Eropa dan tidak berlaku di laboratorium internasional.',
      isCorrect: false,
      feedback:
        'Keliru. Celsius diakui secara global, namun 0 °C hanyalah titik beku air pada tekanan 1 atmosfer, bukan batas fisis mutlak alam semesta.',
    },
    {
      text: 'Karena termometer raksa tidak bisa membaca angka Celsius pada suhu tinggi.',
      isCorrect: false,
      feedback:
        'Salah. Ini berkaitan dengan definisi fundamental termodinamika, bukan jenis cairan dalam termometer.',
    },
  ],
};

export const Level3SIUnits: React.FC<Level3Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [stage, setStage] = useState<'analyze' | 'apply' | 'reflect'>('analyze');

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

  const currentPair = SI_STANDARDS[currentIdx];

  // Options for unit & symbol (including decoys)
  const allUnits = ['meter', 'kilogram', 'sekon', 'Ampere', 'Kelvin', 'mol', 'candela', 'gram', 'Joule', 'Celsius'];
  const allSymbols = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd', 'g', 'J', '°C'];

  useEffect(() => {
    speech.speak(
      `Level Tiga: Laboratorium Satuan SI. Pasangkan besaran pokok ${currentPair.quantity} dengan nama satuan dan simbol resminya.`
    );
  }, [currentIdx, currentPair]);

  const handleVerifyPair = () => {
    if (!selectedUnit || !selectedSymbol) return;
    sound.playClick();

    const isCorrect = selectedUnit === currentPair.unit && selectedSymbol === currentPair.symbol;
    if (isCorrect) {
      setScore((prev) => prev + 100);
    }

    setDiscussionData({
      isCorrect,
      title: isCorrect ? 'Pasangan Satuan SI Sempurna!' : 'Evaluasi Standar SI',
      explanation: isCorrect
        ? `Tepat! Besaran ${currentPair.quantity} memiliki satuan resmi SI yaitu "${currentPair.unit}" dengan lambang "${currentPair.symbol}". ${currentPair.standardFact}`
        : `Belum tepat. Besaran ${currentPair.quantity} menurut standar SI memiliki satuan "${currentPair.unit}" dan lambang "${currentPair.symbol}".`,
      conceptNote: currentPair.standardFact,
    });
    setDiscussionOpen(true);
  };

  const handleNextPair = () => {
    setDiscussionOpen(false);
    setSelectedUnit(null);
    setSelectedSymbol(null);
    if (currentIdx < SI_STANDARDS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setStage('reflect');
      setReflectionOpen(true);
    }
  };

  const handleCompleteReflection = (isCorrect: boolean) => {
    setReflectionOpen(false);
    const finalScore = score + (isCorrect ? 100 : 0);
    const stars = finalScore >= 700 ? 3 : finalScore >= 500 ? 2 : 1;
    onComplete(finalScore, stars);
    setCompleteOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-950 px-3 py-1 rounded-md border border-emerald-500/40">
            LEVEL 3: LABORATORIUM SATUAN SI
          </span>
          <span className="text-xs text-slate-300">
            Pilar {currentIdx + 1} dari {SI_STANDARDS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'analyze'
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 1. Menganalisis
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'apply'
                ? 'bg-blue-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> 2. Mengaplikasi
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'reflect'
                ? 'bg-purple-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> 3. Merefleksi
          </span>
        </div>

        <button
          onClick={() =>
            speech.speak(
              `Besaran Pokok: ${currentPair.quantity}. Manakah nama satuan dan simbol internasional yang benar?`
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA INSTRUKSI
        </button>
      </div>

      {/* Main Interactive Reaktor (Single-Screen Fit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Pilar Besaran Pokok */}
        <div className="lg:col-span-4 bg-slate-950/80 rounded-3xl border-2 border-emerald-500/40 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-emerald-500/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              PILAR BESARAN POKOK KE-{currentIdx + 1}
            </span>
            <h3 className="text-2xl font-black text-white mt-1">{currentPair.quantity}</h3>
          </div>

          <div className="my-auto flex flex-col items-center text-center p-4">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-3 shadow-lg shadow-emerald-500/20 animate-cyber-pulse">
              <Atom className="w-10 h-10" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              💡 {currentPair.standardFact}
            </p>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
            Pilihlah 1 nama satuan dan 1 simbol di sebelah kanan, lalu tekan tombol Pasangkan.
          </div>
        </div>

        {/* Kolom Kanan: Papan Pilihan Satuan dan Simbol */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <h4 className="text-sm font-black text-white tracking-wide">
              PASANGKAN NAMA SATUAN & SIMBOL RESMI SI
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Pilihan:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {selectedUnit || '—'} / {selectedSymbol || '—'}
              </span>
            </div>
          </div>

          {/* Grid Satuan */}
          <div className="my-2 space-y-2">
            <span className="text-[11px] font-black uppercase text-cyan-400 block">
              1. Pilih Nama Satuan Standar:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {allUnits.slice(0, 10).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    sound.playTick();
                    setSelectedUnit(u);
                  }}
                  className={`min-h-[50px] p-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                    selectedUnit === u
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-lg shadow-cyan-500/40'
                      : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Simbol */}
          <div className="my-2 space-y-2">
            <span className="text-[11px] font-black uppercase text-emerald-400 block">
              2. Pilih Lambang/Simbol Satuan:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {allSymbols.slice(0, 10).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    sound.playTick();
                    setSelectedSymbol(s);
                  }}
                  className={`min-h-[50px] p-2 rounded-xl border text-sm font-mono font-black transition-all active:scale-95 ${
                    selectedSymbol === s
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40'
                      : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Verifikasi IFP */}
          <button
            disabled={!selectedUnit || !selectedSymbol}
            onClick={handleVerifyPair}
            className="w-full min-h-[64px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-40 disabled:hover:from-emerald-600 text-white font-black text-sm rounded-2xl border border-emerald-400 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>KUNCI PASANGAN SATUAN & SIMBOL SI</span>
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
        onNext={handleNextPair}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_3_REFLECTION.prompt}
        options={LEVEL_3_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={3}
        levelTitle="Level 3: Laboratorium Satuan SI"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 700 ? 3 : score >= 500 ? 2 : 1}
        badgeUnlockedTitle="Ahli Satuan SI"
        onReplay={() => {
          setCompleteOpen(false);
          setCurrentIdx(0);
          setSelectedUnit(null);
          setSelectedSymbol(null);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
