/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge, LevelInfo, LevelProgress } from '../types';

export const LEVELS_CONFIG: LevelInfo[] = [
  {
    id: 1,
    title: 'Level 1: Pemburu Besaran',
    codename: 'PEMBURU BESARAN',
    topic: 'Identifikasi Besaran Fisis dalam Kehidupan',
    description: 'Pindai objek & fenomena fisika di laboratorium cyber. Bedakan antara benda fisis, besaran, dan satuan.',
    badgeId: 'hunter',
    icon: 'Search',
    accentColor: '#06b6d4',
  },
  {
    id: 2,
    title: 'Level 2: Detektif Besaran Pokok & Turunan',
    codename: 'DETEKTIF BESARAN',
    topic: 'Klasifikasi Besaran Pokok vs Turunan',
    description: 'Gunakan chamber pemilah magnetik untuk mengelompokkan 7 besaran pokok dan aneka besaran turunan.',
    badgeId: 'detective',
    icon: 'Layers',
    accentColor: '#3b82f6',
  },
  {
    id: 3,
    title: 'Level 3: Laboratorium Satuan SI',
    codename: 'LAB SATUAN SI',
    topic: 'Standar Internasional (CGPM)',
    description: 'Pasangkan 7 besaran pokok dengan nama satuan SI dan lambang resminya untuk membangkitkan generator standar.',
    badgeId: 'si_expert',
    icon: 'CheckCircle2',
    accentColor: '#10b981',
  },
  {
    id: 4,
    title: 'Level 4: Tantangan Alat Ukur',
    codename: 'TANTANGAN ALAT UKUR',
    topic: 'Mistar, Jangka Sorong, Mikrometer, Neraca, Stopwatch',
    description: 'Operasikan jangka sorong dan mikrometer sekrup secara presisi. Hitung skala utama dan nonius secara akurat.',
    badgeId: 'measurement_master',
    icon: 'Gauge',
    accentColor: '#f59e0b',
  },
  {
    id: 5,
    title: 'Level 5: Konversi Satuan',
    codename: 'KONVERSI SATUAN',
    topic: 'Tangga Metrik, Notasi Ilmiah & Kecepatan',
    description: 'Ubah satuan panjang, massa, luas, volume, dan kelajuan mobil balap di lintasan eksperimen berkecepatan tinggi.',
    badgeId: 'converter_pro',
    icon: 'Repeat',
    accentColor: '#ec4899',
  },
  {
    id: 6,
    title: 'Level 6: Laboratorium Dimensi',
    codename: 'LAB DIMENSI',
    topic: 'Sintesis Lambang Dimensi Besaran Turunan',
    description: 'Rakit formula dimensi menggunakan kristal 7 dimensi pokok: [M], [L], [T], [I], [θ], [N], [J] pada reaktor dimensi.',
    badgeId: 'dim_scientist',
    icon: 'Boxes',
    accentColor: '#8b5cf6',
  },
  {
    id: 7,
    title: 'Level 7: Detektif Persamaan Fisika',
    codename: 'DETEKTIF PERSAMAAN',
    topic: 'Analisis Homogenitas Dimensi Persamaan',
    description: 'Periksa kesetaraan dimensi ruas kiri dan ruas kanan pada persamaan gerak, energi, dan temukan rumus yang keliru.',
    badgeId: 'equation_sleuth',
    icon: 'Calculator',
    accentColor: '#6366f1',
  },
  {
    id: 8,
    title: 'Level 8: Misi Fisika dalam Kehidupan',
    codename: 'MISI KONTEKSTUAL',
    topic: 'Penerapan Praktis & Pemecahan Masalah Nyata',
    description: 'Pecahkan studi kasus keteknikan: diameter kawat dinamo, uji Archimedes massa jenis mahkota, dan daya listrik.',
    badgeId: 'real_world_hero',
    icon: 'Globe',
    accentColor: '#14b8a6',
  },
  {
    id: 9,
    title: 'Level 9: Boss Battle: Master Fisika',
    codename: 'BOSS BATTLE: KEEPER-X9',
    topic: 'Tantangan Pamungkas HOTS Komprehensif',
    description: 'Hadapi Robot Penjaga Laboratorium Utama dalam duel 7 ronde HOTS untuk meraih gelar Tertinggi Master Fisika.',
    badgeId: 'physics_grandmaster',
    icon: 'Zap',
    accentColor: '#f97316',
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'hunter',
    title: 'Detektif Besaran',
    description: 'Berhasil mengidentifikasi besaran fisis dari fenomena alam.',
    icon: 'Search',
    unlocked: false,
    criteria: 'Selesaikan Level 1',
  },
  {
    id: 'detective',
    title: 'Pemilah Presisi',
    description: 'Mampu membedakan besaran pokok dan besaran turunan dengan tepat.',
    icon: 'Layers',
    unlocked: false,
    criteria: 'Selesaikan Level 2',
  },
  {
    id: 'si_expert',
    title: 'Ahli Satuan SI',
    description: 'Menguasai 7 besaran pokok SI beserta satuan dan simbol standarnya.',
    icon: 'CheckCircle2',
    unlocked: false,
    criteria: 'Selesaikan Level 3',
  },
  {
    id: 'measurement_master',
    title: 'Master Pengukuran',
    description: 'Mampu membaca jangka sorong dan mikrometer sekrup dengan presisi tinggi.',
    icon: 'Gauge',
    unlocked: false,
    criteria: 'Selesaikan Level 4',
  },
  {
    id: 'dim_scientist',
    title: 'Pakar Dimensi',
    description: 'Mahir merakit formula dimensi dan menguji homogenitas rumus fisika.',
    icon: 'Boxes',
    unlocked: false,
    criteria: 'Selesaikan Level 6 & 7',
  },
  {
    id: 'physics_grandmaster',
    title: 'Master Fisika Sejati',
    description: 'Menaklukkan Robot KEEPER-X9 dan menyelesaikan seluruh misi laboratorium.',
    icon: 'Crown',
    unlocked: false,
    criteria: 'Taklukkan Boss Battle Level 9',
  },
];

const STORAGE_KEY = 'PHYSICS_ADVENTURE_STATE_V1';

export interface AppState {
  levelsProgress: Record<number, LevelProgress>;
  badges: Badge[];
  totalScore: number;
}

export function loadGameState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignore storage errors
  }

  // Initial state with all 9 levels open (all unlocked from start!)
  const initialProgress: Record<number, LevelProgress> = {};
  for (let i = 1; i <= 9; i++) {
    initialProgress[i] = {
      score: 0,
      stars: 0,
      completed: false,
      bestTimeSeconds: 0,
    };
  }

  return {
    levelsProgress: initialProgress,
    badges: INITIAL_BADGES,
    totalScore: 0,
  };
}

export function saveGameState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore errors
  }
}
