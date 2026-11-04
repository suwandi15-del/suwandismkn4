import React, { useState } from 'react';
import { Zone, PlayerProfile } from '../types/game';
import { ZONES } from '../data/gameData';
import { Swords, Lock, CheckCircle2, ChevronRight, Zap, Trophy, Shield, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ArenaMapViewProps {
  player: PlayerProfile;
  onEnterBattle: (zone: Zone) => void;
  onBack: () => void;
}

export const ArenaMapView: React.FC<ArenaMapViewProps> = ({
  player,
  onEnterBattle,
  onBack,
}) => {
  // Current selected zone in viewer
  const [selectedZone, setSelectedZone] = useState<Zone>(() => {
    const currentUnlocked = ZONES.find((z) => z.id === player.highestZoneUnlocked);
    return currentUnlocked || ZONES[0];
  });

  const isZoneUnlocked = (zoneId: number) => {
    return zoneId <= player.highestZoneUnlocked;
  };

  const isZoneCompleted = (zoneId: number) => {
    return player.completedZones.includes(zoneId);
  };

  const handleStartBattle = (zone: Zone) => {
    if (!isZoneUnlocked(zone.id)) {
      sound.playWrong();
      return;
    }
    sound.playButtonClick();
    onEnterBattle(zone);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono-math uppercase text-cyan-400 tracking-wider">
            ARENA MOBA 6 WILAYAH
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-game text-white tracking-wide">
            PETA PETUALANGAN BILANGAN BERPANGKAT
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Selesaikan misi pada setiap wilayah secara berurutan untuk membuka jalan menuju pertempuran pamungkas melawan Boss Dark Exponent!
          </p>
        </div>

        <button
          onClick={() => { sound.playButtonClick(); onBack(); }}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-colors"
        >
          Kembali ke Lobby
        </button>
      </div>

      {/* Main Grid: Interactive Map Nodes + Zone Detail Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 6 Connected Zone Nodes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative">
            <h3 className="text-sm font-bold text-slate-300 font-mono-math uppercase mb-5">
              JALUR WILAYAH PERTEMPURAN (Fase 1 - 6)
            </h3>

            <div className="space-y-3 relative">
              {ZONES.map((zone, index) => {
                const unlocked = isZoneUnlocked(zone.id);
                const completed = isZoneCompleted(zone.id);
                const isSelected = selectedZone.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      sound.playButtonClick();
                      setSelectedZone(zone);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950'
                        : unlocked
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                        : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Node Indicator */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          completed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                            : unlocked
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : unlocked ? (
                          <span>0{zone.id}</span>
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-white">
                            {zone.name}
                          </h4>
                          {zone.id === 6 && (
                            <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.2 rounded font-mono-math font-bold">
                              BOSS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-cyan-400 font-mono-math mt-0.5">
                          {zone.ruleFormula}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {completed ? (
                        <span className="text-[11px] text-emerald-400 font-semibold font-mono-math bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          SELESAI
                        </span>
                      ) : unlocked ? (
                        <span className="text-[11px] text-cyan-300 font-semibold font-mono-math bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                          TERBUKA
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono-math">
                          TERKUNCI
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Zone Briefing */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 space-y-6 sticky top-20 shadow-2xl">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-math uppercase text-cyan-400 font-bold">
                BRIEFING WILAYAH {selectedZone.id} DARI 6
              </span>
              {isZoneCompleted(selectedZone.id) ? (
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono-math">
                  Zona Ditaklukkan
                </span>
              ) : isZoneUnlocked(selectedZone.id) ? (
                <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded font-mono-math">
                  Siap Dihadapi
                </span>
              ) : (
                <span className="text-xs bg-slate-950 text-slate-500 border border-slate-800 px-2 py-0.5 rounded font-mono-math">
                  Selesaikan Zona Sebelumnya
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold font-game text-white">
              {selectedZone.name}
            </h3>
            <p className="text-sm font-semibold text-slate-300">
              {selectedZone.conceptTitle}
            </p>
          </div>

          {/* Formula Display Box */}
          <div className="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] uppercase font-mono-math text-slate-400 tracking-wider">
              RUMUS KUNCI ZONA INI
            </span>
            <div className="text-xl sm:text-2xl font-bold text-cyan-300 font-mono-math tracking-wide">
              {selectedZone.ruleFormula}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {selectedZone.description}
          </p>

          {/* Quest & Rewards */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-400 font-mono-math flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>{selectedZone.questTitle}</span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedZone.questDescription}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono-math">
              <span className="text-slate-400">Hadiah Penyelesaian:</span>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">+{selectedZone.expReward} EXP</span>
                <span className="text-yellow-400 font-bold">+{selectedZone.goldReward} Gold</span>
              </div>
            </div>
          </div>

          {/* Monsters Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400 font-mono-math">
              PENJAGA WILAYAH
            </span>
            {selectedZone.id === 6 ? (
              <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-950 border border-red-700 flex items-center justify-center font-bold text-red-400">
                  BOSS
                </div>
                <div>
                  <h5 className="text-xs font-bold text-red-300">DARK EXPONENT</h5>
                  <p className="text-[11px] text-slate-400">6 Fase Pertempuran Campuran Sifat Eksponen</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {selectedZone.monsters.map((monster) => (
                  <div key={monster.id} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">{monster.name}</span>
                      <span className="text-[10px] text-slate-400">{monster.title}</span>
                    </div>
                    <span className="text-[11px] font-mono-math text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900">
                      HP {monster.hp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Launch Button */}
          <button
            onClick={() => handleStartBattle(selectedZone)}
            disabled={!isZoneUnlocked(selectedZone.id)}
            className={`w-full py-4 font-game font-bold tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              isZoneUnlocked(selectedZone.id)
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-900/40 hover:scale-102 active:scale-98'
                : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
            }`}
          >
            {isZoneUnlocked(selectedZone.id) ? (
              <>
                <Swords className="w-5 h-5 text-white" />
                <span>MASUK WILAYAH & BERTARUNG</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-500" />
                <span>ZONA MASIH TERKUNCI</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
