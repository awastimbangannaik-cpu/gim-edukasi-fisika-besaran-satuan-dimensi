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
import { Bot, Zap, Shield, Heart, Volume2, Eye, Wrench, BrainCircuit, Sparkles, Flame } from 'lucide-react';

interface Level9Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface BossPhase {
  id: number;
  phaseTitle: string;
  category: string;
  keeperDialogue: string;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
    conceptNote: string;
  }[];
}

const PHASES: BossPhase[] = [
  {
    id: 1,
    phaseTitle: 'Fase 1: Uji Skalar vs Vektor & Besaran Pokok',
    category: 'Analisis Besaran',
    keeperDialogue:
      'Sistem protokol diaktifkan! Manusia sering mengacaukan besaran skalar dan besaran vektor. Tunjukkan kalian memahami perbedaan arah dan nilai!',
    question:
      'Kelompok besaran di bawah ini yang SELURUHNYA merupakan besaran turunan DAN sekaligus besaran vektor adalah...',
    options: [
      {
        label: 'Kecepatan, Gaya, Percepatan, dan Momentum',
        isCorrect: true,
        explanation:
          'Serangan tepat sasaran! Kecepatan (m/s), Gaya (N), Percepatan (m/s²), dan Momentum (kg·m/s) semuanya memiliki nilai serta arah (vektor) dan diturunkan dari besaran pokok.',
        conceptNote: 'Besaran vektor memiliki besar/nilai dan arah.',
      },
      {
        label: 'Massa, Waktu, Suhu, dan Kuat Arus',
        isCorrect: false,
        explanation: 'Salah! Keempatnya adalah besaran pokok dan besaran skalar (hanya memiliki nilai tanpa arah).',
        conceptNote: 'Besaran pokok di atas adalah skalar.',
      },
      {
        label: 'Jarak, Kelajuan, Usaha, dan Daya',
        isCorrect: false,
        explanation: 'Kurang tepat. Meskipun besaran turunan, kelajuan, usaha, dan daya adalah besaran skalar.',
        conceptNote: 'Usaha dan daya tidak memiliki arah.',
      },
    ],
  },
  {
    id: 2,
    phaseTitle: 'Fase 2: Notasi Ilmiah & Orde Ukuran Partikel',
    category: 'Notasi Ilmiah',
    keeperDialogue:
      'Reaktor partikel kuantum kami beroperasi pada skala mikroskopis. Buktikan kalian mampu menuliskan notasi ilmiah standar!',
    question:
      'Diameter sebuah virus nanopartikel terukur 0,000000125 meter. Penulisan yang benar dalam notasi ilmiah (aturan angka penting) adalah...',
    options: [
      {
        label: '1,25 × 10⁻⁷ meter',
        isCorrect: true,
        explanation:
          'Kena perisai robot! 0,000000125 m = 1,25 × 10⁻⁷ m. Angka di depan koma (1 ≤ a < 10) adalah 1,25 dengan 3 angka penting.',
        conceptNote: 'Geser koma 7 kali ke kanan ➔ 10⁻⁷.',
      },
      {
        label: '12,5 × 10⁻⁸ meter',
        isCorrect: false,
        explanation: 'Kurang tepat. Notasi ilmiah baku mensyaratkan angka di depan koma berada di antara 1 dan 10 (tidak boleh 12,5).',
        conceptNote: 'Bentuk baku: a × 10ⁿ di mana 1 ≤ a < 10.',
      },
      {
        label: '1,25 × 10⁷ meter',
        isCorrect: false,
        explanation: 'Salah tanda eksponen! Bilangan desimal kecil bernilai pangkat negatif 10⁻⁷, bukan positif.',
        conceptNote: 'Nilai desimal < 1 memiliki eksponen negatif.',
      },
    ],
  },
  {
    id: 3,
    phaseTitle: 'Fase 3: Analisis Dimensi Konstanta Pegas (k)',
    category: 'Sintesis Dimensi',
    keeperDialogue:
      'Hukum Hooke menyatakan F = k · Δx. Perisai reaktor ditopang oleh pegas peredam. Pecahkan dimensi konstanta pegas k!',
    question:
      'Berdasarkan hukum Hooke F = k · Δx, manakah dimensi yang benar untuk konstanta pegas k?',
    options: [
      {
        label: '[M][T]⁻²',
        isCorrect: true,
        explanation:
          'Tembakan kritis! k = F / Δx. Dimensi gaya F = [M][L][T]⁻² dibagi perpindahan pegas Δx = [L]. Panjang [L] saling meniadakan, meninggalkan [M][T]⁻².',
        conceptNote: 'k = [M][L][T]⁻² / [L] = [M][T]⁻².',
      },
      {
        label: '[M][L]²[T]⁻²',
        isCorrect: false,
        explanation: 'Keliru. Itu adalah dimensi energi, bukan konstanta pegas.',
        conceptNote: 'Dimensi energi memiliki [L]².',
      },
      {
        label: '[M][L][T]⁻¹',
        isCorrect: false,
        explanation: 'Keliru. Itu adalah dimensi momentum.',
        conceptNote: 'Konstanta pegas satuannya N/m = kg/s².',
      },
    ],
  },
  {
    id: 4,
    phaseTitle: 'Fase 4: Homogenitas Tekanan Hidrostatis Reaktor',
    category: 'Homogenitas Persamaan',
    keeperDialogue:
      'Pendingin inti reaktor menggunakan cairan bertekanan. Verifikasi rumus tekanan hidrostatis P = ρ · g · h!',
    question:
      'Pada rumus tekanan P = ρ · g · h (massa jenis × gravitasi × kedalaman), apakah dimensinya setara dengan satuan tekanan Pascal (N/m²)?',
    options: [
      {
        label: 'Ya, homogen setara! Dimensi ρ·g·h = [M][L]⁻³ × [L][T]⁻² × [L] = [M][L]⁻¹[T]⁻², identik dengan dimensi tekanan P.',
        isCorrect: true,
        explanation:
          'Perisai penjaga jebol! Tekanan P = Gaya / Luas = [M][L][T]⁻² / [L]² = [M][L]⁻¹[T]⁻². Di ruas kanan: [M][L]⁻³ · [L][T]⁻² · [L] = [M][L]⁻¹[T]⁻². Keduanya terbukti homogen sempurna!',
        conceptNote: 'P = ρ g h ➔ [M][L]⁻¹[T]⁻².',
      },
      {
        label: 'Tidak homogen, karena kedalaman h seharusnya memiliki satuan volume.',
        isCorrect: false,
        explanation: 'Keliru. Kedalaman h adalah besaran panjang bersatuan meter [L].',
        conceptNote: 'Kedalaman adalah panjang vertikal.',
      },
      {
        label: 'Tidak homogen, karena percepatan gravitasi g merusak dimensi tekanan.',
        isCorrect: false,
        explanation: 'Salah. Gravitasi justru mengalikan massa menjadi gaya berat.',
        conceptNote: 'Gaya berat w = m · g.',
      },
    ],
  },
  {
    id: 5,
    phaseTitle: 'Fase 5: Kunci Penyelamatan Reaktor (HOTS Komprehensif)',
    category: 'Penyelamatan Reaktor',
    keeperDialogue:
      'Peringatan darurat! Reaktor mencapai ambang batas kritis. Hitung energi pelepasan termal menurut persamaan massa-energi Einstein E = m · c²!',
    question:
      'Jika massa 0,002 kg materi terkonversi sempurna menjadi energi (c = 3 × 10⁸ m/s), berapakah energi yang dilepaskan dan dimensinya?',
    options: [
      {
        label: 'E = 1,8 × 10¹⁴ Joule, dengan dimensi [M][L]²[T]⁻²',
        isCorrect: true,
        explanation:
          'KEEPER-X9 BERHASIL DITUNDUKKAN! E = m · c² = 0,002 kg × (3 × 10⁸ m/s)² = 2 × 10⁻³ × 9 × 10¹⁶ = 18 × 10¹³ = 1,8 × 10¹⁴ Joule. Dimensi energi adalah [M][L]²[T]⁻².',
        conceptNote: 'E = mc² = 1,8 × 10¹⁴ J. Dimensi: [M][L]²[T]⁻².',
      },
      {
        label: 'E = 6 × 10⁵ Joule, dengan dimensi [M][L][T]⁻²',
        isCorrect: false,
        explanation: 'Keliru. Kecepatan cahaya c harus dikuadratkan: (3 × 10⁸)² = 9 × 10¹⁶, bukan hanya dikali 2.',
        conceptNote: 'c² = (3 × 10⁸)² = 9 × 10¹⁶.',
      },
      {
        label: 'E = 1,8 × 10¹⁴ Watt, dengan dimensi [M][L]²[T]⁻³',
        isCorrect: false,
        explanation: 'Satuannya keliru! Energi bersatuan Joule, sedangkan Watt adalah satuan daya.',
        conceptNote: 'Joule adalah satuan energi, Watt adalah daya.',
      },
    ],
  },
];

const LEVEL_9_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Setelah menuntaskan seluruh petualangan besaran, satuan, dan dimensi, kesimpulan filosofis apa yang paling esensial bagi seorang calon ilmuwan Fisika?',
  options: [
    {
      text: 'Fisika adalah ilmu eksperimental yang dibangun di atas ketelitian pengukuran, konsistensi satuan internasional, dan keteraturan logika dimensi matematika untuk memahami rahasia alam semesta secara obyektif.',
      isCorrect: true,
      feedback:
        'SELAMAT! Kalian telah membuktikan kapasitas berpikir sebagai ilmuwan muda sejati! Gelar Master Fisika telah kalian raih dengan kehormatan tertinggi.',
    },
    {
      text: 'Fisika hanyalah sekadar kumpulan rumus hafalan yang tidak memiliki kaitan nyata dengan kehidupan sehari-hari.',
      isCorrect: false,
      feedback: 'Sangat keliru! Fisika menjelaskan segala fenomena dari elektron hingga galaksi.',
    },
    {
      text: 'Pengukuran di laboratorium tidak perlu teliti asalkan persamaannya tampak rumit.',
      isCorrect: false,
      feedback: 'Salah besar. Pengukuran presisi adalah napas utama sains fisika.',
    },
  ],
};

export const Level9BossBattle: React.FC<Level9Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [phaseIdx, setPhaseIdx] = useState<number>(0);
  const [bossHp, setBossHp] = useState<number>(100);
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

  const currentPhase = PHASES[phaseIdx];

  useEffect(() => {
    speech.speak(
      `Boss Battle: KEEPER-X9. ${currentPhase.phaseTitle}. KEEPER berkata: "${currentPhase.keeperDialogue}". ${currentPhase.question}`
    );
  }, [phaseIdx, currentPhase]);

  const handleSelectOption = (opt: BossPhase['options'][0]) => {
    sound.playClick();
    if (opt.isCorrect) {
      sound.playLaser();
      setBossHp((prev) => Math.max(0, prev - 20));
      setScore((prev) => prev + 150);
    }
    setDiscussionData({
      isCorrect: opt.isCorrect,
      title: opt.isCorrect ? 'Tembakan Kritis Berhasil!' : 'Perisai Robot Bertahan',
      explanation: opt.explanation,
      conceptNote: opt.conceptNote,
    });
    setDiscussionOpen(true);
  };

  const handleNextPhase = () => {
    setDiscussionOpen(false);
    if (phaseIdx < PHASES.length - 1) {
      setPhaseIdx((prev) => prev + 1);
    } else {
      setStage('reflect');
      setReflectionOpen(true);
    }
  };

  const handleCompleteReflection = (isCorrect: boolean) => {
    setReflectionOpen(false);
    const finalScore = score + (isCorrect ? 150 : 0);
    const stars = 3;
    onComplete(finalScore, stars);
    setCompleteOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-orange-500/40 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-orange-400 bg-orange-950 px-3 py-1 rounded-md border border-orange-500/50 flex items-center gap-1.5 animate-pulse">
            <Flame className="w-4 h-4 text-orange-400" /> BOSS BATTLE: KEEPER-X9
          </span>
          <span className="text-xs text-slate-300">
            Fase {phaseIdx + 1} dari {PHASES.length}
          </span>
        </div>

        {/* HP Bar Boss */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-700">
          <Shield className="w-4 h-4 text-orange-400" />
          <div className="w-36 md:w-56 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${bossHp}%` }}
            />
          </div>
          <span className="font-mono text-xs font-black text-orange-300">{bossHp}% HP</span>
        </div>

        <button
          onClick={() => speech.speak(currentPhase.question)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-orange-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA TANTANGAN
        </button>
      </div>

      {/* Main Single-Screen Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Visual Avatar Robot Penjaga KEEPER-X9 */}
        <div className="lg:col-span-5 bg-gradient-to-b from-orange-950/40 via-slate-950 to-red-950/40 rounded-3xl border-2 border-orange-500/50 p-5 flex flex-col justify-between shadow-2xl shadow-orange-950/70 relative overflow-hidden">
          <div className="border-b border-orange-500/30 pb-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                PENJAGA INTI LABORATORIUM FISIKA
              </span>
              <h3 className="text-xl font-black text-white">KEEPER-X9</h3>
            </div>
            <span className="text-xs bg-red-950 text-red-400 px-2.5 py-1 rounded-md border border-red-500/40 font-black animate-pulse">
              LEVEL MASTER
            </span>
          </div>

          {/* Visual Avatar Robot */}
          <div className="my-auto flex flex-col items-center justify-center p-4">
            <div
              className={`w-28 h-28 rounded-3xl bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center text-orange-400 mb-4 shadow-2xl transition-all ${
                bossHp <= 40 ? 'animate-bounce shadow-red-500/50' : 'animate-cyber-pulse shadow-orange-500/30'
              }`}
            >
              <Bot className="w-16 h-16" />
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-orange-500/30 text-center max-w-sm">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block mb-1">
                Transmisi Suara KEEPER-X9:
              </span>
              <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                "{currentPhase.keeperDialogue}"
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
            Jawablah setiap tantangan HOTS dengan akurat untuk meruntuhkan perisai KEEPER-X9!
          </div>
        </div>

        {/* Kolom Kanan: Soal HOTS & Pilihan Jawaban */}
        <div className="lg:col-span-7 bg-slate-900/95 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                {currentPhase.category}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {currentPhase.phaseTitle}
              </span>
            </div>
            <p className="text-base text-slate-100 font-bold leading-relaxed">
              {currentPhase.question}
            </p>
          </div>

          <div className="space-y-3 my-auto py-2">
            {currentPhase.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[68px] p-4 bg-slate-950/80 hover:bg-orange-950/30 text-slate-200 hover:text-white rounded-2xl border-2 border-slate-700 hover:border-orange-400 flex items-center gap-4 text-left transition-all active:scale-[0.98] group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-orange-500 group-hover:text-slate-950 text-orange-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-600 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-semibold leading-relaxed flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Kombinasi penalaran kritis, analisis dimensi, dan konversi fisis tingkat lanjut.
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
        onNext={handleNextPhase}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_9_REFLECTION.prompt}
        options={LEVEL_9_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={9}
        levelTitle="Level 9: Boss Battle: Master Fisika"
        scoreGained={score}
        totalLevelScore={score}
        stars={3}
        badgeUnlockedTitle="Master Fisika Sejati"
        onReplay={() => {
          setCompleteOpen(false);
          setPhaseIdx(0);
          setBossHp(100);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onSelectLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
