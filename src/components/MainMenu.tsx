/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Play, Grid, HelpCircle, Volume2, Maximize, Award, Sparkles, Atom, Compass, Layers } from 'lucide-react';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';

interface MainMenuProps {
  onStartAdventure: () => void;
  onOpenLevelSelect: () => void;
  onOpenHelp: () => void;
  onOpenSoundSettings: () => void;
  onOpenBadges: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartAdventure,
  onOpenLevelSelect,
  onOpenHelp,
  onOpenSoundSettings,
  onOpenBadges,
}) => {
  useEffect(() => {
    // Ucapan sambutan narator Fisika saat pembukaan game
    speech.speak(
      'Selamat datang di Laboratorium Fisika! Hari ini kita akan menjadi ilmuwan muda. Tugas kalian adalah memecahkan berbagai misteri tentang besaran, satuan, dan dimensi. Siapkan jari kalian, amati setiap fenomena, dan buktikan bahwa kalian mampu berpikir seperti seorang ilmuwan!'
    );
  }, []);

  const handleFullscreen = async () => {
    sound.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      alert('Mode Layar Penuh diblokir oleh browser. Gunakan tombol F11 pada keyboard untuk tampilan penuh.');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-72px)] flex flex-col justify-between p-6 md:p-10 overflow-hidden select-none cyber-grid cyber-vignette">
      {/* Background Sci-Fi Laboratorium Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-cyan-600/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        {/* Melayang partikel dan orbit atom */}
        <div className="absolute top-1/3 right-1/4 text-cyan-400 opacity-30 animate-spin" style={{ animationDuration: '30s' }}>
          <Atom className="w-64 h-64" />
        </div>
      </div>

      {/* Bagian Atas: Identitas Kurikulum & Mata Pelajaran */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-2xl border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/60">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs md:text-sm font-black tracking-widest text-cyan-300 uppercase">
            KURIKULUM MERDEKA • FISIKA KELAS X FASE E • HISENSE 75" IFP
          </span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenBadges();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-amber-400 rounded-2xl border border-amber-500/40 text-xs font-bold transition-all active:scale-95 shadow-md shadow-amber-950/40"
        >
          <Award className="w-4 h-4" />
          <span>RUANG LENCANA</span>
        </button>
      </div>

      {/* Bagian Tengah: Judul Megah & Ilustrasi Laboratorium Masa Depan */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 bg-cyan-950/80 rounded-full border border-cyan-400/40 text-cyan-400 text-xs font-black tracking-widest">
          <Sparkles className="w-4 h-4" /> REAKTOR PENGUKURAN & SAINS MASA DEPAN
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 tracking-tight leading-none text-glow-cyan">
          PHYSICS ADVENTURE
        </h1>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-cyan-400 tracking-wider mt-2 uppercase">
          MISI BESARAN, SATUAN & DIMENSI
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Masuki simulasi laboratorium Fisika interaktif! Selidiki fenomena fisis, uji presisi alat ukur jangka sorong & mikrometer, konversi satuan internasional, bedah formula dimensi, dan taklukkan penjaga lab dalam pertarungan kecerdasan sains.
        </p>

        {/* 3 Pilar Pembelajaran Visual */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-cyan-500/30 text-xs text-cyan-300 font-semibold">
            <Compass className="w-4 h-4 text-cyan-400" /> 1. MENGANALISIS
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-blue-500/30 text-xs text-blue-300 font-semibold">
            <Layers className="w-4 h-4 text-blue-400" /> 2. MENGAPLIKASI
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-purple-500/30 text-xs text-purple-300 font-semibold">
            <Atom className="w-4 h-4 text-purple-400" /> 3. MEREFLEKSI
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tombol Aksi IFP 75 Inci (Min 64-80px Height untuk Sentuhan Sempurna) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Tombol Utama: Mulai Petualangan */}
        <button
          onClick={() => {
            sound.playClick();
            onStartAdventure();
          }}
          className="w-full md:w-auto flex-1 min-h-[72px] px-8 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 hover:text-white font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-cyan-500/30 border border-cyan-300 flex items-center justify-center gap-3 transition-all active:scale-[0.98] glow-cyan"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>MULAI PETUALANGAN (LEVEL 1)</span>
        </button>

        {/* Tombol Pilih Level */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLevelSelect();
          }}
          className="w-full md:w-auto min-h-[72px] px-8 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-base md:text-lg rounded-2xl border-2 border-cyan-500/50 shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
          <Grid className="w-6 h-6 text-cyan-400" />
          <span>PILIH LEVEL (9 MISI TERBUKA)</span>
        </button>

        {/* Tombol Pembantu (Petunjuk, Suara, Layar Penuh) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="min-h-[72px] min-w-[72px] p-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            title="Petunjuk Permainan"
          >
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span className="text-[10px] font-bold">PETUNJUK</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSoundSettings();
            }}
            className="min-h-[72px] min-w-[72px] p-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            title="Pengaturan Suara"
          >
            <Volume2 className="w-6 h-6 text-blue-400" />
            <span className="text-[10px] font-bold">SUARA</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="min-h-[72px] min-w-[72px] p-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            title="Layar Penuh"
          >
            <Maximize className="w-6 h-6 text-emerald-400" />
            <span className="text-[10px] font-bold">LAYAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
