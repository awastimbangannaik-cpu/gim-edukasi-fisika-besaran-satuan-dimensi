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
import { Boxes, Sparkles, Volume2, Eye, Wrench, BrainCircuit, CheckCircle2, RotateCcw } from 'lucide-react';

interface Level6Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface DimensionTask {
  id: number;
  quantityName: string;
  formula: string;
  unitDecomposition: string;
  targetM: number;
  targetL: number;
  targetT: number;
  correctDimensionStr: string;
  explanation: string;
}

const TASKS: DimensionTask[] = [
  {
    id: 1,
    quantityName: 'Gaya (Force)',
    formula: 'F = m · a',
    unitDecomposition: 'kg · m/s² = kg · m · s⁻²',
    targetM: 1,
    targetL: 1,
    targetT: -2,
    correctDimensionStr: '[M][L][T]⁻²',
    explanation: 'Massa dimensinya [M], panjang dimensinya [L], dan waktu sekon di penyebut kuadrat menjadi [T]⁻². Jadi dimensi gaya adalah [M][L][T]⁻².',
  },
  {
    id: 2,
    quantityName: 'Usaha dan Energi (Work & Energy)',
    formula: 'W = F · s',
    unitDecomposition: '(kg · m/s²) · m = kg · m² · s⁻²',
    targetM: 1,
    targetL: 2,
    targetT: -2,
    correctDimensionStr: '[M][L]²[T]⁻²',
    explanation: 'Gaya [M][L][T]⁻² dikalikan perpindahan [L] menghasilkan [M][L]²[T]⁻². Satuan SI-nya adalah Joule (N·m).',
  },
  {
    id: 3,
    quantityName: 'Tekanan (Pressure)',
    formula: 'P = F / A',
    unitDecomposition: '(kg · m/s²) / m² = kg · m⁻¹ · s⁻²',
    targetM: 1,
    targetL: -1,
    targetT: -2,
    correctDimensionStr: '[M][L]⁻¹[T]⁻²',
    explanation: 'Gaya [M][L][T]⁻² dibagi luas penampang [L]² menghasilkan [M][L]⁻¹[T]⁻². Satuan SI-nya adalah Pascal (N/m²).',
  },
  {
    id: 4,
    quantityName: 'Massa Jenis (Density)',
    formula: 'ρ = m / V',
    unitDecomposition: 'kg / m³ = kg · m⁻³',
    targetM: 1,
    targetL: -3,
    targetT: 0,
    correctDimensionStr: '[M][L]⁻³',
    explanation: 'Massa [M] dibagi volume [L]³ menghasilkan [M][L]⁻³. Besaran waktu tidak terlibat sehingga pangkat T adalah 0.',
  },
];

const LEVEL_6_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Besaran Usaha (W = F · s) dan besaran Momen Gaya / Torsi (τ = F · r) keduanya memiliki dimensi yang sama persis yaitu [M][L]²[T]⁻². Apakah keduanya merupakan besaran fisis yang identik?',
  options: [
    {
      text: 'Tidak identik. Usaha adalah besaran skalar (satuannya Joule), sedangkan Torsi adalah besaran vektor rotasi (satuannya Newton-meter, tidak boleh dinyatakan dalam Joule). Dimensi yang sama tidak selalu berarti besarannya identik secara fisis.',
      isCorrect: true,
      feedback:
        'Sangat cerdas dan mendalam! Ini adalah prinsip esensial dalam analisis dimensi: kesamaan dimensi membuktikan kesetaraan satuan fisis dasar, namun sifat vektor/skalar dan makna fisisnya tetap berbeda.',
    },
    {
      text: 'Ya, identik persis. Karena jika dimensinya sama, maka semua rumus fisika dan cara pengukurannya pasti sama persis.',
      isCorrect: false,
      feedback: 'Keliru. Usaha adalah transfer energi skalar, sedangkan torsi adalah efek putar gaya (vektor).',
    },
    {
      text: 'Keduanya berbeda karena dimensi torsi seharusnya memiliki sudut radian.',
      isCorrect: false,
      feedback: 'Salah. Sudut radian adalah besaran tak berdimensi (dimensinya 1).',
    },
  ],
};

export const Level6Dimensions: React.FC<Level6Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [taskIdx, setTaskIdx] = useState<number>(0);
  const [powerM, setPowerM] = useState<number>(0);
  const [powerL, setPowerL] = useState<number>(0);
  const [powerT, setPowerT] = useState<number>(0);
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

  const currentTask = TASKS[taskIdx];

  useEffect(() => {
    speech.speak(
      `Level Enam: Laboratorium Dimensi. Tentukan formula dimensi untuk besaran ${currentTask.quantityName}. Rumus: ${currentTask.formula}.`
    );
  }, [taskIdx, currentTask]);

  const handleVerify = () => {
    sound.playClick();
    const isCorrect =
      powerM === currentTask.targetM &&
      powerL === currentTask.targetL &&
      powerT === currentTask.targetT;

    if (isCorrect) {
      setScore((prev) => prev + 100);
    }

    setDiscussionData({
      isCorrect,
      title: isCorrect ? 'Sintesis Dimensi Akurat!' : 'Evaluasi Formula Dimensi',
      explanation: isCorrect
        ? `Luar biasa! Dimensi untuk ${currentTask.quantityName} adalah ${currentTask.correctDimensionStr}. ${currentTask.explanation}`
        : `Belum tepat. Dimensi yang benar untuk ${currentTask.quantityName} adalah ${currentTask.correctDimensionStr}. ${currentTask.explanation}`,
      conceptNote: `Analisis: ${currentTask.unitDecomposition}`,
    });
    setDiscussionOpen(true);
  };

  const handleNextTask = () => {
    setDiscussionOpen(false);
    setPowerM(0);
    setPowerL(0);
    setPowerT(0);
    if (taskIdx < TASKS.length - 1) {
      setTaskIdx((prev) => prev + 1);
    } else {
      setStage('reflect');
      setReflectionOpen(true);
    }
  };

  const handleCompleteReflection = (isCorrect: boolean) => {
    setReflectionOpen(false);
    const finalScore = score + (isCorrect ? 100 : 0);
    const stars = finalScore >= 450 ? 3 : finalScore >= 300 ? 2 : 1;
    onComplete(finalScore, stars);
    setCompleteOpen(true);
  };

  // Helper render string formula saat ini
  const buildCurrentFormulaStr = () => {
    const parts = [];
    if (powerM !== 0) parts.push(`[M]${powerM !== 1 ? `^${powerM}` : ''}`);
    if (powerL !== 0) parts.push(`[L]${powerL !== 1 ? `^${powerL}` : ''}`);
    if (powerT !== 0) parts.push(`[T]${powerT !== 1 ? `^${powerT}` : ''}`);
    return parts.length > 0 ? parts.join('') : '[Dimensi Belum Dipilih]';
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-purple-400 bg-purple-950 px-3 py-1 rounded-md border border-purple-500/40">
            LEVEL 6: LABORATORIUM DIMENSI
          </span>
          <span className="text-xs text-slate-300">
            Sintesis {taskIdx + 1} dari {TASKS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'analyze' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 1. Menganalisis
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'apply' ? 'bg-blue-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> 2. Mengaplikasi
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              stage === 'reflect' ? 'bg-purple-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> 3. Merefleksi
          </span>
        </div>

        <button
          onClick={() =>
            speech.speak(
              `Besaran ${currentTask.quantityName}. Rumus: ${currentTask.formula}. Uraian satuan: ${currentTask.unitDecomposition}.`
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA RUMUS
        </button>
      </div>

      {/* Main Dimension Arena (Single-Screen Fit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Dekomposisi Satuan & Rumus */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-3xl border-2 border-purple-500/40 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-purple-500/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
              TARGET BESARAN TURUNAN
            </span>
            <h3 className="text-2xl font-black text-white mt-1">{currentTask.quantityName}</h3>
          </div>

          <div className="my-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Rumus Fisis:</span>
              <span className="text-2xl font-mono font-black text-cyan-400">
                {currentTask.formula}
              </span>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-400 block mb-1">Uraian Satuan Dasar:</span>
              <span className="text-base font-mono font-bold text-amber-300">
                {currentTask.unitDecomposition}
              </span>
            </div>

            <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 leading-relaxed">
              💡 <strong>Petunjuk:</strong> Massa (kg) ➔ [M], Panjang (m) ➔ [L], Waktu (s) ➔ [T]. Jika satuan berada di bawah (penyebut), gunakan eksponen negatif!
            </div>
          </div>

          <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 text-xs text-purple-300">
            Hasil Rakitan: <strong className="font-mono text-white text-sm">{buildCurrentFormulaStr()}</strong>
          </div>
        </div>

        {/* Kolom Kanan: Interactive Dimension Synth Builder */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <h4 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-400" /> GENERATOR SINTESIS DIMENSI IFP
            </h4>
            <button
              onClick={() => {
                sound.playClick();
                setPowerM(0);
                setPowerL(0);
                setPowerT(0);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* 3 Modul Eksponen Dimensi: [M], [L], [T] */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-auto py-2">
            {/* Modul M */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 font-black font-mono text-xl flex items-center justify-center mb-2 border border-purple-400">
                [M]
              </div>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Massa</span>

              <div className="text-2xl font-mono font-black text-white my-1">
                {powerM > 0 ? `+${powerM}` : powerM}
              </div>

              <div className="flex items-center gap-1.5 w-full mt-2">
                {[-3, -2, -1, 0, 1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      sound.playTick();
                      setPowerM(p);
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      powerM === p
                        ? 'bg-purple-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Modul L */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 font-black font-mono text-xl flex items-center justify-center mb-2 border border-blue-400">
                [L]
              </div>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Panjang</span>

              <div className="text-2xl font-mono font-black text-white my-1">
                {powerL > 0 ? `+${powerL}` : powerL}
              </div>

              <div className="flex items-center gap-1.5 w-full mt-2">
                {[-3, -2, -1, 0, 1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      sound.playTick();
                      setPowerL(p);
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      powerL === p
                        ? 'bg-blue-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Modul T */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 font-black font-mono text-xl flex items-center justify-center mb-2 border border-cyan-400">
                [T]
              </div>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Waktu</span>

              <div className="text-2xl font-mono font-black text-white my-1">
                {powerT > 0 ? `+${powerT}` : powerT}
              </div>

              <div className="flex items-center gap-1.5 w-full mt-2">
                {[-3, -2, -1, 0, 1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      sound.playTick();
                      setPowerT(p);
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      powerT === p
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tombol Kunci Verifikasi IFP */}
          <button
            onClick={handleVerify}
            className="w-full min-h-[64px] bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-sm rounded-2xl border border-purple-400 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>KUNCI FORMULA DIMENSI INI</span>
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
        onNext={handleNextTask}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_6_REFLECTION.prompt}
        options={LEVEL_6_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={6}
        levelTitle="Level 6: Laboratorium Dimensi"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 450 ? 3 : score >= 300 ? 2 : 1}
        badgeUnlockedTitle="Pakar Dimensi"
        onReplay={() => {
          setCompleteOpen(false);
          setTaskIdx(0);
          setPowerM(0);
          setPowerL(0);
          setPowerT(0);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
