import React from 'react';
import { Volume2, VolumeX, Shield, Award, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openCoach: () => void;
  openTeacherDashboard: () => void;
  openChat: () => void;
  isTeacherMode: boolean;
  setIsTeacherMode: (val: boolean) => void;
  gold: number;
  level: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeView,
  setActiveView,
  openCoach,
  openTeacherDashboard,
  openChat,
  isTeacherMode,
  setIsTeacherMode,
  gold,
  level,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const navLinks = [
    { id: 'lobby', label: 'Lobby' },
    { id: 'arena', label: 'Arena 6 Zona' },
    { id: 'heroes', label: 'Pilih Hero' },
    { id: 'materials', label: 'Materi' },
    { id: 'quests', label: 'Quest' },
    { id: 'shop', label: 'Armory' },
    { id: 'assessment', label: 'Asesmen Akhir' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark (Strict Top Bar Contract) */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => { sound.playButtonClick(); setActiveView('lobby'); }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-game font-bold tracking-wider text-base lg:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 whitespace-nowrap block">
                EDU LEGENDS
              </span>
              <span className="text-[10px] text-cyan-400 tracking-widest font-semibold block uppercase">
                POWER SURVIVAL
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Concise Nav Links (Single-Line, Whitespace-Nowrap) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-slate-300 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sound.playButtonClick();
                  setActiveView(link.id);
                }}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Quick HUD Metrics */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-amber-400 font-semibold font-mono-math">Lv.{level}</span>
            <span className="text-slate-600">|</span>
            <span className="text-yellow-400 font-semibold font-mono-math">{gold} Gold</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-slate-800"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Chat & Discussion Trigger */}
          <button
            onClick={() => { sound.playButtonClick(); openChat(); }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>Chat & Forum</span>
          </button>

          {/* Teacher Mode Switch */}
          <button
            onClick={() => {
              sound.playButtonClick();
              openTeacherDashboard();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
              isTeacherMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 hover:text-amber-300 border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Guru SMKN 4</span>
          </button>

          {/* Primary Action Button: AI Coach */}
          <button
            onClick={() => {
              sound.playButtonClick();
              openCoach();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-md shadow-cyan-900/30 ring-1 ring-cyan-400/40 transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>AI Coach</span>
          </button>
        </div>

      </div>
    </header>
  );
};
