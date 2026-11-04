import React from 'react';
import { PlayerProfile } from '../types/game';
import { ZONES } from '../data/gameData';
import { Scroll, CheckCircle2, Lock, Gift, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuestsViewProps {
  player: PlayerProfile;
  onClaimReward: (questId: string, exp: number, gold: number) => void;
  onNavigateToArena: () => void;
  onBack: () => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  player,
  onClaimReward,
  onNavigateToArena,
  onBack,
}) => {
  const isQuestCompleted = (zoneId: number) => player.completedZones.includes(zoneId);
  const isRewardClaimed = (questId: string) => player.completedQuests.includes(questId);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono-math uppercase text-cyan-400 tracking-wider">
            SISTEM MISI & HADIAH PEMBELAJARAN
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-game text-white tracking-wide">
            QUEST MATEMATIKA FASE E
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Selesaikan misi utama di setiap zona dan tantangan harian untuk memperoleh pasokan EXP dan Gold berlimpah!
          </p>
        </div>

        <button
          onClick={() => { sound.playButtonClick(); onBack(); }}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-colors"
        >
          Kembali ke Lobby
        </button>
      </div>

      {/* Quests Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main 6 Quests (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 font-mono-math uppercase flex items-center gap-2">
            <Scroll className="w-4 h-4 text-cyan-400" />
            <span>6 MAIN QUEST SIFAT BILANGAN BERPANGKAT</span>
          </h3>

          <div className="space-y-3">
            {ZONES.map((zone) => {
              const questId = `quest-zone-${zone.id}`;
              const completed = isQuestCompleted(zone.id);
              const claimed = isRewardClaimed(questId);

              return (
                <div
                  key={zone.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    completed
                      ? 'bg-slate-900/90 border-cyan-700/60 shadow-md'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-math font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        ZONA {zone.id}
                      </span>
                      <h4 className="font-bold text-white text-base">
                        {zone.questTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300">
                      {zone.questDescription}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono-math text-slate-400 pt-1">
                      <span>Konsep: <strong className="text-cyan-400">{zone.ruleFormula}</strong></span>
                      <span>·</span>
                      <span className="text-cyan-300">+{zone.expReward} EXP</span>
                      <span>·</span>
                      <span className="text-yellow-400">+{zone.goldReward} Gold</span>
                    </div>
                  </div>

                  <div className="shrink-0 self-start sm:self-auto">
                    {claimed ? (
                      <span className="px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-1.5 font-mono-math">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>KLAIM SELESAI</span>
                      </span>
                    ) : completed ? (
                      <button
                        onClick={() => {
                          sound.playLevelUp();
                          onClaimReward(questId, zone.expReward, zone.goldReward);
                        }}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 animate-bounce font-game"
                      >
                        <Gift className="w-4 h-4" />
                        <span>KLAIM HADIAH</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playButtonClick();
                          onNavigateToArena();
                        }}
                        className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <span>Selesaikan di Arena</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Practice Quests (Right 4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-20">
          <div className="space-y-1">
            <span className="text-xs font-mono-math uppercase text-amber-400 font-bold">
              MISI HARIAN TAMBAHAN
            </span>
            <h4 className="text-lg font-bold font-game text-white">
              DAILY POWER DRILL
            </h4>
            <p className="text-xs text-slate-400">
              Perkuat kemampuan matematika setiap hari untuk mendapatkan pasokan gold dan potion!
            </p>
          </div>

          <div className="space-y-3 text-xs">
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">1. Hero Battle Trial</span>
                <span className="text-yellow-400 font-mono-math">+40 Gold</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Menangkan minimal 1 pertarungan hari ini di zona mana saja.
              </p>
              <div className="text-[10px] text-cyan-400 font-mono-math">
                Progres: {player.battlesWon > 0 ? '1 / 1 (Tuntas)' : '0 / 1'}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">2. Tanya Sahabat Hero</span>
                <span className="text-cyan-400 font-mono-math">+50 EXP</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Buka panel AI Coach dan tanyakan sifat matematika yang sulit kamu pahami.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">3. Siap Ujian Asesmen</span>
                <span className="text-amber-400 font-mono-math">+100 EXP</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Kerjakan 10 soal asesmen akhir untuk memperoleh nilai resmi di daftar nilai guru.
              </p>
              <div className="text-[10px] text-amber-400 font-mono-math">
                Status: {player.assessmentTaken ? 'Sudah Dikerjakan' : 'Belum Dikerjakan'}
              </div>
            </div>

          </div>

          <button
            onClick={() => { sound.playButtonClick(); onNavigateToArena(); }}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-game font-bold tracking-wider text-xs rounded-xl shadow-lg transition-all"
          >
            LANGSUNG KE ARENA
          </button>
        </div>

      </div>

    </div>
  );
};
