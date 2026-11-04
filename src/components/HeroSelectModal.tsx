import React, { useState } from 'react';
import { Hero } from '../types/game';
import { INITIAL_HEROES } from '../data/gameData';
import { Shield, Flame, Sparkles, Crosshair, Zap, HeartHandshake, Check, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroSelectModalProps {
  currentHeroId: string;
  onSelectHero: (heroId: string, skinId: string) => void;
  onBack: () => void;
}

export const HeroSelectModal: React.FC<HeroSelectModalProps> = ({
  currentHeroId,
  onSelectHero,
  onBack,
}) => {
  const [selectedHero, setSelectedHero] = useState<Hero>(() => {
    return INITIAL_HEROES.find((h) => h.id === currentHeroId) || INITIAL_HEROES[0];
  });
  const [selectedSkinId, setSelectedSkinId] = useState<string>(selectedHero.skins[0]?.id || 'skin-1');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'TANK': return <Shield className="w-4 h-4 text-sky-400" />;
      case 'FIGHTER': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'MAGE': return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'MARKSMAN': return <Crosshair className="w-4 h-4 text-emerald-400" />;
      case 'ASSASSIN': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'SUPPORT': return <HeartHandshake className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  const handleChoose = () => {
    sound.playLevelUp();
    onSelectHero(selectedHero.id, selectedSkinId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono-math uppercase text-cyan-400 tracking-wider">
            ROSTER HERO ORISINAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-game text-white tracking-wide">
            PILIH PAHLAWAN MATEMATIKAMU
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Setiap pahlawan memiliki atribut dan skill khusus yang membantumu menjawab soal dan bertahan hidup di arena.
          </p>
        </div>

        <button
          onClick={() => { sound.playButtonClick(); onBack(); }}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-colors"
        >
          Kembali ke Lobby
        </button>
      </div>

      {/* Hero Selection Grid & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 6 Heroes Grid Selection */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {INITIAL_HEROES.map((hero) => {
            const isSelected = selectedHero.id === hero.id;
            const isEquipped = currentHeroId === hero.id;

            return (
              <button
                key={hero.id}
                onClick={() => {
                  sound.playButtonClick();
                  setSelectedHero(hero);
                  setSelectedSkinId(hero.skins[0]?.id || 'skin-1');
                }}
                className={`relative rounded-2xl p-4 text-left transition-all border flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl shadow-cyan-950/80 scale-102'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Active Tag */}
                {isEquipped && (
                  <div className="absolute top-2 right-2 bg-cyan-900/80 text-cyan-300 border border-cyan-600/60 rounded text-[9px] font-mono-math px-1.5 py-0.5">
                    HERO UTAMA
                  </div>
                )}

                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 border border-slate-800 group-hover:border-slate-700">
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs font-semibold text-white">
                    {getRoleIcon(hero.role)}
                    <span className="text-[11px] font-mono-math">{hero.role}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {hero.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {hero.title}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono-math">
                  <span>ATK {hero.attackPower}</span>
                  <span>DEF {hero.defense}</span>
                  <span>HP {hero.baseHp}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Hero Profile, Radar, Skills & Skin Preview */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 space-y-6 sticky top-20 shadow-2xl">
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-math text-cyan-400 font-bold uppercase">
                {getRoleIcon(selectedHero.role)}
                <span>ROLE: {selectedHero.role}</span>
              </div>
              <h3 className="text-2xl font-bold font-game text-white mt-1">
                {selectedHero.name}
              </h3>
              <p className="text-xs text-slate-400">{selectedHero.title}</p>
            </div>

            <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-500/50 shadow-md">
              <img
                src={selectedHero.avatarUrl}
                alt={selectedHero.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {selectedHero.description}
          </p>

          {/* Stat Bars */}
          <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs font-mono-math">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Daya Tahan (HP)</span>
              <span className="text-cyan-300 font-bold">{selectedHero.baseHp}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(selectedHero.baseHp / 160) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Kapasitas Mana</span>
              <span className="text-indigo-300 font-bold">{selectedHero.baseMana}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(selectedHero.baseMana / 160) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Kekuatan Serangan (ATK)</span>
              <span className="text-amber-300 font-bold">{selectedHero.attackPower}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(selectedHero.attackPower / 50) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Pertahanan (DEF)</span>
              <span className="text-emerald-300 font-bold">{selectedHero.defense}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedHero.defense / 40) * 100}%` }} />
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-math">
              KEMAMPUAN MATEMATIKA (SKILL)
            </h4>
            <div className="space-y-2">
              {selectedHero.skills.map((skill) => (
                <div key={skill.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">{skill.name}</span>
                    <span className="text-[10px] text-indigo-300 font-mono-math bg-indigo-950 px-2 py-0.5 rounded">
                      Mana: {skill.manaCost} · Cooldown: {skill.cooldownTurns} Turn
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skin Selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400 font-mono-math">
              PILIH KOSTUM (SKIN)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {selectedHero.skins.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => {
                    sound.playButtonClick();
                    setSelectedSkinId(skin.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                    selectedSkinId === skin.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-white font-semibold'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{skin.name}</span>
                  {selectedSkinId === skin.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Selection CTA */}
          <button
            onClick={handleChoose}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-game font-bold tracking-wider rounded-xl shadow-lg shadow-cyan-900/40 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 text-white" />
            <span>PILIH SEBAGAI HERO UTAMA</span>
          </button>

        </div>

      </div>

    </div>
  );
};
