import React, { useState, useEffect } from 'react';
import { Zone, Hero, PlayerProfile, Monster, MathQuestion, Boss, BossPhase } from '../types/game';
import { BOSS_DARK_EXPONENT, GAME_ITEMS, IMAGES } from '../data/gameData';
import { sound } from '../utils/audio';
import {
  Shield,
  Heart,
  Zap,
  Flame,
  Sparkles,
  Swords,
  Trophy,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FlaskConical,
} from 'lucide-react';

interface BattleViewProps {
  zone: Zone;
  player: PlayerProfile;
  selectedHero: Hero;
  onVictory: (updatedPlayer: PlayerProfile, gainedExp: number, gainedGold: number) => void;
  onBackToArena: () => void;
  onOpenCoach: () => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  zone,
  player,
  selectedHero,
  onVictory,
  onBackToArena,
  onOpenCoach,
}) => {
  const isBossZone = zone.id === 6;

  // Hero Battle States
  const [heroHp, setHeroHp] = useState<number>(selectedHero.baseHp);
  const [maxHeroHp] = useState<number>(selectedHero.baseHp);
  const [heroMana, setHeroMana] = useState<number>(selectedHero.baseMana);
  const [maxHeroMana] = useState<number>(selectedHero.baseMana);
  
  // Skills Cooldown States
  const [skillCooldowns, setSkillCooldowns] = useState<{ [skillId: string]: number }>({});
  const [activeBuff, setActiveBuff] = useState<{
    damageMultiplier: number;
    shieldValue: number;
    doubleExp: boolean;
  }>({ damageMultiplier: 1, shieldValue: 0, doubleExp: false });

  // Monsters / Boss Progression
  const [monsterIndex, setMonsterIndex] = useState<number>(0);
  const [bossPhaseIndex, setBossPhaseIndex] = useState<number>(0);
  
  // Current Target State
  const currentMonster: Monster | undefined = !isBossZone ? zone.monsters[monsterIndex] : undefined;
  const currentBossPhase: BossPhase | undefined = isBossZone ? BOSS_DARK_EXPONENT.phases[bossPhaseIndex] : undefined;

  const targetName = isBossZone ? `DARK EXPONENT (FASE ${bossPhaseIndex + 1}/6)` : currentMonster?.name || 'Monster';
  const targetTitle = isBossZone ? currentBossPhase?.ruleTitle || '' : currentMonster?.title || '';
  const maxTargetHp = isBossZone ? currentBossPhase?.hp || 50 : currentMonster?.hp || 80;
  
  const [targetHp, setTargetHp] = useState<number>(maxTargetHp);

  // Question & Combat Flow
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [eliminatedOptionIndex, setEliminatedOptionIndex] = useState<number | null>(null);

  // Visual Combat Feedback
  const [combatLog, setCombatLog] = useState<string>('Pertarungan dimulai! Perhatikan sifat bilangan berpangkat dan lancarkan serangan!');
  const [damageFloater, setDamageFloater] = useState<{ text: string; color: string; isTarget: boolean } | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);

  // End Battle Dialogs
  const [battleState, setBattleState] = useState<'FIGHTING' | 'VICTORY' | 'DEFEAT'>('FIGHTING');
  const [totalExpGained, setTotalExpGained] = useState<number>(0);
  const [totalGoldGained, setTotalGoldGained] = useState<number>(0);

  // Potions count in player inventory
  const [potionCount, setPotionCount] = useState<number>(() => {
    const pot = player.inventory.find((i) => i.itemId === 'item-concentration-potion');
    return pot ? pot.quantity : 0;
  });

  // Setup current question when monster or boss phase changes
  useEffect(() => {
    if (isBossZone) {
      if (currentBossPhase) {
        setCurrentQuestion(currentBossPhase.question);
        setTargetHp(currentBossPhase.hp);
        sound.playBossRoar();
      }
    } else {
      if (currentMonster) {
        // Pick question for current monster
        const q = currentMonster.questions[0] || null;
        setCurrentQuestion(q);
        setTargetHp(currentMonster.hp);
      }
    }
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setEliminatedOptionIndex(null);
  }, [monsterIndex, bossPhaseIndex, isBossZone]);

  // Skill Activations
  const handleUseSkill = (skill: typeof selectedHero.skills[0]) => {
    if (heroMana < skill.manaCost) {
      sound.playWrong();
      setCombatLog('Mana tidak mencukupi untuk skill ini!');
      return;
    }
    if ((skillCooldowns[skill.id] || 0) > 0) {
      sound.playWrong();
      setCombatLog(`Skill ${skill.name} masih cooldown!`);
      return;
    }

    // Deduct mana
    setHeroMana((prev) => Math.max(0, prev - skill.manaCost));
    setSkillCooldowns((prev) => ({ ...prev, [skill.id]: skill.cooldownTurns }));
    sound.playSpell();

    if (skill.effectType === 'DAMAGE_BOOST') {
      const mult = 1 + skill.effectValue / 100;
      setActiveBuff((prev) => ({ ...prev, damageMultiplier: mult }));
      setCombatLog(`Skill Aktif: ${skill.name}! Serangan jawaban benar berikutnya meningkat +${skill.effectValue}%!`);
    } else if (skill.effectType === 'SHIELD') {
      setActiveBuff((prev) => ({ ...prev, shieldValue: skill.effectValue }));
      setCombatLog(`Skill Aktif: ${skill.name}! Menyerap ${skill.effectValue} kerusakan jika salah!`);
    } else if (skill.effectType === 'HEAL') {
      setHeroHp((prev) => Math.min(maxHeroHp, prev + skill.effectValue));
      setDamageFloater({ text: `+${skill.effectValue} HP`, color: 'text-emerald-400', isTarget: false });
      setCombatLog(`Skill Aktif: ${skill.name}! Memulihkan ${skill.effectValue} HP hero!`);
    } else if (skill.effectType === 'HINT') {
      // Eliminate one wrong option
      if (currentQuestion) {
        const wrongIndices = currentQuestion.options
          .map((_, idx) => idx)
          .filter((idx) => idx !== currentQuestion.correctIndex);
        if (wrongIndices.length > 0) {
          setEliminatedOptionIndex(wrongIndices[0]);
          setCombatLog(`Skill Aktif: ${skill.name}! Satu pilihan salah berhasil dieliminasi!`);
        }
      }
    } else if (skill.effectType === 'DOUBLE_EXP') {
      setActiveBuff((prev) => ({ ...prev, doubleExp: true }));
      setCombatLog(`Skill Aktif: ${skill.name}! Mendapatkan bonus EXP tambahan!`);
    }
  };

  // Use Concentration Potion from inventory
  const handleUsePotion = () => {
    if (potionCount <= 0) {
      sound.playWrong();
      setCombatLog('Kamu tidak memiliki Concentration Potion lagi!');
      return;
    }
    sound.playSpell();
    setPotionCount((prev) => prev - 1);
    setHeroHp((prev) => Math.min(maxHeroHp, prev + 45));
    setDamageFloater({ text: '+45 HP (Potion)', color: 'text-emerald-400', isTarget: false });
    setCombatLog('Mengonsumsi Concentration Potion! HP dipulihkan sebesar 45 poin.');
  };

  // Submit Answer
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted || index === eliminatedOptionIndex) return;

    setSelectedOptionIndex(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion?.correctIndex;
    setIsAnswerCorrect(isCorrect);

    // Reduce skill cooldowns on turn
    setSkillCooldowns((prev) => {
      const updated: { [k: string]: number } = {};
      Object.keys(prev).forEach((k) => {
        if (prev[k] > 1) updated[k] = prev[k] - 1;
      });
      return updated;
    });

    if (isCorrect) {
      // Hero attacks monster!
      sound.playCorrect();
      sound.playAttack();

      const baseDmg = selectedHero.attackPower;
      const totalDmg = Math.round(baseDmg * activeBuff.damageMultiplier * (1 + comboStreak * 0.15));
      const nextTargetHp = Math.max(0, targetHp - totalDmg);

      setTargetHp(nextTargetHp);
      setComboStreak((prev) => prev + 1);
      setDamageFloater({ text: `-${totalDmg} HP! HIT`, color: 'text-amber-400', isTarget: true });
      setCombatLog(`Serangan berhasil! Kamu menjawab benar. Memberikan ${totalDmg} damage kepada ${targetName}!`);

      // Reset active buff
      setActiveBuff({ damageMultiplier: 1, shieldValue: 0, doubleExp: activeBuff.doubleExp });

      // Check if monster / phase defeated
      if (nextTargetHp <= 0) {
        setTimeout(() => {
          handleTargetDefeated();
        }, 1200);
      }
    } else {
      // Monster counter-attacks!
      sound.playWrong();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      const incomingDmg = isBossZone ? 32 : currentMonster?.attack || 20;
      const netDmg = Math.max(0, incomingDmg - activeBuff.shieldValue - Math.floor(selectedHero.defense * 0.3));
      const nextHeroHp = Math.max(0, heroHp - netDmg);

      setHeroHp(nextHeroHp);
      setComboStreak(0);
      setDamageFloater({ text: `-${netDmg} HP`, color: 'text-red-400', isTarget: false });
      setCombatLog(`Jawaban keliru! ${targetName} menyerang balik sebesar ${netDmg} damage!`);

      // Reset shield
      setActiveBuff({ damageMultiplier: 1, shieldValue: 0, doubleExp: activeBuff.doubleExp });

      if (nextHeroHp <= 0) {
        setTimeout(() => {
          setBattleState('DEFEAT');
          sound.playWrong();
        }, 1000);
      }
    }
  };

  // Next Question or Monster
  const handleTargetDefeated = () => {
    sound.playLevelUp();

    if (isBossZone) {
      const expReward = Math.round(100 * (activeBuff.doubleExp ? 1.5 : 1));
      const goldReward = 50;
      setTotalExpGained((prev) => prev + expReward);
      setTotalGoldGained((prev) => prev + goldReward);

      if (bossPhaseIndex < BOSS_DARK_EXPONENT.phases.length - 1) {
        // Move to next Boss phase
        setBossPhaseIndex((prev) => prev + 1);
        setCombatLog(`Fase ${bossPhaseIndex + 1} Tuntas! Dark Exponent memasuki fase berikutnya dengan pertahanan baru!`);
      } else {
        // Boss Completely Slain!
        setBattleState('VICTORY');
        sound.playLevelUp();
      }
    } else {
      const expReward = Math.round((currentMonster?.rewardExp || 80) * (activeBuff.doubleExp ? 1.5 : 1));
      const goldReward = currentMonster?.rewardGold || 50;
      setTotalExpGained((prev) => prev + expReward);
      setTotalGoldGained((prev) => prev + goldReward);

      if (zone.monsters && monsterIndex < zone.monsters.length - 1) {
        // Next monster in zone
        setMonsterIndex((prev) => prev + 1);
        setCombatLog(`Monster dikalahkan! Melanjutkan ke monster penjaga berikutnya di ${zone.name}!`);
      } else {
        // Zone Completed!
        setBattleState('VICTORY');
        sound.playLevelUp();
      }
    }
  };

  // Next turn question continue
  const handleNextQuestion = () => {
    sound.playButtonClick();
    setIsAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setEliminatedOptionIndex(null);
    setDamageFloater(null);

    // Regenerate small mana per turn
    setHeroMana((prev) => Math.min(maxHeroMana, prev + 15));

    // If monster still has HP, cycle to next question if available
    if (targetHp > 0) {
      if (currentMonster && currentMonster.questions.length > 1) {
        const nextQIndex = (currentMonster.questions.findIndex((q) => q.id === currentQuestion?.id) + 1) % currentMonster.questions.length;
        setCurrentQuestion(currentMonster.questions[nextQIndex]);
      }
    }
  };

  // Final Victory Claim
  const handleClaimVictory = () => {
    const finalExp = totalExpGained + zone.expReward;
    const finalGold = totalGoldGained + zone.goldReward;

    const completedSet = new Set(player.completedZones);
    completedSet.add(zone.id);

    const nextHighest = Math.max(player.highestZoneUnlocked, zone.id < 6 ? zone.id + 1 : 6);
    const badges = [...player.badges];
    if (zone.id === 6 && !badges.includes('Master of Exponents')) {
      badges.push('Master of Exponents');
      badges.push('Boss Slayer');
    }

    const updatedProfile: PlayerProfile = {
      ...player,
      highestZoneUnlocked: nextHighest,
      completedZones: Array.from(completedSet),
      battlesWon: player.battlesWon + 1,
      battlesTotal: player.battlesTotal + 1,
      badges,
    };

    onVictory(updatedProfile, finalExp, finalGold);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 ${screenShake ? 'animate-pulse' : ''}`}>
      
      {/* Top Combat HUD */}
      <div className="bg-slate-950/90 border border-cyan-800/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Hero Bar (Left) */}
          <div className="w-full md:w-5/12 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/50">
                  <img src={selectedHero.avatarUrl} alt={selectedHero.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{selectedHero.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono-math">Lv.{player.level} · {selectedHero.role}</span>
                </div>
              </div>
              <div className="text-right text-xs font-mono-math">
                <span className="text-emerald-400 font-bold">{heroHp}</span> / {maxHeroHp} HP
              </div>
            </div>

            {/* HP Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${Math.max(0, (heroHp / maxHeroHp) * 100)}%` }}
              />
            </div>

            {/* Mana Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono-math text-indigo-300 pt-0.5">
              <span>MANA: {heroMana} / {maxHeroMana}</span>
              {comboStreak > 1 && (
                <span className="text-amber-400 font-bold animate-pulse">
                  COMBO ×{comboStreak}! (+{comboStreak * 15}% DMG)
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${Math.max(0, (heroMana / maxHeroMana) * 100)}%` }}
              />
            </div>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-700 border-2 border-cyan-300 flex items-center justify-center font-game font-bold text-xs text-white shadow-lg shadow-cyan-500/20">
              VS
            </div>
            <span className="text-[10px] text-slate-400 font-mono-math mt-1">
              {zone.slug.toUpperCase()}
            </span>
          </div>

          {/* Target Monster / Boss Bar (Right) */}
          <div className="w-full md:w-5/12 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-left text-xs font-mono-math">
                <span className="text-red-400 font-bold">{targetHp}</span> / {maxTargetHp} HP
              </div>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-xs font-bold text-white block">{targetName}</span>
                  <span className="text-[10px] text-red-400 font-mono-math">{targetTitle}</span>
                </div>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-red-500/50">
                  <img
                    src={isBossZone ? IMAGES.bossDarkExponent : IMAGES.bossDarkExponent}
                    alt={targetName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Monster HP Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300"
                style={{ width: `${Math.max(0, (targetHp / maxTargetHp) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono-math text-slate-400 pt-0.5">
              <span>{isBossZone ? `FASE ${bossPhaseIndex + 1} DARI 6` : `MONSTER ${monsterIndex + 1} DARI ${zone.monsters.length}`}</span>
              <span className="text-amber-400">STATUS: {targetHp > 0 ? 'BERTARUNG' : 'DIKALAHKAN'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Arena Stage Visualizer */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-900/60 bg-slate-950 p-6 sm:p-8 min-h-[220px] flex items-center justify-between shadow-2xl">
        <img
          src={IMAGES.arenaBg}
          alt="Battle Arena"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

        {/* Hero Sprite Stage */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-xl shadow-cyan-950/80 bg-slate-900">
            <img src={selectedHero.avatarUrl} alt={selectedHero.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold font-game text-cyan-300">{selectedHero.name}</span>
          
          {/* Damage floater on hero */}
          {damageFloater && !damageFloater.isTarget && (
            <div className={`absolute -top-4 font-mono-math font-extrabold text-lg animate-bounce ${damageFloater.color}`}>
              {damageFloater.text}
            </div>
          )}
        </div>

        {/* Center Combat Log & Formula Clue */}
        <div className="relative z-10 max-w-md text-center px-4 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono-math">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIFAT: {currentQuestion?.propertyRule || zone.ruleFormula}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium bg-slate-900/80 p-3 rounded-xl border border-slate-800 shadow-md">
            {combatLog}
          </p>
        </div>

        {/* Monster Sprite Stage */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-red-500 shadow-xl shadow-red-950/80 bg-slate-900">
            <img
              src={isBossZone ? IMAGES.bossDarkExponent : IMAGES.bossDarkExponent}
              alt={targetName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-bold font-game text-red-400">{targetName}</span>

          {/* Damage floater on monster */}
          {damageFloater && damageFloater.isTarget && (
            <div className={`absolute -top-4 font-mono-math font-extrabold text-lg animate-bounce ${damageFloater.color}`}>
              {damageFloater.text}
            </div>
          )}
        </div>
      </div>

      {/* Hero Skills & Combat Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        
        {/* Skills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono-math text-slate-400 uppercase font-semibold mr-1">
            SKILL HERO:
          </span>
          {selectedHero.skills.map((skill) => {
            const cd = skillCooldowns[skill.id] || 0;
            const canUse = heroMana >= skill.manaCost && cd === 0;

            return (
              <button
                key={skill.id}
                onClick={() => handleUseSkill(skill)}
                disabled={!canUse}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  canUse
                    ? 'bg-indigo-950/70 hover:bg-indigo-900 text-cyan-200 border-indigo-700 active:scale-95'
                    : 'bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{skill.name}</span>
                <span className="text-[10px] font-mono-math text-indigo-400">
                  {cd > 0 ? `CD ${cd}` : `${skill.manaCost} MP`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Potion & AI Coach Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleUsePotion}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Potion ({potionCount})</span>
          </button>

          <button
            onClick={() => { sound.playButtonClick(); onOpenCoach(); }}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-700/60 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya AI Coach</span>
          </button>
        </div>

      </div>

      {/* Mathematical Combat Question Card */}
      {currentQuestion && (
        <div className="bg-slate-900/90 border border-cyan-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="space-y-2 text-center">
            <span className="text-xs uppercase font-mono-math text-cyan-400 font-bold tracking-wider">
              TANTANGAN MATEMATIKA PERTARUNGAN
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-100">
              {currentQuestion.prompt}
            </p>
            <div className="py-3 px-6 bg-slate-950 border border-cyan-800/40 rounded-xl inline-block text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono-math tracking-wider shadow-inner">
              {currentQuestion.expression}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              const isEliminated = idx === eliminatedOptionIndex;

              let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-cyan-500 hover:bg-slate-900 text-slate-200';

              if (isEliminated) {
                btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 line-through opacity-40 cursor-not-allowed';
              } else if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/50';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500/50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted || isEliminated}
                  className={`p-4 rounded-xl border text-left font-mono-math text-base transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-semibold">{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Pedagogical Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1 ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : 'bg-red-950/40 border-red-700/60 text-red-200'
                }`}
              >
                <div className="font-bold flex items-center gap-2">
                  {isAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>HEBAT! SERANGAN BERHASIL DILANCARKAN!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>JAWABAN KURANG TEPAT! PERHATIKAN PEMBAHASAN INI:</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {currentQuestion.explanation}
                </p>
              </div>

              {targetHp > 0 && heroHp > 0 && (
                <div className="text-center">
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-game font-bold tracking-wider rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    LANJUTKAN GILIRAN BERIKUTNYA
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* VICTORY MODAL OVERLAY */}
      {battleState === 'VICTORY' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Trophy className="w-10 h-10 text-slate-950" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono-math uppercase text-cyan-400 font-bold tracking-widest">
                VICTORY · WILAYAH DITAKLUKKAN!
              </span>
              <h3 className="text-3xl font-extrabold font-game text-white tracking-wide">
                KEMENANGAN LEGENDA!
              </h3>
              <p className="text-xs text-slate-300">
                Luar biasa, Hero! Kamu berhasil menguasai sifat bilangan berpangkat di wilayah ini dan mengalahkan penjaga arena!
              </p>
            </div>

            {/* Rewards */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 gap-4 font-mono-math">
              <div>
                <span className="text-xs text-slate-400 block">Total EXP</span>
                <span className="text-xl font-bold text-cyan-400">+{totalExpGained + zone.expReward} EXP</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Total Gold</span>
                <span className="text-xl font-bold text-yellow-400">+{totalGoldGained + zone.goldReward} Gold</span>
              </div>
            </div>

            <button
              onClick={handleClaimVictory}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-game font-bold tracking-widest text-base rounded-xl shadow-lg shadow-cyan-900/50 transition-all hover:scale-102 active:scale-98"
            >
              KLAIM HADIAH & KEMBALI KE PETA
            </button>
          </div>
        </div>
      )}

      {/* DEFEAT MODAL OVERLAY */}
      {battleState === 'DEFEAT' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-red-950 border border-red-700 flex items-center justify-center shadow-xl shadow-red-950/50">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono-math uppercase text-red-400 font-bold tracking-widest">
                DEFEAT · HP HERO HABIS
              </span>
              <h3 className="text-3xl font-extrabold font-game text-white tracking-wide">
                PERTAHANAN JEBOL
              </h3>
              <p className="text-xs text-slate-300">
                Jangan menyerah! Pelajari kembali rumus dan contoh soal di Menu Materi, atau beli Concentration Potion dan perlengkapan di Armory.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  sound.playButtonClick();
                  // Reset state for instant retry
                  setHeroHp(selectedHero.baseHp);
                  setHeroMana(selectedHero.baseMana);
                  setTargetHp(maxTargetHp);
                  setIsAnswerSubmitted(false);
                  setSelectedOptionIndex(null);
                  setBattleState('FIGHTING');
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi Pertarungan</span>
              </button>

              <button
                onClick={() => {
                  sound.playButtonClick();
                  onBackToArena();
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
              >
                Kembali ke Arena
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
