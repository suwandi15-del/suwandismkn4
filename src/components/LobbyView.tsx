import React from 'react';
import {
  Swords,
  Users,
  MapPin,
  Scroll,
  BookOpen,
  Bot,
  GraduationCap,
  Trophy,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Zap,
  ShoppingBag,
  Flame,
  Award,
} from 'lucide-react';
import { Hero, PlayerProfile } from '../types/game';
import { sound } from '../utils/audio';
import { IMAGES } from '../data/gameData';

interface LobbyViewProps {
  player: PlayerProfile;
  selectedHero: Hero;
  onNavigate: (view: string) => void;
  onOpenCoach: () => void;
  onOpenTeacher: () => void;
  onOpenGuide: () => void;
  onOpenLeaderboard: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  player,
  selectedHero,
  onNavigate,
  onOpenCoach,
  onOpenTeacher,
  onOpenGuide,
  onOpenLeaderboard,
}) => {
  const expPercentage = Math.min(100, Math.round((player.exp / player.nextLevelExp) * 100));

  return (
    <div className="relative min-h-[calc(100vh-65px)] pb-16">
      {/* Background Graphic Texture & Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <img
          src={IMAGES.arenaBg}
          alt="MOBA Arena"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-[#060913]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8">
        
        {/* Academic & Teacher Identity Banner */}
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/80 border border-cyan-800/40 rounded-2xl p-5 lg:p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-300 font-semibold uppercase tracking-wider">
                <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 px-2.5 py-0.5 rounded">
                  SMKN 4 SOPPENG
                </span>
                <span>·</span>
                <span>Matematika Kelas X SMK (Fase E)</span>
                <span>·</span>
                <span className="text-amber-300">Guru: Suwandi, S.Pd.</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-game text-white">
                EDU LEGENDS: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">POWER SURVIVAL</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Media Pembelajaran Interaktif MOBA – Taklukkan 6 Zona Pertempuran Matematika dan kuasai seluruh Sifat-Sifat Bilangan Berpangkat!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                onClick={() => { sound.playButtonClick(); onOpenTeacher(); }}
                className="px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 rounded-xl transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Portal Guru Suwandi</span>
              </button>
              <button
                onClick={() => { sound.playButtonClick(); onOpenGuide(); }}
                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Panduan Main</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Showcase & Player Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Active Hero Portrait Card */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-cyan-800/40 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-cyan-500/15 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 font-mono-math">
                  HERO AKTIF · {selectedHero.role}
                </span>
                <h2 className="text-2xl font-bold font-game text-white tracking-wide mt-0.5">
                  {selectedHero.name}
                </h2>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  "{selectedHero.title}"
                </p>
              </div>
              <button
                onClick={() => { sound.playButtonClick(); onNavigate('heroes'); }}
                className="text-xs text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                Ganti Hero
              </button>
            </div>

            {/* Hero Image Presentation */}
            <div className="my-5 flex justify-center relative">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl shadow-cyan-950/80 group-hover:scale-102 transition-transform duration-300">
                <img
                  src={selectedHero.avatarUrl}
                  alt={selectedHero.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono-math text-slate-300">
                  <span className="text-cyan-300 font-semibold">HP {selectedHero.baseHp}</span>
                  <span className="text-indigo-300 font-semibold">MANA {selectedHero.baseMana}</span>
                  <span className="text-amber-300 font-semibold">ATK {selectedHero.attackPower}</span>
                </div>
              </div>
            </div>

            {/* Hero Quote & Skill Badges */}
            <div className="space-y-3">
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center italic">
                {selectedHero.quote}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedHero.skills.map((skill) => (
                  <div key={skill.id} className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-cyan-950 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-[10px]">
                      S
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{skill.name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono-math">Mana: {skill.manaCost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Player Stats & Main Battlefield Launch */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            
            {/* Player Progression Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{player.name}</span>
                    <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono-math">
                      {player.classGrade}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Pahlawan Pembelajar Matematika Fase E</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Kekayaan</span>
                    <span className="text-amber-400 font-bold font-mono-math text-base">
                      {player.gold} Gold
                    </span>
                  </div>
                </div>
              </div>

              {/* Level & EXP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono-math">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    LEVEL {player.level}
                  </span>
                  <span className="text-slate-400">
                    EXP: <span className="text-slate-200 font-semibold">{player.exp}</span> / {player.nextLevelExp} ({expPercentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-500 rounded-full"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Summary Chips */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                  <span className="text-slate-400 block text-[11px]">Zona Terbuka</span>
                  <span className="text-cyan-300 font-bold font-mono-math text-base">
                    {player.highestZoneUnlocked} / 6
                  </span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                  <span className="text-slate-400 block text-[11px]">Kemenangan</span>
                  <span className="text-emerald-400 font-bold font-mono-math text-base">
                    {player.battlesWon} Win
                  </span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                  <span className="text-slate-400 block text-[11px]">Nilai Asesmen</span>
                  <span className="text-amber-300 font-bold font-mono-math text-base">
                    {player.assessmentTaken ? `${player.assessmentScore} / 100` : 'Belum'}
                  </span>
                </div>
              </div>
            </div>

            {/* Giant Primary Battle Launch Button */}
            <div className="bg-gradient-to-r from-cyan-950/90 via-indigo-950/90 to-purple-950/90 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl shadow-cyan-900/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                  SIAPKAN STRATEGI MATEMATIKA
                </div>
                <h3 className="text-2xl font-bold font-game text-white tracking-wide">
                  MASUK KE ARENA BATTLE
                </h3>
                <p className="text-xs text-slate-300 max-w-md">
                  Pilih wilayah pertempuran, jawab soal perpangkatan, kalahkan monster penjaga, dan hadapi Boss Dark Exponent!
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playButtonClick();
                  onNavigate('arena');
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-game font-bold tracking-widest text-base sm:text-lg rounded-xl shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300/60 transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-3"
              >
                <Swords className="w-6 h-6 text-white" />
                <span>MULAI BERMAIN</span>
              </button>
            </div>

          </div>
        </div>

        {/* 8 Feature Hub Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-game text-white tracking-wide">
              MENU UTAMA PERMAINAN
            </h3>
            <span className="text-xs text-slate-400">Pilih modul pembelajaran & petualangan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Arena 6 Wilayah */}
            <button
              onClick={() => { sound.playButtonClick(); onNavigate('arena'); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Arena 6 Zona
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Peta 6 sifat bilangan berpangkat
                </p>
              </div>
            </button>

            {/* Card 2: Pilih Hero */}
            <button
              onClick={() => { sound.playButtonClick(); onNavigate('heroes'); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Pilih Hero
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  6 Hero: Tank, Mage, Fighter, dll
                </p>
              </div>
            </button>

            {/* Card 3: Materi Pembelajaran */}
            <button
              onClick={() => { sound.playButtonClick(); onNavigate('materials'); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Materi Eksponen
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Penjelasan & contoh langkah demi langkah
                </p>
              </div>
            </button>

            {/* Card 4: Quest & Misi */}
            <button
              onClick={() => { sound.playButtonClick(); onNavigate('quests'); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Scroll className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Quest & Misi
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Klaim reward EXP & Gold
                </p>
              </div>
            </button>

            {/* Card 5: Armory & Shop */}
            <button
              onClick={() => { sound.playButtonClick(); onNavigate('shop'); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Armory & Toko
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Buku Eksponen, Perisai, Potion
                </p>
              </div>
            </button>

            {/* Card 6: AI Coach */}
            <button
              onClick={() => { sound.playButtonClick(); onOpenCoach(); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-cyan-900/60 hover:border-cyan-400 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md shadow-cyan-900/50">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    AI Coach
                  </h4>
                  <span className="text-[9px] bg-cyan-900/80 text-cyan-300 px-1.5 py-0.2 rounded font-mono-math">
                    SMART
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Sahabat Hero pembimbing konsep
                </p>
              </div>
            </button>

            {/* Card 7: Asesmen Akhir 10 Soal */}
            <button
              onClick={() => { sound.playButtonClick(); onNavigate('assessment'); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Asesmen Akhir
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  10 Soal C3 & C4 Pilihan Ganda
                </p>
              </div>
            </button>

            {/* Card 8: Leaderboard */}
            <button
              onClick={() => { sound.playButtonClick(); onOpenLeaderboard(); }}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-950/80 border border-yellow-800 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
                  Leaderboard
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Peringkat & lencana kehormatan
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* Footer Credit & SMKN 4 Soppeng Sign-off */}
        <div className="text-center pt-8 pb-4 text-xs text-slate-500 border-t border-slate-800/80 space-y-1">
          <p className="font-semibold text-slate-400">
            EDU LEGENDS: POWER SURVIVAL – Game Pembelajaran Interaktif Matematika Berbasis MOBA
          </p>
          <p>
            Materi Sifat-Sifat Bilangan Berpangkat Kelas X SMK (Fase E) · <span className="text-cyan-400 font-medium">oleh Suwandi SMKN 4 Soppeng</span>
          </p>
        </div>

      </div>
    </div>
  );
};
