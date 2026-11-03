/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from './Modal';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { Volume2, VolumeX, Mic, MicOff, Play, Check } from 'lucide-react';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(sound.enabled);
  const [volume, setVolume] = useState<number>(sound.volume);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(speech.enabled);
  const [ttsRate, setTtsRate] = useState<number>(speech.rate);

  const handleToggleSfx = () => {
    sound.enabled = !sound.enabled;
    setSfxEnabled(sound.enabled);
    if (sound.enabled) sound.playClick();
  };

  const handleVolumeChange = (newVol: number) => {
    sound.volume = newVol;
    setVolume(newVol);
    sound.playClick();
  };

  const handleToggleTts = () => {
    speech.enabled = !speech.enabled;
    setTtsEnabled(speech.enabled);
    if (speech.enabled) {
      speech.speak('Narator aktif. Halo ilmuwan muda Fisika!');
    } else {
      speech.cancel();
    }
  };

  const handleTtsRateChange = (newRate: number) => {
    speech.rate = newRate;
    setTtsRate(newRate);
  };

  const testTTS = () => {
    speech.speak(
      'Uji coba suara narator Fisika. Kecepatan v sama dengan v nol ditambah a kali t. Dimensi gaya adalah M L T pangkat minus dua.'
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PENGATURAN SUARA & NARATOR" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Efek Suara (SFX) */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-500/40">
                {sfxEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Efek Suara Sintetis (SFX)</h3>
                <p className="text-xs text-slate-400">Suara klik, chime jawaban benar, dan alert alat ukur</p>
              </div>
            </div>
            <button
              onClick={handleToggleSfx}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                sfxEnabled
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {sfxEnabled ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Volume Suara:</span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-3 cursor-pointer"
            />
          </div>
        </div>

        {/* Narator Text To Speech (TTS) */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-950 text-blue-400 rounded-xl border border-blue-500/40">
                {ttsEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Narator Suara Bahasa Indonesia</h3>
                <p className="text-xs text-slate-400">Membaca instruksi soal, feedback konsep, dan refleksi</p>
              </div>
            </div>
            <button
              onClick={handleToggleTts}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                ttsEnabled
                  ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md shadow-blue-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {ttsEnabled ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Kecepatan Bicara:</span>
                <span className="font-mono text-blue-400 font-bold">{ttsRate}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={ttsRate}
                onChange={(e) => handleTtsRateChange(parseFloat(e.target.value))}
                className="w-full accent-blue-400 h-3 cursor-pointer"
              />
            </div>

            <button
              onClick={testTTS}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-cyan-500/30 text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Play className="w-4 h-4" /> Uji Suara Narator Sekarang
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-98 transition-all"
        >
          <Check className="w-5 h-5" /> SIMPAN & KEMBALI KE GAME
        </button>
      </div>
    </Modal>
  );
};
