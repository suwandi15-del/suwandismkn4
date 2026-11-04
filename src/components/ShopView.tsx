import React from 'react';
import { PlayerProfile, GameItem } from '../types/game';
import { GAME_ITEMS } from '../data/gameData';
import { ShoppingBag, ShieldCheck, BookOpen, Footprints, Sparkle, FlaskConical, Check, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShopViewProps {
  player: PlayerProfile;
  onBuyItem: (item: GameItem) => void;
  onEquipItem: (itemId: string) => void;
  onBack: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  player,
  onBuyItem,
  onEquipItem,
  onBack,
}) => {
  const getItemIcon = (name: string) => {
    switch (name) {
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-sky-400" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'Sparkle': return <Sparkle className="w-5 h-5 text-indigo-400" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-teal-400" />;
      default: return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getItemQuantity = (itemId: string) => {
    const inv = player.inventory.find((i) => i.itemId === itemId);
    return inv ? inv.quantity : 0;
  };

  const isEquipped = (itemId: string) => player.equippedItems.includes(itemId);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono-math uppercase text-cyan-400 tracking-wider">
            ARMORY MOBA & PERLENGKAPAN HERO
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-game text-white tracking-wide">
            TOKO ITEM & PERALATAN MATEMATIKA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan Gold dari kemenangan arena untuk membeli item penambah serangan, pertahanan, dan ramuan konsentrasi!
          </p>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-auto">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono-math">
            <span className="text-slate-400 block text-[10px]">SALDO GOLD</span>
            <span className="text-yellow-400 font-bold text-base">{player.gold} Gold</span>
          </div>

          <button
            onClick={() => { sound.playButtonClick(); onBack(); }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-colors"
          >
            Kembali ke Lobby
          </button>
        </div>
      </div>

      {/* Items Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAME_ITEMS.map((item) => {
          const qty = getItemQuantity(item.id);
          const equipped = isEquipped(item.id);
          const canAfford = player.gold >= item.price;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                equipped
                  ? 'bg-slate-900/90 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getItemIcon(item.iconName)}
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-yellow-400 font-mono-math">
                      {item.price} Gold
                    </span>
                    {qty > 0 && (
                      <span className="text-[10px] text-cyan-300 block font-mono-math">
                        Dimiliki: {qty}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-game">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Effect Pill */}
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono-math text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item.effect}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                {!item.consumable && qty > 0 ? (
                  <button
                    onClick={() => {
                      sound.playButtonClick();
                      onEquipItem(item.id);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-game transition-all flex items-center justify-center gap-1.5 ${
                      equipped
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {equipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>DIPASANG</span>
                      </>
                    ) : (
                      <span>PASANG ITEM</span>
                    )}
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    if (canAfford) {
                      sound.playLevelUp();
                      onBuyItem(item);
                    } else {
                      sound.playWrong();
                    }
                  }}
                  disabled={!canAfford}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-game transition-all flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>BELI {item.consumable ? '+1' : ''}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
