/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Grid,
  Award,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';

interface HeaderProps {
  currentLevelId?: number;
  totalScore: number;
  onGoHome: () => void;
  onGoLevels: () => void;
  onOpenBadges: () => void;
  onOpenHelp: () => void;
  onOpenSoundSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevelId,
  totalScore,
  onGoHome,
  onGoLevels,
  onOpenBadges,
  onOpenHelp,
  onOpenSoundSettings,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTTSActive, setIsTTSActive] = useState<boolean>(speech.enabled);
  const [isSFXActive, setIsSFXActive] = useState<boolean>(sound.enabled);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    sound.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      alert('Mode Layar Penuh diblokir oleh browser atau iframe. Tekan tombol F11 pada keyboard untuk layar penuh manual.');
    }
  };

  const toggleTTS = () => {
    sound.playClick();
    speech.enabled = !speech.enabled;
    setIsTTSActive(speech.enabled);
    if (!speech.enabled) {
      speech.cancel();
    } else {
      speech.speak('Narator suara diaktifkan.');
    }
  };

  const repeatSpeech = () => {
    sound.playClick();
    speech.repeat();
  };

  return (
    <header className="w-full h-18 bg-slate-950/90 border-b border-cyan-500/30 px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Identitas Mata Pelajaran */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2 text-left group transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
              PHYSICS <span className="text-cyan-400">ADVENTURE</span>
            </h1>
            <p className="text-[10px] md:text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Fisika Fase E • Kelas X SMA • Hisense 75" IFP
            </p>
          </div>
        </button>

        {currentLevelId && (
          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
            <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded-lg text-xs font-bold">
              LEVEL {currentLevelId}
            </span>
          </div>
        )}
      </div>

      {/* Skor & Status Game */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-xl border border-cyan-500/30">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Skor:</span>
          <span className="text-lg font-mono font-black text-amber-400">{totalScore}</span>
        </div>

        {/* Tombol Aksi IFP 75 Inci (Ukuran Besar & Nyaman Sentuh) */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Tombol Beranda */}
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 rounded-xl border border-slate-700 active:scale-95 transition-all"
            title="Beranda"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Tombol Pilih Level */}
          <button
            onClick={() => {
              sound.playClick();
              onGoLevels();
            }}
            className="flex items-center gap-2 px-3.5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 rounded-xl border border-slate-700 active:scale-95 transition-all text-xs font-bold"
            title="Pilih Level"
          >
            <Grid className="w-5 h-5 text-cyan-400" />
            <span className="hidden sm:inline">PILIH LEVEL</span>
          </button>

          {/* Tombol Lencana */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-700 active:scale-95 transition-all"
            title="Lencana Prestasi"
          >
            <Award className="w-5 h-5" />
          </button>

          {/* Tombol Ulang Narasi Suara */}
          <button
            onClick={repeatSpeech}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-xl border border-slate-700 active:scale-95 transition-all"
            title="Ulangi Suara Narator"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Tombol Toggle Narator Suara */}
          <button
            onClick={toggleTTS}
            className={`p-3 rounded-xl border transition-all active:scale-95 ${
              isTTSActive
                ? 'bg-cyan-950 text-cyan-400 border-cyan-500/60 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={isTTSActive ? 'Narator Aktif' : 'Narator Nonaktif'}
          >
            {isTTSActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Tombol Pengaturan Suara */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSoundSettings();
            }}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 active:scale-95 transition-all"
            title="Pengaturan Suara & Narator"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Tombol Petunjuk */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 active:scale-95 transition-all"
            title="Petunjuk Permainan"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Tombol Layar Penuh IFP */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            <span className="hidden md:inline">{isFullscreen ? 'KECILKAN' : 'LAYAR PENUH'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
