import React, { useState, useEffect } from 'react';
import { PlayerProfile, Hero, Zone, GameItem } from './types/game';
import { INITIAL_HEROES, ZONES } from './data/gameData';
import {
  getPlayerProfile,
  savePlayerProfile,
  addPlayerExp,
  getTeacherSettings,
  getStudentsScores,
  saveStudentsScores,
} from './utils/storage';
import { sound } from './utils/audio';

// Components
import { HeaderNav } from './components/HeaderNav';
import { LobbyView } from './components/LobbyView';
import { HeroSelectModal } from './components/HeroSelectModal';
import { ArenaMapView } from './components/ArenaMapView';
import { BattleView } from './components/BattleView';
import { MaterialsView } from './components/MaterialsView';
import { QuestsView } from './components/QuestsView';
import { ShopView } from './components/ShopView';
import { AssessmentView } from './components/AssessmentView';
import { AICoachModal } from './components/AICoachModal';
import { ChatAndDiscussionModal } from './components/ChatAndDiscussionModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GuideModal } from './components/GuideModal';

export default function App() {
  const [activeView, setActiveView] = useState<string>('lobby');
  const [player, setPlayer] = useState<PlayerProfile>(() => getPlayerProfile());
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Modals state
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Teacher mode & settings
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [teacherSettings, setTeacherSettings] = useState(() => getTeacherSettings());

  // Find currently active hero
  const currentHero: Hero =
    INITIAL_HEROES.find((h) => h.id === player.selectedHeroId) || INITIAL_HEROES[0];

  // Save profile changes
  const updatePlayer = (newProfile: PlayerProfile) => {
    setPlayer(newProfile);
    savePlayerProfile(newProfile);
  };

  // Hero Selection Handler
  const handleSelectHero = (heroId: string, skinId: string) => {
    const updated: PlayerProfile = {
      ...player,
      selectedHeroId: heroId,
      selectedSkinId: skinId,
    };
    updatePlayer(updated);
    setActiveView('lobby');
  };

  // Enter Battle Handler
  const handleEnterBattle = (zone: Zone) => {
    setSelectedZone(zone);
    setActiveView('battle');
  };

  // Battle Victory Handler
  const handleBattleVictory = (
    updatedProfile: PlayerProfile,
    gainedExp: number,
    gainedGold: number
  ) => {
    const withGold: PlayerProfile = {
      ...updatedProfile,
      gold: updatedProfile.gold + gainedGold,
    };

    const { updatedProfile: finalProfile, leveledUp } = addPlayerExp(withGold, gainedExp);
    if (leveledUp) {
      sound.playLevelUp();
    }
    updatePlayer(finalProfile);
    setActiveView('arena');
  };

  // Shop Buy Item Handler
  const handleBuyItem = (item: GameItem) => {
    if (player.gold < item.price) return;

    const inventory = [...player.inventory];
    const existingIndex = inventory.findIndex((i) => i.itemId === item.id);

    if (existingIndex >= 0) {
      inventory[existingIndex] = {
        ...inventory[existingIndex],
        quantity: inventory[existingIndex].quantity + 1,
      };
    } else {
      inventory.push({ itemId: item.id, quantity: 1 });
    }

    const updated: PlayerProfile = {
      ...player,
      gold: player.gold - item.price,
      inventory,
    };
    updatePlayer(updated);
  };

  // Equip Item Handler
  const handleEquipItem = (itemId: string) => {
    let equipped = [...player.equippedItems];
    if (equipped.includes(itemId)) {
      equipped = equipped.filter((id) => id !== itemId);
    } else {
      equipped.push(itemId);
    }
    const updated: PlayerProfile = { ...player, equippedItems: equipped };
    updatePlayer(updated);
  };

  // Quest Reward Claim Handler
  const handleClaimQuestReward = (questId: string, expReward: number, goldReward: number) => {
    if (player.completedQuests.includes(questId)) return;

    const completedQuests = [...player.completedQuests, questId];
    const withGold: PlayerProfile = {
      ...player,
      gold: player.gold + goldReward,
      completedQuests,
    };

    const { updatedProfile } = addPlayerExp(withGold, expReward);
    updatePlayer(updatedProfile);
  };

  // Assessment Score Save Handler
  const handleSaveAssessmentScore = (score: number, answers: number[]) => {
    const updated: PlayerProfile = {
      ...player,
      assessmentTaken: true,
      assessmentScore: score,
      assessmentAnswers: answers,
    };
    updatePlayer(updated);

    // Also sync to teacher students score registry
    const existingStudents = getStudentsScores();
    const updatedList = existingStudents.map((st) => {
      if (st.name === player.name || st.name.includes('Siswa')) {
        return {
          ...st,
          score,
          level: player.level,
          zonesCompleted: player.highestZoneUnlocked,
          status: (score >= 75 ? 'LULUS' : 'REMEDIAL') as 'LULUS' | 'REMEDIAL',
        };
      }
      return st;
    });
    saveStudentsScores(updatedList);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header Bar */}
      <HeaderNav
        activeView={activeView}
        setActiveView={setActiveView}
        openCoach={() => setIsCoachOpen(true)}
        openTeacherDashboard={() => setIsTeacherOpen(true)}
        openChat={() => setIsChatOpen(true)}
        isTeacherMode={isTeacherMode}
        setIsTeacherMode={setIsTeacherMode}
        gold={player.gold}
        level={player.level}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'lobby' && (
          <LobbyView
            player={player}
            selectedHero={currentHero}
            onNavigate={(view) => setActiveView(view)}
            onOpenCoach={() => setIsCoachOpen(true)}
            onOpenTeacher={() => setIsTeacherOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {activeView === 'arena' && (
          <ArenaMapView
            player={player}
            onEnterBattle={handleEnterBattle}
            onBack={() => setActiveView('lobby')}
          />
        )}

        {activeView === 'battle' && selectedZone && (
          <BattleView
            zone={selectedZone}
            player={player}
            selectedHero={currentHero}
            onVictory={handleBattleVictory}
            onBackToArena={() => setActiveView('arena')}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        )}

        {activeView === 'heroes' && (
          <HeroSelectModal
            currentHeroId={player.selectedHeroId}
            onSelectHero={handleSelectHero}
            onBack={() => setActiveView('lobby')}
          />
        )}

        {activeView === 'materials' && (
          <MaterialsView
            onOpenDiscussion={() => setIsChatOpen(true)}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        )}

        {activeView === 'quests' && (
          <QuestsView
            player={player}
            onClaimReward={handleClaimQuestReward}
            onNavigateToArena={() => setActiveView('arena')}
            onBack={() => setActiveView('lobby')}
          />
        )}

        {activeView === 'shop' && (
          <ShopView
            player={player}
            onBuyItem={handleBuyItem}
            onEquipItem={handleEquipItem}
            onBack={() => setActiveView('lobby')}
          />
        )}

        {activeView === 'assessment' && (
          <AssessmentView
            player={player}
            onSaveAssessmentScore={handleSaveAssessmentScore}
            onBack={() => setActiveView('lobby')}
          />
        )}
      </main>

      {/* Global Modals */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        isAssessment={activeView === 'assessment'}
      />

      <ChatAndDiscussionModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        player={player}
        isTeacherMode={isTeacherMode}
        chatEnabled={teacherSettings.chatEnabled}
      />

      <TeacherDashboardModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={setIsTeacherMode}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        player={player}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
