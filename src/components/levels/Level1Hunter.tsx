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
  Search,
  Eye,
  Wrench,
  BrainCircuit,
  Volume2,
  CheckCircle2,
  Activity,
  Flame,
  Car,
  Clock,
  Zap,
} from 'lucide-react';

interface Level1Props {
  onComplete: (score: number, stars: number) => void;
  onSelectLevel: () => void;
  onNextLevel: () => void;
}

interface HunterTarget {
  id: number;
  name: string;
  icon: React.ElementType;
  phenomenon: string;
  observationNote: string;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
    conceptNote: string;
  }[];
}

const TARGETS: HunterTarget[] = [
  {
    id: 1,
    name: 'Termos Air Panas Reaktor',
    icon: Flame,
    phenomenon: 'Uap air mengepul dari termos laboratorium. Sensor digital mencatat angka 98°C.',
    observationNote: 'Apakah 98°C adalah benda, besaran, atau satuan? Apakah perbedaan antara suhu dan kalor?',
    question: 'Berdasarkan pengamatan, manakah identifikasi besaran fisis yang diukur pada fenomena ini?',
    options: [
      {
        label: 'Suhu (Besaran), derajat Celsius (Satuan), 98 (Nilai)',
        isCorrect: true,
        explanation: 'Tepat sekali! Besaran adalah segala sesuatu yang dapat diukur dan dinyatakan dengan angka (nilai) serta satuan. Suhu adalah besarannya, 98 adalah nilainya, dan °C adalah satuannya.',
        conceptNote: 'Besaran = Suhu, Nilai = 98, Satuan = °C.',
      },
      {
        label: 'Termos (Besaran), Panas (Satuan), 98 (Nilai)',
        isCorrect: false,
        explanation: 'Kurang tepat. Termos adalah nama benda/objek fisis, bukan besaran fisis yang diukur.',
        conceptNote: 'Benda ≠ Besaran.',
      },
      {
        label: 'Kalor (Satuan), Derajat (Besaran), Air (Nilai)',
        isCorrect: false,
        explanation: 'Kurang tepat. Kalor adalah bentuk energi transfer (satuannya Joule), sedangkan derajat Celsius adalah satuan untuk besaran suhu.',
        conceptNote: 'Suhu mengukur derajat panas, sedangkan kalor adalah energi yang berpindah.',
      },
    ],
  },
  {
    id: 2,
    name: 'Mobil Uji Sirkuit Cyber',
    icon: Car,
    phenomenon: 'Mobil laboratorium bergerak lurus melintasi gerbang sensor sejauh 100 meter dalam 5 sekon. Jarum speedometer menunjukkan 72 km/jam.',
    observationNote: 'Perhatikan lintasan gerak dan waktu tempuh mobil.',
    question: 'Di antara besaran berikut, manakah besaran turunan yang dapat dianalisis dari gerak mobil tersebut?',
    options: [
      {
        label: 'Kecepatan (72 km/jam atau 20 m/s)',
        isCorrect: true,
        explanation: 'Benar! Kecepatan adalah besaran turunan karena diturunkan dari besaran panjang (jarak 100 m) dibagi besaran waktu (5 sekon). Nilainya 20 m/s setara dengan 72 km/jam.',
        conceptNote: 'Kecepatan v = s / t [L][T]⁻¹.',
      },
      {
        label: 'Jarak tempuh (100 meter)',
        isCorrect: false,
        explanation: 'Jarak adalah besaran panjang, yang tergolong besaran pokok, bukan besaran turunan.',
        conceptNote: 'Panjang adalah salah satu dari 7 besaran pokok.',
      },
      {
        label: 'Waktu tempuh (5 sekon)',
        isCorrect: false,
        explanation: 'Waktu adalah besaran pokok dengan satuan standar internasional sekon (s).',
        conceptNote: 'Waktu adalah besaran pokok.',
      },
    ],
  },
  {
    id: 3,
    name: 'Rangkaian Lampu Laser Superkonduktor',
    icon: Zap,
    phenomenon: 'Sebuah kawat lampu lab dialiri arus listrik. Multimeter menunjukkan pembacaan 2,5 Ampere.',
    observationNote: 'Perhatikan arus muatan yang mengalir tiap detik.',
    question: 'Besaran apakah 2,5 Ampere dan tergolong jenis besaran apa dalam SI?',
    options: [
      {
        label: 'Kuat Arus Listrik (Besaran Pokok SI)',
        isCorrect: true,
        explanation: 'Luar biasa! Kuat arus listrik adalah salah satu dari 7 besaran pokok Sistem Internasional (SI) dengan satuan standar Ampere (simbol A).',
        conceptNote: 'Kuat arus listrik (I) bersatuan Ampere [A].',
      },
      {
        label: 'Tegangan Listrik (Besaran Pokok)',
        isCorrect: false,
        explanation: 'Keliru. Tegangan listrik satuannya Volt dan tergolong besaran turunan.',
        conceptNote: 'Ampere adalah satuan kuat arus listrik, bukan tegangan.',
      },
      {
        label: 'Daya Listrik (Besaran Pokok)',
        isCorrect: false,
        explanation: 'Daya listrik bersatuan Watt dan merupakan besaran turunan, bukan pokok.',
        conceptNote: 'Daya = Usaha / Waktu.',
      },
    ],
  },
];

const LEVEL_1_REFLECTION: { prompt: string; options: ReflectionOption[] } = {
  prompt:
    'Dalam percakapan sehari-hari, orang sering berkata "Berat badan saya 50 kilogram". Bagaimana analisis fisika yang benar terhadap pernyataan tersebut?',
  options: [
    {
      text: 'Pernyataan tersebut keliru secara ilmiah karena 50 kg menyatakan besaran Massa, sedangkan Berat adalah gaya gravitasi dengan satuan Newton (N).',
      isCorrect: true,
      feedback:
        'Tepat sekali! Massa adalah jumlah materi benda (satuan kg), sedangkan berat adalah gaya tarik gravitasi w = m · g (satuan Newton). Menggunakan kg untuk berat adalah salah kaprah umum.',
    },
    {
      text: 'Pernyataan tersebut sudah benar karena massa dan berat adalah dua istilah berbeda untuk konsep fisika yang persis sama.',
      isCorrect: false,
      feedback:
        'Keliru. Massa dan berat sangat berbeda. Massa tidak bergantung gravitasi, sedangkan berat berubah jika kamu berada di Bulan atau planet lain.',
    },
    {
      text: 'Pernyataan tersebut keliru karena kilogram adalah besaran turunan, bukan satuan berat.',
      isCorrect: false,
      feedback:
        'Salah. Kilogram adalah satuan besaran pokok massa, bukan besaran turunan.',
    },
  ],
};

export const Level1Hunter: React.FC<Level1Props> = ({
  onComplete,
  onSelectLevel,
  onNextLevel,
}) => {
  const [currentTargetIdx, setCurrentTargetIdx] = useState<number>(0);
  const [stage, setStage] = useState<'analyze' | 'apply' | 'reflect'>('analyze');
  const [score, setScore] = useState<number>(0);

  // Modal feedback
  const [discussionOpen, setDiscussionOpen] = useState<boolean>(false);
  const [discussionData, setDiscussionData] = useState<{
    isCorrect: boolean;
    title: string;
    explanation: string;
    conceptNote: string;
  }>({ isCorrect: false, title: '', explanation: '', conceptNote: '' });

  const [reflectionOpen, setReflectionOpen] = useState<boolean>(false);
  const [completeOpen, setCompleteOpen] = useState<boolean>(false);

  const currentTarget = TARGETS[currentTargetIdx];

  useEffect(() => {
    speech.speak(
      `Level Satu: Pemburu Besaran. Tahap Menganalisis. Amati ${currentTarget.name}. ${currentTarget.phenomenon}`
    );
  }, [currentTargetIdx, currentTarget]);

  const handleSelectOption = (opt: HunterTarget['options'][0]) => {
    sound.playClick();
    setDiscussionData({
      isCorrect: opt.isCorrect,
      title: opt.isCorrect ? 'Identifikasi Besaran Akurat!' : 'Evaluasi Identifikasi',
      explanation: opt.explanation,
      conceptNote: opt.conceptNote,
    });
    setDiscussionOpen(true);
    if (opt.isCorrect) {
      setScore((prev) => prev + 100);
    }
  };

  const handleNextTarget = () => {
    setDiscussionOpen(false);
    if (currentTargetIdx < TARGETS.length - 1) {
      setCurrentTargetIdx((prev) => prev + 1);
      setStage('analyze');
    } else {
      // Masuk ke Tahap 3: Merefleksi
      setStage('reflect');
      setReflectionOpen(true);
    }
  };

  const handleCompleteReflection = (isCorrect: boolean) => {
    setReflectionOpen(false);
    if (isCorrect) {
      setScore((prev) => prev + 100);
    }
    const finalScore = score + (isCorrect ? 100 : 0);
    const stars = finalScore >= 350 ? 3 : finalScore >= 200 ? 2 : 1;
    onComplete(finalScore, stars);
    setCompleteOpen(true);
  };

  const IconCmp = currentTarget.icon;

  return (
    <div className="w-full h-[calc(100vh-72px)] p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none cyber-grid">
      {/* Bar Indikator Tahapan */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-950 px-3 py-1 rounded-md border border-cyan-500/40">
            LEVEL 1: PEMBURU BESARAN
          </span>
          <span className="text-xs text-slate-300">
            Target {currentTargetIdx + 1} dari {TARGETS.length}
          </span>
        </div>

        {/* 3 Tahap Status Pills */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              stage === 'analyze'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 1. Menganalisis
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              stage === 'apply'
                ? 'bg-blue-500 text-slate-950 font-black shadow-md shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> 2. Mengaplikasi
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              stage === 'reflect'
                ? 'bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> 3. Merefleksi
          </span>
        </div>

        <button
          onClick={() => speech.speak(`${currentTarget.phenomenon}. ${currentTarget.question}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> BACA SOAL
        </button>
      </div>

      {/* Konten Utama Interaktif (Single-Screen Fit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto h-full max-h-[calc(100vh-165px)]">
        {/* Kolom Kiri: Layar Pemindai Fenomena Laboratorium (Menganalisis) */}
        <div className="lg:col-span-6 bg-slate-950/90 rounded-3xl border-2 border-cyan-500/40 p-5 flex flex-col justify-between overflow-hidden relative shadow-xl shadow-cyan-950/60">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-black text-cyan-300 uppercase tracking-widest">
                PEMINDAI OPTIK FENOMENA FISIKA
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              STATUS SENSOR: AKTIF
            </span>
          </div>

          {/* Area Visual Animasi Fenomena */}
          <div className="relative my-4 flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6">
            <div className="w-24 h-24 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 mb-4 shadow-xl shadow-cyan-500/20 animate-cyber-pulse">
              <IconCmp className="w-12 h-12" />
            </div>

            <h4 className="text-xl font-black text-white text-center mb-2">
              {currentTarget.name}
            </h4>
            <p className="text-sm text-cyan-200 text-center font-medium max-w-md">
              "{currentTarget.phenomenon}"
            </p>

            {/* Radar Scanline effect */}
            <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400/60 shadow-[0_0_15px_#22d3ee] animate-[bounce_3s_infinite]" />
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
            <strong className="text-cyan-400">Petunjuk Analisis:</strong> {currentTarget.observationNote}
          </div>
        </div>

        {/* Kolom Kanan: Tantangan & Pilihan Aplikasi (Mengaplikasi) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border-2 border-blue-500/40 p-5 flex flex-col justify-between overflow-hidden shadow-xl shadow-blue-950/60">
          <div className="border-b border-blue-500/20 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block mb-1">
              TAHAP 2: MENGAPLIKASIKAN KONSEP
            </span>
            <h3 className="text-base font-bold text-white leading-snug">
              {currentTarget.question}
            </h3>
          </div>

          {/* Tombol Pilihan Jawaban (Ukuran Besar & Nyaman Sentuh IFP) */}
          <div className="space-y-3 my-auto py-2">
            {currentTarget.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[68px] p-4 bg-slate-950/80 hover:bg-cyan-950/40 text-slate-200 hover:text-white rounded-2xl border-2 border-slate-700 hover:border-cyan-400 flex items-center gap-4 text-left transition-all active:scale-[0.98] group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-600 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-semibold leading-relaxed flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Pilihlah opsi yang paling tepat secara ilmiah berdasarkan kaidah Besaran, Satuan, dan Nilai.
          </div>
        </div>
      </div>

      {/* Discussion Modal */}
      <DiscussionModal
        isOpen={discussionOpen}
        isCorrect={discussionData.isCorrect}
        title={discussionData.title}
        explanation={discussionData.explanation}
        conceptNote={discussionData.conceptNote}
        onNext={handleNextTarget}
      />

      {/* Reflection Modal (Tahap 3) */}
      <ReflectionModal
        isOpen={reflectionOpen}
        questionPrompt={LEVEL_1_REFLECTION.prompt}
        options={LEVEL_1_REFLECTION.options}
        onCompleteReflection={handleCompleteReflection}
      />

      {/* Level Complete Modal */}
      <LevelCompleteModal
        isOpen={completeOpen}
        levelId={1}
        levelTitle="Level 1: Pemburu Besaran"
        scoreGained={score}
        totalLevelScore={score}
        stars={score >= 350 ? 3 : score >= 200 ? 2 : 1}
        badgeUnlockedTitle="Detektif Besaran"
        onReplay={() => {
          setCompleteOpen(false);
          setCurrentTargetIdx(0);
          setStage('analyze');
          setScore(0);
        }}
        onNextLevel={onNextLevel}
        onSelectLevel={onSelectLevel}
      />
    </div>
  );
};
