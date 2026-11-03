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
import { VernierCaliper } from '../instruments/VernierCaliper';
import { Micrometer } from '../instruments/Micrometer';
import { TripleBeamBalance } from '../instruments/TripleBeamBalance';
import { StopwatchAnalog } from '../instruments/StopwatchAnalog';
import { Thermometer } from '../instruments/Thermometer';
import { Gauge, CheckCircle2, Volume2, Eye, Wrench, BrainCircuit, Sparkles } from 'lucide-react';

interface Level4Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface InstrumentChallenge {
  id: number;
  type: 'vernier' | 'micrometer' | 'balance' | 'stopwatch' | 'thermometer';
  title: string;
  instrumentName: string;
  precision: string;
  targetValue: number;
  promptQuestion: string;
  options: {
    label: string;
    value: number;
    isCorrect: boolean;
    explanation: string;
    conceptNote: string;
  }[];
}

const CHALLENGES: InstrumentChallenge[] = [
  {
    id: 1,
    type: 'vernier',
    title: 'Pengukuran Diameter Piston Silinder Logam',
    instrumentName: 'Jangka Sorong (Vernier Caliper)',
    precision: 'Ketelitian 0,05 mm',
    targetValue: 24.35,
    promptQuestion:
      'Perhatikan skala jangka sorong di atas. Skala utama menunjukkan sebelum 24 mm dan garis nonius ke-7 berimpit segaris lurus dengan garis skala utama. Berapakah hasil pembacaannya?',
    options: [
      {
        label: '24,35 mm (2,435 cm)',
        value: 24.35,
        isCorrect: true,
        explanation:
          'Tepat sekali! Hasil = Skala Utama + (Skala Nonius × Ketelitian) = 24 mm + (7 × 0,05 mm) = 24 mm + 0,35 mm = 24,35 mm.',
        conceptNote: 'HP = SU + (SN × 0,05 mm).',
      },
      {
        label: '24,70 mm',
        value: 24.7,
        isCorrect: false,
        explanation:
          'Kurang tepat. Garis ke-7 dikalikan dengan ketelitian alat (0,05 mm), bukan langsung 0,7 mm.',
        conceptNote: 'Ingat kalikan skala nonius dengan NST alat.',
      },
      {
        label: '25,35 mm',
        value: 25.35,
        isCorrect: false,
        explanation:
          'Kurang tepat. Angka nol nonius belum melewati angka 25 mm pada skala utama, sehingga skala utamanya adalah 24 mm.',
        conceptNote: 'Baca skala utama sebelum garis nol nonius.',
      },
    ],
  },
  {
    id: 2,
    type: 'micrometer',
    title: 'Pengukuran Ketebalan Pelat Superkonduktor',
    instrumentName: 'Mikrometer Sekrup (Micrometer Screw Gauge)',
    precision: 'Ketelitian 0,01 mm',
    targetValue: 6.78,
    promptQuestion:
      'Perhatikan mikrometer sekrup di atas. Pada sleeve terlihat garis 6,5 mm dan pada bidal putar garis ke-28 berimpit horizontal dengan garis datum. Berapakah hasil pengukuran?',
    options: [
      {
        label: '6,78 mm',
        value: 6.78,
        isCorrect: true,
        explanation:
          'Sempurna! Hasil = Skala Utama Sleeve + (Skala Putar × 0,01 mm) = 6,50 mm + (28 × 0,01 mm) = 6,50 + 0,28 = 6,78 mm.',
        conceptNote: 'Garis bawah setengah mm terlihat, jadi tambahkan 0,5 mm!',
      },
      {
        label: '6,28 mm',
        value: 6.28,
        isCorrect: false,
        explanation:
          'Keliru. Garis 0,5 mm di bagian bawah sleeve sudah tampak terbuka jelas di kanan angka 6 mm, sehingga harus ditambahkan 0,5 mm.',
        conceptNote: 'Perhatikan garis 0,5 mm di bawah garis datum sleeve.',
      },
      {
        label: '6,78 cm',
        value: 6.78,
        isCorrect: false,
        explanation:
          'Satuannya keliru! Mikrometer sekrup mengukur dalam milimeter (mm), bukan sentimeter (cm).',
        conceptNote: 'Satuan mikrometer adalah milimeter.',
      },
    ],
  },
  {
    id: 3,
    type: 'balance',
    title: 'Pengukuran Massa Kristal Titanium',
    instrumentName: 'Neraca Ohaus Tiga Lengan',
    precision: 'Ketelitian 0,1 g',
    targetValue: 247.3,
    promptQuestion:
      'Lengan belakang berada di 200 g, lengan tengah di 40 g, dan anting lengan depan berada di 7,3 g. Berapakah massa kristal tersebut?',
    options: [
      {
        label: '247,3 gram (0,2473 kg)',
        value: 247.3,
        isCorrect: true,
        explanation:
          'Tepat! Massa total = 200 g + 40 g + 7,3 g = 247,3 gram. Jika dikonversi ke SI adalah 0,2473 kg.',
        conceptNote: 'Massa = M₁ + M₂ + M₃.',
      },
      {
        label: '240,73 gram',
        value: 240.73,
        isCorrect: false,
        explanation:
          'Keliru. Angka satuan 7 dan desimal 0,3 berada di lengan depan yang sama (7,3 gram).',
        conceptNote: 'Penjumlahan ketiga lengan neraca Ohaus.',
      },
      {
        label: '647,3 gram',
        value: 647.3,
        isCorrect: false,
        explanation:
          'Keliru. Lengan belakang berada pada skala 200 g, bukan 600 g.',
        conceptNote: 'Baca angka tepat di ceruk anting beban.',
      },
    ],
  },
];

const LEVEL_4_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Seorang siswa mengukur ketebalan kawat tembaga menggunakan mistar plastik biasa dan mencatat hasil "0,8 mm". Mengapa penggunaan mistar tersebut secara kaidah fisika kurang tepat?',
  options: [
    {
      text: 'Karena mistar memiliki nilai skala terkecil (NST) 1 mm, sehingga tidak mampu mengukur ketebalan di bawah 1 mm secara teliti; seharusnya digunakan Mikrometer Sekrup yang memiliki ketelitian 0,01 mm.',
      isCorrect: true,
      feedback:
        'Sangat tepat! Pemilihan alat ukur harus menyesuaikan dimensi objek dengan batas ketelitian alat. Untuk mengukur ketebalan kawat atau pelat tipis, mikrometer sekrup adalah instrumen yang tepat.',
    },
    {
      text: 'Karena mistar hanya boleh digunakan untuk mengukur benda yang berbentuk cairan.',
      isCorrect: false,
      feedback: 'Keliru. Mistar adalah alat pengukur panjang benda padat berukuran sedang.',
    },
    {
      text: 'Karena mistar plastik bermuatan statis yang dapat merusak struktur kawat tembaga.',
      isCorrect: false,
      feedback: 'Salah. Ini murni masalah batas ketelitian instrumen ukur (resolusi pengukuran).',
    },
  ],
};

export const Level4Instruments: React.FC<Level4Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
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

  const challenge = CHALLENGES[currentChallengeIdx];

  useEffect(() => {
    speech.speak(
      `Level Empat: Tantangan Alat Ukur. ${challenge.instrumentName}. ${challenge.promptQuestion}`
    );
  }, [currentChallengeIdx, challenge]);

  const handleSelectOption = (opt: InstrumentChallenge['options'][0]) => {
    sound.playClick();
    if (opt.isCorrect) {
      setScore((prev) => prev + 100);
    }
    setDiscussionData({
      isCorrect: opt.isCorrect,
      title: opt.isCorrect ? 'Pembacaan Skala Presisi!' : 'Evaluasi Pembacaan Skala',
      explanation: opt.explanation,
      conceptNote: opt.conceptNote,
    });
    setDiscussionOpen(true);
  };

  const handleNextChallenge = () => {
    setDiscussionOpen(false);
    if (currentChallengeIdx < CHALLENGES.length - 1) {
      setCurrentChallengeIdx((prev) => prev + 1);
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
          <span className="text-xs font-black uppercase text-amber-400 bg-amber-950 px-3 py-1 rounded-md border border-amber-500/40">
            LEVEL 4: TANTANGAN ALAT UKUR PRESISI
          </span>
          <span className="text-xs text-slate-300">
            Tantangan {currentChallengeIdx + 1} dari {CHALLENGES.length}
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
          onClick={() => speech.speak(challenge.promptQuestion)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA SOAL
        </button>
      </div>

      {/* Main Simulation View (Single-Screen Fit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Simulasi Alat Ukur Realistis Presisi Matematika */}
        <div className="lg:col-span-7 bg-slate-950/90 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                {challenge.instrumentName}
              </span>
              <h3 className="text-base font-bold text-white">{challenge.title}</h3>
            </div>
            <span className="text-xs bg-amber-950 text-amber-300 px-3 py-1 rounded-md border border-amber-500/40 font-mono font-bold">
              {challenge.precision}
            </span>
          </div>

          {/* Render Komponen Alat Ukur Sesuai Tantangan */}
          <div className="my-auto py-2">
            {challenge.type === 'vernier' && (
              <VernierCaliper targetMm={challenge.targetValue} interactive={true} />
            )}
            {challenge.type === 'micrometer' && (
              <Micrometer targetMm={challenge.targetValue} interactive={true} />
            )}
            {challenge.type === 'balance' && (
              <TripleBeamBalance targetMassG={challenge.targetValue} />
            )}
          </div>

          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-400">
            🔍 <strong>Petunjuk Guru:</strong> Perhatikan pertemuan garis lurus antara skala utama dan skala nonius. Jangan ada kesalahan paralaks (sudut baca harus tegak lurus).
          </div>
        </div>

        {/* Kolom Kanan: Soal & Pilihan Pembacaan Presisi */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block mb-1">
              TAHAP 2: PEMBACAAN AKURAT
            </span>
            <p className="text-sm text-slate-100 font-semibold leading-relaxed">
              {challenge.promptQuestion}
            </p>
          </div>

          <div className="space-y-3 my-auto py-2">
            {challenge.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[64px] p-4 bg-slate-950/80 hover:bg-amber-950/40 text-slate-200 hover:text-white rounded-2xl border-2 border-slate-700 hover:border-amber-400 flex items-center gap-4 text-left transition-all active:scale-[0.98] group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-600 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-semibold leading-relaxed flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Perhatikan satuan (mm vs cm) dan jumlah angka desimal sesuai ketelitian instrumen.
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
        onNext={handleNextChallenge}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_4_REFLECTION.prompt}
        options={LEVEL_4_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={4}
        levelTitle="Level 4: Tantangan Alat Ukur"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 350 ? 3 : score >= 200 ? 2 : 1}
        badgeUnlockedTitle="Master Pengukuran"
        onReplay={() => {
          setCompleteOpen(false);
          setCurrentChallengeIdx(0);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
