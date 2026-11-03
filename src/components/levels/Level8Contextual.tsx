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
import { Globe, Volume2, Eye, Wrench, BrainCircuit, Droplet, Zap, Cable } from 'lucide-react';

interface Level8Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface ContextualMission {
  id: number;
  title: string;
  icon: React.ElementType;
  story: string;
  question: string;
  clue: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
    conceptNote: string;
  }[];
}

const CONTEXT_MISSIONS: ContextualMission[] = [
  {
    id: 1,
    title: 'Uji Keaslian Mahkota Emas Raja Hiero (Prinsip Archimedes)',
    icon: Droplet,
    story:
      'Sebuah mahkota ditimbang di neraca memiliki massa m = 386 gram. Saat dimasukkan ke dalam gelas ukur berisi air, permukaan air naik dari 100 mL menjadi 120 mL (volume air terdesak V = 20 mL = 20 cm³). Diketahui massa jenis emas murni adalah 19,3 g/cm³.',
    question:
      'Berdasarkan perhitungan massa jenis (ρ = m / V), apakah mahkota tersebut terbuat dari emas murni?',
    clue: 'Hitung ρ = massa / volume air yang dipindahkan = 386 g / 20 cm³.',
    options: [
      {
        label: 'Ya, mahkota terbukti emas murni karena ρ = 386 g / 20 cm³ = 19,3 g/cm³ (19.300 kg/m³), persis sama dengan massa jenis emas murni.',
        isCorrect: true,
        explanation:
          'Analisis sempurna! Archimedes membuktikan bahwa massa jenis adalah karakteristik zat yang unik. ρ = 386 / 20 = 19,3 g/cm³. Ini identik dengan massa jenis emas murni.',
        conceptNote: 'ρ = m / V ➔ 386 / 20 = 19,3 g/cm³.',
      },
      {
        label: 'Bukan emas murni, karena volume 20 mL terlalu besar untuk logam mulia.',
        isCorrect: false,
        explanation: 'Kurang tepat. Volume 20 cm³ untuk massa 386 g justru memberikan nilai perbandingan yang tepat 19,3 g/cm³.',
        conceptNote: 'Massa jenis adalah rasio massa terhadap volume.',
      },
      {
        label: 'Tidak dapat dipastikan karena gelas ukur tidak bisa mengukur besaran turunan volume.',
        isCorrect: false,
        explanation: 'Keliru. Gelas ukur adalah alat ukur volume cairan yang sangat akurat untuk menentukan volume benda tidak beraturan.',
        conceptNote: 'Metode perpindahan volume air Eureka Archimedes.',
      },
    ],
  },
  {
    id: 2,
    title: 'Audit Spesifikasi Pengisi Daya Super Cepat (Fast Charger)',
    icon: Zap,
    story:
      'Pada adapter laptop tercantum label: "Input: 100-240 V, Output: 20 V ⎓ 3,25 A". Siswa ingin memvalidasi daya output (P = V · I) dan memastikan kesesuaian satuannya dalam Watt (Joule/sekon).',
    question:
      'Berapakah daya output adaptor tersebut dan bagaimana pembuktian dimensi satuan Watt?',
    clue: 'P = V × I = 20 Volt × 3,25 Ampere. 1 Watt = 1 Joule/s = 1 kg·m²·s⁻³ = [M][L]²[T]⁻³.',
    options: [
      {
        label: 'Daya = 65 Watt, dengan dimensi [M][L]²[T]⁻³ (energi per satuan waktu).',
        isCorrect: true,
        explanation:
          'Tepat sekali! P = 20 V × 3,25 A = 65 Watt. Watt adalah Joule/sekon. Karena Joule = [M][L]²[T]⁻², maka dibagi sekon [T] menghasilkan dimensi daya [M][L]²[T]⁻³.',
        conceptNote: 'Daya P = V · I = 65 W. Dimensi: [M][L]²[T]⁻³.',
      },
      {
        label: 'Daya = 6,15 Watt, dengan dimensi [M][L][T]⁻².',
        isCorrect: false,
        explanation: 'Keliru. 20 dikalikan 3,25 adalah 65, bukan 6,15. Dimensi [M][L][T]⁻² adalah gaya, bukan daya.',
        conceptNote: 'Daya = Tegangan × Arus.',
      },
      {
        label: 'Daya = 23,25 Watt, dengan dimensi [L]²[T]⁻².',
        isCorrect: false,
        explanation: 'Keliru. Nilai tegangan dan arus harus dikalikan, bukan dijumlahkan.',
        conceptNote: 'P = V · I.',
      },
    ],
  },
  {
    id: 3,
    title: 'Kalibrasi Kawat Inti Dinamo Pembangkit Listrik Mikrohidro',
    icon: Cable,
    story:
      'Spesifikasi teknis dinamo turbin desa menuntut diameter kawat tembaga sebesar 1,45 mm dengan toleransi ketat ±0,02 mm. Dua teknisi berdebat tentang alat ukur apa yang harus digunakan di lapangan.',
    question:
      'Alat ukur manakah yang memenuhi syarat ketelitian untuk memeriksa diameter kawat tersebut?',
    clue: 'Toleransi ±0,02 mm membutuhkan alat dengan ketelitian setidaknya 0,01 mm.',
    options: [
      {
        label: 'Mikrometer Sekrup, karena memiliki ketelitian 0,01 mm yang jauh lebih teliti dari toleransi ±0,02 mm.',
        isCorrect: true,
        explanation:
          'Sangat tepat! Toleransi ±0,02 mm berada pada orde seperseratus milimeter. Mistar (ketelitian 1 mm) dan jangka sorong biasa (ketelitian 0,05 mm) tidak cukup teliti untuk mendeteksi variasi ±0,02 mm.',
        conceptNote: 'Mikrometer sekrup memiliki batas ketelitian 0,01 mm.',
      },
      {
        label: 'Mistar kayu 100 cm, karena lebih mudah dipegang saat kawat sedang dipasang.',
        isCorrect: false,
        explanation: 'Sangat keliru. Mistar kayu hanya memiliki ketelitian 1 mm (0,1 cm) dan tidak mampu mengukur selisih 0,02 mm.',
        conceptNote: 'Resolusi mistar tidak memadai.',
      },
      {
        label: 'Roll meter bangunan, karena kawat tembaga digulung panjang dalam kumparan.',
        isCorrect: false,
        explanation: 'Keliru. Yang diukur adalah diameter penampang kawat yang sangat tipis, bukan panjang kawatnya.',
        conceptNote: 'Sesuaikan alat ukur dengan besaran spesifik yang diukur.',
      },
    ],
  },
];

const LEVEL_8_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Bagaimana penguasaan konsep besaran, satuan, dan pengukuran berkontribusi langsung terhadap kemajuan industri modern seperti semikonduktor, penerbangan, dan energi terbarukan?',
  options: [
    {
      text: 'Presisi pengukuran dan standardisasi satuan internasional menjadi fondasi pertukaran komponen global; tanpa toleransi ukuran nanometer dan kepastian satuan, chip prosesor maupun mesin pesawat tidak akan dapat bekerja secara aman.',
      isCorrect: true,
      feedback:
        'Refleksi yang sangat komprehensif! Metrologi (ilmu pengukuran) adalah pilar peradaban teknologi modern: mulai dari fabrikasi chip hingga navigasi satelit GPS.',
    },
    {
      text: 'Hanya bermanfaat di dalam ruang kelas saat ujian fisika berlangsung dan tidak digunakan insinyur lapangan.',
      isCorrect: false,
      feedback: 'Keliru besar. Setiap industri manufaktur, medis, dan antariksa bergantung pada metrologi presisi.',
    },
    {
      text: 'Tidak ada pengaruhnya karena mesin komputer modern dapat mengukur sendiri tanpa memerlukan aturan fisika.',
      isCorrect: false,
      feedback: 'Salah. Algoritma komputer dan sensor mesin diprogram berdasarkan hukum dan satuan fisika.',
    },
  ],
};

export const Level8Contextual: React.FC<Level8Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
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

  const currentMission = CONTEXT_MISSIONS[missionIdx];
  const IconCmp = currentMission.icon;

  useEffect(() => {
    speech.speak(
      `Level Delapan: Misi Fisika dalam Kehidupan. Kasus: ${currentMission.title}. ${currentMission.story}. ${currentMission.question}`
    );
  }, [missionIdx, currentMission]);

  const handleSelectOption = (opt: ContextualMission['options'][0]) => {
    sound.playClick();
    if (opt.isCorrect) {
      setScore((prev) => prev + 100);
    }
    setDiscussionData({
      isCorrect: opt.isCorrect,
      title: opt.isCorrect ? 'Solusi Keteknikan Tepat!' : 'Evaluasi Analisis Kasus',
      explanation: opt.explanation,
      conceptNote: opt.conceptNote,
    });
    setDiscussionOpen(true);
  };

  const handleNextMission = () => {
    setDiscussionOpen(false);
    if (missionIdx < CONTEXT_MISSIONS.length - 1) {
      setMissionIdx((prev) => prev + 1);
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
          <span className="text-xs font-black uppercase text-teal-400 bg-teal-950 px-3 py-1 rounded-md border border-teal-500/40">
            LEVEL 8: MISI FISIKA DALAM KEHIDUPAN
          </span>
          <span className="text-xs text-slate-300">
            Kasus {missionIdx + 1} dari {CONTEXT_MISSIONS.length}
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
          onClick={() => speech.speak(currentMission.question)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA KASUS
        </button>
      </div>

      {/* Main Single-Screen Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Briefing Kasus Nyata */}
        <div className="lg:col-span-6 bg-slate-950/90 rounded-3xl border-2 border-teal-500/40 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-teal-500/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
              STUDI KASUS KONTEKSTUAL
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{currentMission.title}</h3>
          </div>

          <div className="my-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-400">
                <IconCmp className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">
                Data Sensor Teramati
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "{currentMission.story}"
            </p>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            💡 <strong>Petunjuk Analisis:</strong> {currentMission.clue}
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Solusi */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border-2 border-slate-700 p-5 flex flex-col justify-between shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block mb-1">
              TAHAP 2: SOLUSI MASALAH
            </span>
            <p className="text-base text-slate-100 font-semibold leading-relaxed">
              {currentMission.question}
            </p>
          </div>

          <div className="space-y-3 my-auto py-2">
            {currentMission.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[68px] p-4 bg-slate-950/80 hover:bg-teal-950/30 text-slate-200 hover:text-white rounded-2xl border-2 border-slate-700 hover:border-teal-400 flex items-center gap-4 text-left transition-all active:scale-[0.98] group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-teal-500 group-hover:text-slate-950 text-teal-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-600 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-semibold leading-relaxed flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Terapkan hubungan matematis fisis untuk menyelesaikan tantangan.
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
        questionPrompt={LEVEL_8_REFLECTION.prompt}
        options={LEVEL_8_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={8}
        levelTitle="Level 8: Misi Fisika dalam Kehidupan"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 350 ? 3 : score >= 200 ? 2 : 1}
        badgeUnlockedTitle="Pakar Dimensi"
        onReplay={() => {
          setCompleteOpen(false);
          setMissionIdx(0);
          setScore(0);
          setStage('analyze');
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
