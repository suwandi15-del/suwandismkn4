import React, { useState } from 'react';
import { PlayerProfile } from '../types/game';
import { Trophy, Award, Medal, Shield, Sparkles, X, Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  player,
}) => {
  const [tab, setTab] = useState<'LEADERBOARD' | 'BADGES'>('LEADERBOARD');

  if (!isOpen) return null;

  const mockLeaderboard = [
    { rank: 1, name: 'Nurul Annisa Putri', classGroup: 'X TKJ 1', hero: 'Lumina Mathic', level: 14, exp: 2840, zones: '6/6', badge: 'Boss Slayer' },
    { rank: 2, name: 'Fitri Handayani', classGroup: 'X AKL 2', hero: 'Chrono Aegis', level: 13, exp: 2510, zones: '6/6', badge: 'Master of Exponents' },
    { rank: 3, name: 'Andi Muhammad Fadil', classGroup: 'X TKJ 1', hero: 'Aegis Valorous', level: 12, exp: 2320, zones: '6/6', badge: 'Brave Hero' },
    { rank: 4, name: 'Siti Rahmawati', classGroup: 'X RPL 1', hero: 'Shadow Factor', level: 11, exp: 1950, zones: '5/6', badge: 'Quiz Champion' },
    { rank: 5, name: player.name, classGroup: player.classGrade, hero: player.selectedHeroId, level: player.level, exp: player.exp, zones: `${player.highestZoneUnlocked}/6`, badge: 'Rising Star', isCurrent: true },
    { rank: 6, name: 'Muh. Resky Pratama', classGroup: 'X TBSM 2', hero: 'Ignis Striker', level: 9, exp: 1420, zones: '4/6', badge: 'Team Player' },
    { rank: 7, name: 'Ahmad Fauzan', classGroup: 'X TKRO 1', hero: 'Zephyr Arrow', level: 6, exp: 980, zones: '3/6', badge: 'Explorer' },
  ];

  const badgesList = [
    { id: 'b1', name: 'First Victory', desc: 'Memenangkan pertempuran matematika pertama di zona mana pun.', unlocked: player.battlesWon > 0 },
    { id: 'b2', name: 'Master of Exponents', desc: 'Menaklukkan seluruh 6 Zona pembelajaran bilangan berpangkat.', unlocked: player.completedZones.length >= 6 },
    { id: 'b3', name: 'Boss Slayer', desc: 'Mengalahkan Boss Terakhir Dark Exponent dalam 6 fase beruntun.', unlocked: player.completedZones.includes(6) },
    { id: 'b4', name: 'Quiz Champion', desc: 'Meraih nilai sempurna pada asesmen akhir resmi.', unlocked: (player.assessmentScore || 0) >= 90 },
    { id: 'b5', name: 'Team Player', desc: 'Berpartisipasi aktif dalam forum diskusi dan chat kelas.', unlocked: true },
    { id: 'b6', name: 'Learning Legend', desc: 'Mencapai Level 10 ke atas sebagai pahlawan matematika.', unlocked: player.level >= 10 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => { sound.playButtonClick(); setTab('LEADERBOARD'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  tab === 'LEADERBOARD' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                <span>Peringkat Kelas</span>
              </button>
              <button
                onClick={() => { sound.playButtonClick(); setTab('BADGES'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  tab === 'BADGES' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Medal className="w-3.5 h-3.5 text-amber-300" />
                <span>Lencana Kehormatan</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-500 font-mono-math hidden sm:inline">
              SMKN 4 SOPPENG
            </span>
          </div>

          <button
            onClick={() => { sound.playButtonClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {tab === 'LEADERBOARD' ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between px-2 font-mono-math">
                <span>Peringkat Berdasarkan Level & Akumulasi EXP</span>
                <span>Fase E SMK</span>
              </div>

              <div className="space-y-2 font-mono-math text-xs">
                {mockLeaderboard.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      item.isCurrent
                        ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                        : item.rank === 1
                        ? 'bg-amber-950/20 border-amber-600/60'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-md'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm font-sans">{item.name}</span>
                          {item.isCurrent && (
                            <span className="text-[9px] bg-cyan-900 text-cyan-200 px-1.5 py-0.2 rounded font-mono-math">
                              ANDA
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.classGroup} · Zona: <strong className="text-cyan-400">{item.zones}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-300 block">Lv.{item.level}</span>
                      <span className="text-[10px] text-slate-400">{item.exp} EXP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* BADGES VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgesList.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                    badge.unlocked
                      ? 'bg-slate-950/80 border-cyan-600/60 shadow-md'
                      : 'bg-slate-950/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-600 border-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    <Medal className="w-6 h-6" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{badge.name}</h4>
                      {badge.unlocked && (
                        <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.2 rounded font-mono-math">
                          TERBUKA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
