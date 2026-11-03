/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { LevelSelectMenu } from './components/LevelSelectMenu';
import { BadgesModal } from './components/BadgesModal';
import { HelpModal } from './components/HelpModal';
import { SoundSettingsModal } from './components/SoundSettingsModal';
import { Level1Hunter } from './components/levels/Level1Hunter';
import { Level2Detective } from './components/levels/Level2Detective';
import { Level3SIUnits } from './components/levels/Level3SIUnits';
import { Level4Instruments } from './components/levels/Level4Instruments';
import { Level5Conversion } from './components/levels/Level5Conversion';
import { Level6Dimensions } from './components/levels/Level6Dimensions';
import { Level7Equations } from './components/levels/Level7Equations';
import { Level8Contextual } from './components/levels/Level8Contextual';
import { Level9BossBattle } from './components/levels/Level9BossBattle';
import { AppState, loadGameState, saveGameState } from './utils/storage';
import { ScreenMode } from './types';
import { sound } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<AppState>(loadGameState);
  const [screenMode, setScreenMode] = useState<ScreenMode>('main_menu');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);

  // Global Modals
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState<boolean>(false);

  // Auto-save game state to localStorage
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Level Completion Handler
  const handleLevelComplete = (levelId: number, scoreGained: number, stars: number) => {
    setGameState((prev) => {
      const existing = prev.levelsProgress[levelId] || { score: 0, stars: 0, completed: false, bestTimeSeconds: 0 };
      const newScore = Math.max(existing.score, scoreGained);
      const newStars = Math.max(existing.stars, stars);

      const updatedProgress = {
        ...prev.levelsProgress,
        [levelId]: {
          score: newScore,
          stars: newStars,
          completed: true,
          bestTimeSeconds: 0,
        },
      };

      // Recalculate total score
      const newTotalScore = Object.values(updatedProgress).reduce((acc, curr) => acc + curr.score, 0);

      // Check badges unlocks
      const updatedBadges = prev.badges.map((b) => {
        let shouldUnlock = b.unlocked;
        if (b.id === 'hunter' && levelId === 1) shouldUnlock = true;
        if (b.id === 'detective' && levelId === 2) shouldUnlock = true;
        if (b.id === 'si_expert' && levelId === 3) shouldUnlock = true;
        if (b.id === 'measurement_master' && levelId === 4) shouldUnlock = true;
        if (b.id === 'dim_scientist' && (levelId === 6 || levelId === 7)) shouldUnlock = true;
        if (b.id === 'real_world_hero' && levelId === 8) shouldUnlock = true;
        if (b.id === 'physics_grandmaster' && levelId === 9) shouldUnlock = true;
        return { ...b, unlocked: shouldUnlock };
      });

      return {
        ...prev,
        levelsProgress: updatedProgress,
        totalScore: newTotalScore,
        badges: updatedBadges,
      };
    });
  };

  const startLevel = (lvlId: number) => {
    setCurrentLevelId(lvlId);
    setScreenMode('playing');
  };

  const handleNextLevel = () => {
    if (currentLevelId < 9) {
      setCurrentLevelId((prev) => prev + 1);
      setScreenMode('playing');
    } else {
      setScreenMode('level_select');
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#050b14] text-slate-100 select-none">
      {/* Top Header - Always visible with IFP-friendly touch buttons */}
      <Header
        currentLevelId={screenMode === 'playing' ? currentLevelId : undefined}
        totalScore={gameState.totalScore}
        onGoHome={() => setScreenMode('main_menu')}
        onGoLevels={() => setScreenMode('level_select')}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSoundSettings={() => setIsSoundSettingsOpen(true)}
      />

      {/* Main Screen Container - Strictly locked within 16:9 Viewport (No page scroll) */}
      <main className="flex-1 w-full h-[calc(100vh-72px)] overflow-hidden relative">
        {screenMode === 'main_menu' && (
          <MainMenu
            onStartAdventure={() => startLevel(1)}
            onOpenLevelSelect={() => setScreenMode('level_select')}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenSoundSettings={() => setIsSoundSettingsOpen(true)}
            onOpenBadges={() => setIsBadgesOpen(true)}
          />
        )}

        {screenMode === 'level_select' && (
          <LevelSelectMenu
            progress={gameState.levelsProgress}
            onSelectLevel={startLevel}
            onBack={() => setScreenMode('main_menu')}
          />
        )}

        {screenMode === 'playing' && (
          <>
            {currentLevelId === 1 && (
              <Level1Hunter
                onComplete={(score, stars) => handleLevelComplete(1, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 2 && (
              <Level2Detective
                onComplete={(score, stars) => handleLevelComplete(2, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 3 && (
              <Level3SIUnits
                onComplete={(score, stars) => handleLevelComplete(3, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 4 && (
              <Level4Instruments
                onComplete={(score, stars) => handleLevelComplete(4, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 5 && (
              <Level5Conversion
                onComplete={(score, stars) => handleLevelComplete(5, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 6 && (
              <Level6Dimensions
                onComplete={(score, stars) => handleLevelComplete(6, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 7 && (
              <Level7Equations
                onComplete={(score, stars) => handleLevelComplete(7, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 8 && (
              <Level8Contextual
                onComplete={(score, stars) => handleLevelComplete(8, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
            {currentLevelId === 9 && (
              <Level9BossBattle
                onComplete={(score, stars) => handleLevelComplete(9, score, stars)}
                onSelectLevel={() => setScreenMode('level_select')}
                onNextLevel={handleNextLevel}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        badges={gameState.badges}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <SoundSettingsModal
        isOpen={isSoundSettingsOpen}
        onClose={() => setIsSoundSettingsOpen(false)}
      />
    </div>
  );
}
