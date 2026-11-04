import React, { useState } from 'react';
import { BookOpen, Sparkles, Calculator, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import { sound } from '../utils/audio';

interface MaterialsViewProps {
  onOpenDiscussion: () => void;
  onOpenCoach: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  onOpenDiscussion,
  onOpenCoach,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Interactive Sandbox state
  const [baseVal, setBaseVal] = useState<number>(2);
  const [expM, setExpM] = useState<number>(3);
  const [expN, setExpN] = useState<number>(4);

  const materials = [
    {
      id: 0,
      title: '1. Konsep Dasar Bilangan Berpangkat',
      subtitle: 'Pengertian Basis dan Eksponen',
      formula: 'aⁿ = a × a × a × ... × a (sebanyak n faktor)',
      explanation: 'Bilangan berpangkat (eksponen) adalah bentuk perkalian berulang dari suatu bilangan yang sama. Bilangan pokok yang dikalikan disebut "basis" (a), sedangkan bilangan yang menunjukkan berapa kali basis dikalikan disebut "pangkat" atau "eksponen" (n).',
      example: 'Contoh: 2⁴ = 2 × 2 × 2 × 2 = 16 (di sini 2 adalah basis dan 4 adalah eksponen).',
      notes: 'Penting diingat: -2⁴ berbeda dengan (-2)⁴! Pada -2⁴ yang dipangkatkan hanya 2 (hasilnya -16), sedangkan (-2)⁴ hasilnya adalah 16.',
    },
    {
      id: 1,
      title: '2. Sifat Perkalian Bilangan Berpangkat',
      subtitle: 'Perkalian dengan Basis yang Sama',
      formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ',
      explanation: 'Jika dua atau lebih bilangan berpangkat yang memiliki basis sama saling dikalikan, maka pangkat-pangkatnya cukup dijumlahkan.',
      example: 'Contoh: 3² × 3³ = (3 × 3) × (3 × 3 × 3) = 3²⁺³ = 3⁵ = 243.',
      notes: 'Syarat mutlak: Sifat ini hanya berlaku jika basisnya sama! Jika basis berbeda seperti 2³ × 3², sifat ini tidak bisa langsung digunakan.',
    },
    {
      id: 2,
      title: '3. Sifat Pembagian Bilangan Berpangkat',
      subtitle: 'Pembagian dengan Basis yang Sama',
      formula: 'aᵐ : aⁿ = aᵐ⁻ⁿ (dengan a ≠ 0)',
      explanation: 'Jika dua bilangan berpangkat yang memiliki basis sama saling dibagi, maka pangkat pembilang dikurangi oleh pangkat penyebut.',
      example: 'Contoh: 5⁶ : 5² = 5⁶⁻² = 5⁴ = 625.',
      notes: 'Jika pangkat pembilang lebih kecil dari penyebut, hasilnya akan menjadi pangkat negatif yang dapat diubah ke pecahan.',
    },
    {
      id: 3,
      title: '4. Sifat Pangkat dari Bilangan Berpangkat',
      subtitle: 'Bilangan Berpangkat yang Dipangkatkan',
      formula: '(aᵐ)ⁿ = aᵐˣⁿ',
      explanation: 'Jika suatu bilangan berpangkat dipangkatkan lagi dengan eksponen lain, maka kedua eksponen tersebut saling dikalikan.',
      example: 'Contoh: (2²)³ = 2²ˣ³ = 2⁶ = 64.',
      notes: 'Aturan ini juga berlaku untuk perkalian suku: (a·b)ⁿ = aⁿ · bⁿ dan pecahan: (a/b)ⁿ = aⁿ / bⁿ.',
    },
    {
      id: 4,
      title: '5. Sifat Pangkat Negatif & Nilai Balikan',
      subtitle: 'Eksponen Negatif Menunjukkan Inversi',
      formula: 'a⁻ⁿ = 1 / aⁿ (dengan a ≠ 0)',
      explanation: 'Pangkat negatif BUKAN berarti bilangan tersebut bernilai negatif! Pangkat negatif menunjukkan kebalikan (invers) atau pecahan dari bilangan berpangkat tersebut.',
      example: 'Contoh: 4⁻² = 1 / (4²) = 1 / 16 (tetap bernilai positif!). Contoh pecahan: (2/3)⁻² = (3/2)² = 9/4.',
      notes: 'Pangkat negatif sering digunakan dalam sains dan teknologi SMK, seperti ukuran memori mikroskopis dan frekuensi gelombang.',
    },
    {
      id: 5,
      title: '6. Sifat Pangkat Nol',
      subtitle: 'Singularitas Eksponen Nol',
      formula: 'a⁰ = 1 (dengan a ≠ 0)',
      explanation: 'Setiap bilangan real yang bukan nol jika dipangkatkan nol hasilnya selalu sama dengan 1. Hal ini dibuktikan melalui sifat pembagian: aⁿ : aⁿ = aⁿ⁻ⁿ = a⁰, dan sembarang bilangan dibagi dirinya sendiri bernilai 1.',
      example: 'Contoh: 100⁰ = 1, (-5)⁰ = 1, (3x²y)⁰ = 1.',
      notes: 'Catatan penting: Bentuk 0⁰ (nol pangkat nol) adalah bentuk tak tentu dan tidak didefinisikan dalam matematika sekolah menengah.',
    },
    {
      id: 6,
      title: '7. Operasi Campuran Sifat-Sifat Eksponen',
      subtitle: 'Kombinasi Seluruh Sifat untuk Menyelesaikan Masalah SMK',
      formula: 'Kombinasi Perkalian, Pembagian, dan Pangkat Ganda',
      explanation: 'Dalam soal nyata bidang kejuruan (kelistrikan, transmisi data komputer, rasio mesin), berbagai sifat eksponen sering digabungkan dalam satu persamaan pecahan aljabar.',
      example: 'Contoh: Sederhanakan ( (x³ y⁻²)² × x⁴ ) / (x² y⁻³) = (x⁶ y⁻⁴ × x⁴) / (x² y⁻³) = (x¹⁰ y⁻⁴) / (x² y⁻³) = x¹⁰⁻² y⁻⁴⁻⁽⁻³⁾ = x⁸ y⁻¹ = x⁸ / y.',
      notes: 'Tips: Kerjakan tanda kurung terlebih dahulu, kumpulkan variabel yang sejenis, lalu sederhanakan eksponen secara teliti!',
    },
  ];

  const currentMat = materials[activeTab];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono-math uppercase text-cyan-400 tracking-wider">
            SUMBER BELAJAR MATEMATIKA FASE E
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-game text-white tracking-wide">
            MATERI SIFAT-SIFAT BILANGAN BERPANGKAT
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pelajari konsep, rumus, contoh langkah demi langkah, dan uji pemahamanmu dengan kalkulator interaktif sebelum terjun ke arena!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => { sound.playButtonClick(); onOpenCoach(); }}
            className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 rounded-xl hover:bg-cyan-900 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tanya AI Coach</span>
          </button>
          <button
            onClick={() => { sound.playButtonClick(); onOpenDiscussion(); }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Forum Diskusi</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tabs Menu on Left, Detailed Material on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Topics List */}
        <div className="lg:col-span-4 space-y-2">
          {materials.map((mat) => {
            const isActive = activeTab === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => {
                  sound.playButtonClick();
                  setActiveTab(mat.id);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg text-white font-bold'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <div className="truncate">
                  <div className="text-xs truncate">{mat.title}</div>
                  <div className="text-[10px] text-cyan-400/80 font-mono-math mt-0.5 truncate">{mat.formula}</div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 rotate-90' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Study Guide & Interactive Calculator */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="space-y-1">
              <span className="text-xs font-mono-math uppercase text-cyan-400 font-bold">
                MODUL {currentMat.id + 1} DARI {materials.length}
              </span>
              <h3 className="text-2xl font-bold font-game text-white">
                {currentMat.title}
              </h3>
              <p className="text-xs text-slate-400">{currentMat.subtitle}</p>
            </div>

            {/* Main Formula Callout */}
            <div className="bg-gradient-to-r from-cyan-950/80 via-slate-950 to-indigo-950/80 border border-cyan-500/50 rounded-2xl p-5 text-center space-y-1 shadow-inner">
              <span className="text-[10px] uppercase font-mono-math text-slate-400 tracking-wider">
                FORMULA UTAMA
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono-math tracking-wider">
                {currentMat.formula}
              </div>
            </div>

            {/* Explanation Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-300 font-mono-math">
                PENJELASAN KONSEP:
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {currentMat.explanation}
              </p>
            </div>

            {/* Step-by-Step Example */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-amber-400 font-mono-math">
                CONTOH PENERAPAN & LANGKAH:
              </h4>
              <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 text-xs sm:text-sm text-amber-200/90 font-mono-math leading-relaxed">
                {currentMat.example}
              </div>
            </div>

            {/* Practical Notes */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-cyan-400 block font-mono-math">CATATAN KHUSUS GURU:</span>
              <p className="leading-relaxed">{currentMat.notes}</p>
            </div>

          </div>

          {/* Interactive Formula Playground Sandbox */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white font-game">
                LABORATORIUM SIMULASI EKSPONEN
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Uji coba nilai basis dan eksponen di bawah ini untuk melihat bagaimana rumus matematika bekerja secara dinamis!
            </p>

            <div className="grid grid-cols-3 gap-4 font-mono-math text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Basis (a):</label>
                <input
                  type="number"
                  value={baseVal}
                  onChange={(e) => setBaseVal(Number(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Pangkat m:</label>
                <input
                  type="number"
                  value={expM}
                  onChange={(e) => setExpM(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-cyan-300 font-bold"
                  min="-4"
                  max="8"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Pangkat n:</label>
                <input
                  type="number"
                  value={expN}
                  onChange={(e) => setExpN(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-indigo-300 font-bold"
                  min="-4"
                  max="8"
                />
              </div>
            </div>

            {/* Live Calculation Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono-math text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">1. Perkalian (aᵐ × aⁿ = aᵐ⁺ⁿ)</span>
                <span className="text-cyan-300 font-bold text-sm block">
                  {baseVal}^{expM} × {baseVal}^{expN} = {baseVal}^{expM + expN}
                </span>
                <span className="text-slate-500 text-[10px]">Nilai: = {Math.pow(baseVal, expM + expN)}</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">2. Pembagian (aᵐ : aⁿ = aᵐ⁻ⁿ)</span>
                <span className="text-indigo-300 font-bold text-sm block">
                  {baseVal}^{expM} : {baseVal}^{expN} = {baseVal}^{expM - expN}
                </span>
                <span className="text-slate-500 text-[10px]">Nilai: = {Math.pow(baseVal, expM - expN)}</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">3. Pangkat Ganda ((aᵐ)ⁿ = aᵐˣⁿ)</span>
                <span className="text-amber-300 font-bold text-sm block">
                  ({baseVal}^{expM})^{expN} = {baseVal}^{expM * expN}
                </span>
                <span className="text-slate-500 text-[10px]">Nilai: = {Math.pow(baseVal, expM * expN)}</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">4. Pangkat Nol & Negatif</span>
                <span className="text-emerald-300 font-bold text-sm block">
                  {baseVal}⁰ = 1 & {baseVal}^(-{Math.abs(expM)}) = 1/{baseVal}^{Math.abs(expM)}
                </span>
                <span className="text-slate-500 text-[10px]">Nilai: = 1/{Math.pow(baseVal, Math.abs(expM))}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
