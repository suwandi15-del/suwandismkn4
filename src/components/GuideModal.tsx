import React from 'react';
import { HelpCircle, Swords, BookOpen, Shield, Bot, GraduationCap, X, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-game font-bold text-base text-white">
                PANDUAN LENGKAP PERMAINAN
              </h3>
              <p className="text-[11px] text-slate-400">
                EDU LEGENDS: POWER SURVIVAL · SMKN 4 Soppeng
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playButtonClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 font-game">
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>1. Alur & Mekanisme Pertempuran Matematika</span>
            </h4>
            <p>
              Di EDU LEGENDS, setiap aksi pertempuran MOBA digerakkan oleh ketepatanmu menjawab soal sifat-sifat bilangan berpangkat:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <li><strong>Jawaban Benar</strong>: Heromu melancarkan serangan dahsyat kepada monster/boss penjaga zona sesuai Attack Power dan efek skill.</li>
              <li><strong>Jawaban Salah</strong>: Monster membalas serangan dan HP heromu berkurang. Jika HP heromu habis, pertempuran harus diulang.</li>
              <li><strong>Combo Bonus</strong>: Menjawab benar berturut-turut meningkatkan multiplier serangan dan bonus perolehan EXP.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 font-game">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>2. Enam Wilayah Materi Sifat Bilangan Berpangkat</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-math">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Zona 1: Perkalian</span>
                <span>aᵐ × aⁿ = aᵐ⁺ⁿ (basis sama)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Zona 2: Pembagian</span>
                <span>aᵐ : aⁿ = aᵐ⁻ⁿ (dengan a ≠ 0)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Zona 3: Pangkat Ganda</span>
                <span>(aᵐ)ⁿ = aᵐˣⁿ</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Zona 4: Pangkat Negatif</span>
                <span>a⁻ⁿ = 1/aⁿ (inversi nilai)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Zona 5: Pangkat Nol</span>
                <span>a⁰ = 1 (a ≠ 0)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-red-400 font-bold block">Zona 6: Boss Dark Exponent</span>
                <span>Operasi Campuran 6 Sifat</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 font-game">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>3. Karakteristik Role Hero & Pemanfaatan Skill</span>
            </h4>
            <p>
              Setiap role memiliki gaya bermain unik:
            </p>
            <div className="space-y-1.5 text-xs">
              <p>• <strong>TANK</strong>: Memiliki HP & defense terbesar, memiliki skill perisai peredam kerusakan jika salah hitung.</p>
              <p>• <strong>FIGHTER</strong>: Seimbang antara serangan dan ketahanan fisik.</p>
              <p>• <strong>MAGE</strong>: Memiliki serangan sihir terbesar dan mana berlimpah, mampu melipatgandakan serangan formula.</p>
              <p>• <strong>MARKSMAN</strong>: Penembak beruntun dengan kecepatan tinggi dan bonus perolehan EXP.</p>
              <p>• <strong>ASSASSIN</strong>: Menyerang kilat dengan burst damage mematikan.</p>
              <p>• <strong>SUPPORT</strong>: Memulihkan HP hero dan memberi buff EXP ganda.</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 font-game">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>4. AI Coach – Sahabat Hero</span>
            </h4>
            <p>
              Jika kamu kesulitan memahami konsep atau langkah penyelesaian soal di arena, klik tombol <strong>AI Coach</strong>. AI Coach siap menjelaskan mengapa suatu rumus berlaku, memberi petunjuk, dan menyusun strategi belajar tanpa langsung membocorkan jawaban resmi!
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 font-game">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>5. Asesmen Akhir Resmi & Rekap Nilai</span>
            </h4>
            <p>
              Setelah menaklukkan arena, kerjakan <strong>Asesmen Akhir 10 Soal Pilihan Ganda</strong>. Skor asesmen bersifat objektif dan terekam secara otomatis di Dashboard Guru Suwandi, S.Pd. SMKN 4 Soppeng.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
