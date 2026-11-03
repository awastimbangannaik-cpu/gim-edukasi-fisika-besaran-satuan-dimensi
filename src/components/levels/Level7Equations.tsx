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
import { Calculator, CheckCircle2, AlertTriangle, Volume2, Eye, Wrench, BrainCircuit } from 'lucide-react';

interface Level7Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface EquationCase {
  id: number;
  title: string;
  equation: string;
  isHomogeneous: boolean;
  leftDimension: string;
  rightDimension: string;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
    conceptNote: string;
  }[];
}

const CASES: EquationCase[] = [
  {
    id: 1,
    title: 'Persamaan GLBB: Posisi Terhadap Waktu',
    equation: 's = v₀ · t + ½ · a · t²',
    isHomogeneous: true,
    leftDimension: '[L]',
    rightDimension: '[L][T]⁻¹ · [T] + [L][T]⁻² · [T]² = [L] + [L] = [L]',
    question: 'Berdasarkan analisis dimensi, apakah persamaan gerak lurus berubah beraturan (GLBB) di atas homogen (setara)?',
    options: [
      {
        label: 'Homogen (Benar secara dimensi), karena setiap suku di ruas kanan memiliki dimensi [L] yang sama dengan ruas kiri.',
        isCorrect: true,
        explanation: 'Tepat sekali! Ruas kiri s berdimensi [L]. Suku pertama ruas kanan: [L][T]⁻¹ × [T] = [L]. Suku kedua: ½ tidak berdimensi, [L][T]⁻² × [T]² = [L]. Penjumlahan [L] + [L] tetap berdimensi [L]. Persamaan ini terbukti homogen!',
        conceptNote: '[L] = [L] + [L] ➔ Homogen.',
      },
      {
        label: 'Tidak homogen, karena angka ½ di ruas kanan tidak memiliki dimensi.',
        isCorrect: false,
        explanation: 'Keliru. Konstanta angka murni seperti ½ tidak berdimensi (dimensi = 1) dan tidak merusak homogenitas dimensi persamaan.',
        conceptNote: 'Konstanta numerik tak berdimensi.',
      },
      {
        label: 'Tidak homogen, karena waktu t dikuadratkan pada suku kedua.',
        isCorrect: false,
        explanation: 'Keliru. t² mengimbangi percepatan a ([L][T]⁻²) sehingga [T]⁻² × [T]² = [T]⁰ = 1, meninggalkan dimensi panjang [L].',
        conceptNote: '[T]⁻² · [T]² = 1.',
      },
    ],
  },
  {
    id: 2,
    title: 'Pemeriksaan Kerusakan Rumus oleh Anomali Lab',
    equation: 's = v₀ · t² + a · t',
    isHomogeneous: false,
    leftDimension: '[L]',
    rightDimension: '[L][T]⁻¹ · [T]² + [L][T]⁻² · [T] = [L][T] + [L][T]⁻¹',
    question: 'Robot penguji mendeteksi rumus cacat di atas. Mengapa persamaan tersebut salah dan TIDAK homogen secara dimensi?',
    options: [
      {
        label: 'Tidak homogen, karena suku pertama berdimensi [L][T] dan suku kedua berdimensi [L][T]⁻¹; kedua suku tidak setara dan keduanya tidak sama dengan dimensi jarak [L].',
        isCorrect: true,
        explanation: 'Analisis cemerlang! Suku pertama: [L][T]⁻¹ × [T]² = [L][T]. Suku kedua: [L][T]⁻² × [T] = [L][T]⁻¹. Dua besaran dengan dimensi berbeda tidak dapat dijumlahkan, dan hasilnya jelas bukan panjang [L].',
        conceptNote: 'Dua besaran fisis hanya boleh dijumlahkan jika dimensinya sama persis!',
      },
      {
        label: 'Homogen, asalkan nilai waktu t sama dengan 1 sekon.',
        isCorrect: false,
        explanation: 'Keliru. Homogenitas dimensi harus berlaku untuk setiap nilai fisis, bukan hanya pada angka tertentu.',
        conceptNote: 'Dimensi berlaku umum, bukan kasus angka khusus.',
      },
      {
        label: 'Homogen, karena semua variabelnya adalah besaran mekanika.',
        isCorrect: false,
        explanation: 'Salah. Meskipun berasal dari mekanika, kombinasi pangkat variabelnya keliru.',
        conceptNote: 'Aturan penjumlahan dimensi.',
      },
    ],
  },
  {
    id: 3,
    title: 'Penentuan Dimensi Konstanta Gravitasi Universal (G)',
    equation: 'F = G · (m₁ · m₂) / r²',
    isHomogeneous: true,
    leftDimension: '[M][L][T]⁻²',
    rightDimension: '[G] · [M]² / [L]²',
    question: 'Berdasarkan hukum gravitasi Newton di atas, apakah dimensi dari konstanta gravitasi umum G?',
    options: [
      {
        label: '[M]⁻¹[L]³[T]⁻²',
        isCorrect: true,
        explanation: 'Sempurna! Dari F = G·m₁·m₂/r², maka G = F·r² / (m₁·m₂). Dimensinya = ([M][L][T]⁻² × [L]²) / [M]² = [M][L]³[T]⁻² / [M]² = [M]⁻¹[L]³[T]⁻².',
        conceptNote: 'G = F · r² / (m₁ · m₂) ➔ [M]⁻¹[L]³[T]⁻².',
      },
      {
        label: '[M][L]²[T]⁻²',
        isCorrect: false,
        explanation: 'Keliru. Ini adalah dimensi energi/usaha, bukan konstanta gravitasi G.',
        conceptNote: 'G memiliki satuan N·m²/kg².',
      },
      {
        label: '[L]³[T]⁻²',
        isCorrect: false,
        explanation: 'Kurang tepat. Massa di penyebut kuadrat menyisakan [M]⁻¹.',
        conceptNote: 'Jangan lupakan dimensi massa pembagi.',
      },
    ],
  },
];

const LEVEL_7_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Jika suatu persamaan fisika terbukti homogen (dimensi ruas kiri = dimensi ruas kanan), apakah persamaan tersebut pasti 100% benar secara fisis di alam nyata?',
  options: [
    {
      text: 'Belum tentu. Karena analisis dimensi tidak dapat memeriksa konstanta tak berdimensi (contohnya angka ½ atau 2π) atau kesalahan arah tanda vektor.',
      isCorrect: true,
      feedback:
        'Sangat tepat! Analisis dimensi adalah syarat mutlak (necessary condition), tetapi bukan syarat cukup (sufficient condition). Jika dimensinya salah, rumus pasti salah; namun jika dimensinya benar, rumus belum tentu fisis tanpa pembuktian eksperimen.',
    },
    {
      text: 'Pasti 100% benar mutlak tanpa perlu eksperimen laboratorium apa pun lagi.',
      isCorrect: false,
      feedback: 'Keliru. Contoh: Ek = 500 m v² dimensinya benar, tetapi rumusnya keliru karena angka seharusnya adalah ½.',
    },
    {
      text: 'Pasti salah karena rumus fisika tidak boleh melibatkan analisis dimensi.',
      isCorrect: false,
      feedback: 'Salah total. Analisis dimensi adalah alat verifikasi fundamental para ilmuwan fisika.',
    },
  ],
};

export const Level7Equations: React.FC<Level7Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [caseIdx, setCaseIdx] = useState<number>(0);
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

  const currentCase = CASES[caseIdx];

  useEffect(() => {
    speech.speak(
      `Level Tujuh: Detektif Persamaan Fisika. Kasus: ${currentCase.title}. Persamaan: ${currentCase.equation}. ${currentCase.question}`
    );
  }, [caseIdx, currentCase]);

  const handleSelectOption = (opt: EquationCase['options'][0]) => {
    sound.playClick();
    if (opt.isCorrect) {
      setScore((prev) => prev + 100);
    }
    setDiscussionData({
      isCorrect: opt.isCorrect,
      title: opt.isCorrect ? 'Analisis Homogenitas Tepat!' : 'Evaluasi Analisis Homogenitas',
      explanation: opt.explanation,
      conceptNote: opt.conceptNote,
    });
    setDiscussionOpen(true);
  };

  const handleNextCase = () => {
    setDiscussionOpen(false);
    if (caseIdx < CASES.length - 1) {
      setCaseIdx((prev) => prev + 1);
    } else {
      setStage('reflect');
      setReflectionOpen(true);
    }
  };

  const handleCompleteReflection = (isCorrect: boolean) => {
    setReflectionOpen(false);
    const finalScore = score + (isCorrect ? 100 : 0);
    const stars = finalScore >= 350 ? 3 : finalScore >= 200 ? 2 : 1;
    onComplete(finalScore, stars);
    setCompleteOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-indigo-400 bg-indigo-950 px-3 py-1 rounded-md border border-indigo-500/40">
            LEVEL 7: DETEKTIF PERSAMAAN FISIKA
          </span>
          <span className="text-xs text-slate-300">
            Kasus {caseIdx + 1} dari {CASES.length}
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
          onClick={() => speech.speak(currentCase.question)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA SOAL
        </button>
      </div>

      {/* Main Single-Screen Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Scanner Persamaan Holografis */}
        <div className="lg:col-span-6 bg-slate-950/90 rounded-3xl border-2 border-indigo-500/40 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-indigo-500/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              SCANNER HOMOGENITAS PERSAMAAN
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{currentCase.title}</h3>
          </div>

          <div className="my-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-500/20 animate-cyber-pulse">
              <Calculator className="w-8 h-8" />
            </div>

            <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">
              Persamaan yang Diuji:
            </span>
            <div className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-300 py-2">
              {currentCase.equation}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-md text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Dimensi Ruas Kiri:</span>
                <span className="text-cyan-400 font-bold">{currentCase.leftDimension}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Dimensi Ruas Kanan:</span>
                <span className="text-purple-400 font-bold truncate block">{currentCase.rightDimension}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            🔍 <strong>Kaidah Homogenitas:</strong> [Ruas Kiri] = [Ruas Kanan]. Suku-suku yang dijumlahkan harus memiliki dimensi yang persis sama.
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Analisis */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block mb-1">
              TAHAP 2: PENGAMBILAN KEPUTUSAN ILMIAH
            </span>
            <p className="text-base text-slate-100 font-semibold leading-relaxed">
              {currentCase.question}
            </p>
          </div>

          <div className="space-y-3 my-auto py-2">
            {currentCase.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[68px] p-4 bg-slate-950/80 hover:bg-indigo-950/30 text-slate-200 hover:text-white rounded-2xl border-2 border-slate-700 hover:border-indigo-400 flex items-center gap-4 text-left transition-all active:scale-[0.98] group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-indigo-500 group-hover:text-slate-950 text-indigo-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-600 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-semibold leading-relaxed flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Telaah apakah tiap suku ruas kanan memiliki dimensi yang sepadan dengan ruas kiri.
          </div>
        </div>
      </div>

      {/* Modals */}
      <DiscussionModal
        isOpen={discussionOpen}
        isCorrect={discussionData.isCorrect}
        title={discussionData.title}
        explanation={discussionData.explanation}
        conceptNote={discussionData.conceptNote}
        onNext={handleNextCase}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_7_REFLECTION.prompt}
        options={LEVEL_7_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={7}
        levelTitle="Level 7: Detektif Persamaan Fisika"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 350 ? 3 : score >= 200 ? 2 : 1}
        badgeUnlockedTitle="Pakar Dimensi"
        onReplay={() => {
          setCompleteOpen(false);
          setCaseIdx(0);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
