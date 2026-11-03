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
import { Repeat, Car, Volume2, Eye, Wrench, BrainCircuit, ArrowRight, Gauge } from 'lucide-react';

interface Level5Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface ConversionMission {
  id: number;
  title: string;
  category: 'kecepatan' | 'luas_volume' | 'massa_jenis';
  scenario: string;
  question: string;
  visualValue: string;
  targetUnit: string;
  stepHint: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
    conceptNote: string;
  }[];
}

const MISSIONS: ConversionMission[] = [
  {
    id: 1,
    title: 'Kecepatan Kereta Cepat Jakarta-Bandung',
    category: 'kecepatan',
    scenario: 'Kereta cepat Whoosh melaju dengan kecepatan konstan 360 km/jam pada sensor lintasan tegak lurus.',
    question: 'Berapakah kecepatan kereta cepat tersebut jika dinyatakan dalam satuan standar internasional (m/s)?',
    visualValue: '360 km/jam',
    targetUnit: 'm/s',
    stepHint: '1 km = 1.000 m dan 1 jam = 3.600 sekon. Kalikan dengan 1.000 / 3.600 = 1 / 3,6.',
    options: [
      {
        label: '100 m/s',
        isCorrect: true,
        explanation: 'Benar sekali! 360 km/jam = (360 × 1.000 m) / (3.600 s) = 360.000 / 3.600 = 100 m/s.',
        conceptNote: 'Untuk mengubah km/jam ke m/s: bagi dengan 3,6.',
      },
      {
        label: '36 m/s',
        isCorrect: false,
        explanation: 'Kurang tepat. 360 dibagi 3,6 menghasilkan 100 m/s, bukan 36 m/s.',
        conceptNote: '360 / 3,6 = 100 m/s.',
      },
      {
        label: '1.296 m/s',
        isCorrect: false,
        explanation: 'Keliru. Angka ini didapat jika km/jam dikali 3,6 (seharusnya dibagi).',
        conceptNote: 'Dari km/jam ke m/s nilainya mengecil karena detik jauh lebih singkat dari jam.',
      },
    ],
  },
  {
    id: 2,
    title: 'Konversi Massa Jenis Raksa Termometer',
    category: 'massa_jenis',
    scenario: 'Massa jenis cairan raksa laboratorium terukur sebesar 13,6 g/cm³.',
    question: 'Berapakah massa jenis raksa tersebut jika dikonversikan ke dalam satuan SI (kg/m³)?',
    visualValue: '13,6 g/cm³',
    targetUnit: 'kg/m³',
    stepHint: '1 g = 10⁻³ kg dan 1 cm³ = 10⁻⁶ m³. Pengali total = 10⁻³ / 10⁻⁶ = 10³ = 1.000.',
    options: [
      {
        label: '13.600 kg/m³ (1,36 × 10⁴ kg/m³)',
        isCorrect: true,
        explanation: 'Hebat! 1 g/cm³ = 1.000 kg/m³. Maka 13,6 g/cm³ = 13,6 × 1.000 = 13.600 kg/m³.',
        conceptNote: '1 g/cm³ = 1000 kg/m³.',
      },
      {
        label: '1,36 kg/m³',
        isCorrect: false,
        explanation: 'Keliru. Mengubah g/cm³ ke kg/m³ harus dikali 1.000, bukan dibagi 10.',
        conceptNote: 'Volume 1 meter kubik memuat jauh lebih banyak massa dibanding 1 cm³.',
      },
      {
        label: '136 kg/m³',
        isCorrect: false,
        explanation: 'Kurang tepat. Faktor pengali massa jenis dari CGS ke MKS adalah 1.000.',
        conceptNote: '13,6 × 1000 = 13.600.',
      },
    ],
  },
  {
    id: 3,
    title: 'Konversi Luas Pelat Penampang Surya',
    category: 'luas_volume',
    scenario: 'Sebuah pelat panel surya berbentuk persegi panjang memiliki luas 500 cm².',
    question: 'Berapakah luas pelat penampang tersebut dalam satuan meter persegi (m²)?',
    visualValue: '500 cm²',
    targetUnit: 'm²',
    stepHint: '1 m = 100 cm = 10² cm ➔ 1 m² = (10² cm)² = 10⁴ cm² = 10.000 cm². Jadi 1 cm² = 10⁻⁴ m².',
    options: [
      {
        label: '0,05 m² (5 × 10⁻² m²)',
        isCorrect: true,
        explanation: 'Tepat sekali! Luas = 500 cm² × 10⁻⁴ m²/cm² = 500 / 10.000 = 0,05 m².',
        conceptNote: 'Ingat luas bertingkat 100 (10²) per anak tangga.',
      },
      {
        label: '5 m²',
        isCorrect: false,
        explanation: 'Keliru. 500 cm² jika dibagi 100 baru menghasilkan 5 (ini kesalahan lupa menguadratkan faktor panjang).',
        conceptNote: 'Konversi luas: faktor dikuadratkan (100² = 10.000).',
      },
      {
        label: '0,5 m²',
        isCorrect: false,
        explanation: 'Kurang tepat. 500 / 10.000 = 0,05 m².',
        conceptNote: '500 × 10⁻⁴ = 0,05.',
      },
    ],
  },
];

const LEVEL_5_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Pada tahun 1999, wahana antariksa NASA Mars Climate Orbiter seharga $125 juta hancur di atmosfer Mars karena satu tim insinyur menggunakan satuan imperial (Pound-force·sekon) sementara tim pengendali menggunakan satuan metrik SI (Newton·sekon). Refleksi apa yang dapat kita petik?',
  options: [
    {
      text: 'Standarisasi Sistem Satuan Internasional (SI) sangat krusial dalam sains dan keteknikan dunia; kesalahan konversi sekecil apa pun dapat berakibat fatal pada keselamatan misi dan perhitungan fisis.',
      isCorrect: true,
      feedback:
        'Sangat tepat! Peristiwa Mars Climate Orbiter adalah pengingat abadi dalam sejarah fisika betapa pentingnya konsistensi dan konversi satuan yang ketat antarilmuwan.',
    },
    {
      text: 'Pesawat antariksa seharusnya tidak perlu menggunakan satuan gaya dalam manuver pengereman atmosfer.',
      isCorrect: false,
      feedback: 'Salah. Dorongan pengereman mutlak membutuhkan besaran gaya dan impuls.',
    },
    {
      text: 'Satuan imperial Amerika dan satuan metrik sebenarnya bernilai sama persis sehingga tidak ada yang salah.',
      isCorrect: false,
      feedback: 'Salah besar! 1 pound-force setara dengan sekitar 4,45 Newton, perbedaan yang sangat signifikan.',
    },
  ],
};

export const Level5Conversion: React.FC<Level5Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
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

  const mission = MISSIONS[currentIdx];

  useEffect(() => {
    speech.speak(`Level Lima: Konversi Satuan. ${mission.scenario}. ${mission.question}`);
  }, [currentIdx, mission]);

  const handleSelectOption = (opt: ConversionMission['options'][0]) => {
    sound.playClick();
    if (opt.isCorrect) {
      setScore((prev) => prev + 100);
    }
    setDiscussionData({
      isCorrect: opt.isCorrect,
      title: opt.isCorrect ? 'Konversi Satuan Akurat!' : 'Evaluasi Langkah Konversi',
      explanation: opt.explanation,
      conceptNote: opt.conceptNote,
    });
    setDiscussionOpen(true);
  };

  const handleNextMission = () => {
    setDiscussionOpen(false);
    if (currentIdx < MISSIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
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
          <span className="text-xs font-black uppercase text-pink-400 bg-pink-950 px-3 py-1 rounded-md border border-pink-500/40">
            LEVEL 5: KONVERSI SATUAN & NOTASI
          </span>
          <span className="text-xs text-slate-300">
            Misi {currentIdx + 1} dari {MISSIONS.length}
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
          onClick={() => speech.speak(mission.question)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA SOAL
        </button>
      </div>

      {/* Main Single-Screen Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Simulasi Lintasan & Tangga Metrik */}
        <div className="lg:col-span-6 bg-slate-950/90 rounded-3xl border-2 border-pink-500/40 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-pink-500/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">
              SIMULATOR KONVERSI METRIK
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{mission.title}</h3>
          </div>

          {/* Visual Fenomena Konversi */}
          <div className="my-auto bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
            {mission.category === 'kecepatan' && (
              <div className="relative w-full py-4 flex flex-col items-center">
                <div className="w-full h-1 bg-cyan-500/30 relative mb-4">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-2 bg-pink-600 text-white rounded-xl shadow-lg shadow-pink-500/40 animate-pulse">
                    <Car className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-black text-pink-400 mb-1">
                  {mission.visualValue}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <span>km/jam</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold">{mission.targetUnit} (SI)</span>
                </div>
              </div>
            )}

            {mission.category !== 'kecepatan' && (
              <div className="py-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400 flex items-center justify-center text-pink-400 mb-3 shadow-lg shadow-pink-500/20">
                  <Repeat className="w-8 h-8" />
                </div>
                <div className="text-3xl font-mono font-black text-pink-400 mb-1">
                  {mission.visualValue}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <span>Satuan Awal</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold">{mission.targetUnit} (SI)</span>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 max-w-sm mt-2 italic">
              "{mission.scenario}"
            </p>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <strong className="text-pink-400">Rumus Jembatan Konversi:</strong> {mission.stepHint}
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Jawaban */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 block mb-1">
              TAHAP 2: PENENTUAN HASIL KONVERSI
            </span>
            <p className="text-base text-slate-100 font-semibold leading-relaxed">
              {mission.question}
            </p>
          </div>

          <div className="space-y-3 my-auto py-2">
            {mission.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[68px] p-4 bg-slate-950/80 hover:bg-pink-950/30 text-slate-200 hover:text-white rounded-2xl border-2 border-slate-700 hover:border-pink-400 flex items-center gap-4 text-left transition-all active:scale-[0.98] group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-pink-500 group-hover:text-slate-950 text-pink-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-600 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-base font-bold font-mono leading-relaxed flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Perhatikan faktor eksponen 10^n dan kaidah notasi ilmiah (a × 10ⁿ di mana 1 ≤ a &lt; 10).
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
        onNext={handleNextMission}
      />

      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_5_REFLECTION.prompt}
        options={LEVEL_5_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={5}
        levelTitle="Level 5: Konversi Satuan"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 350 ? 3 : score >= 200 ? 2 : 1}
        badgeUnlockedTitle="Ahli Satuan SI"
        onReplay={() => {
          setCompleteOpen(false);
          setCurrentIdx(0);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
