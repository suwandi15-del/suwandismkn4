import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, RotateCcw, Lightbulb } from 'lucide-react';
import { sound } from '../utils/audio';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAssessment?: boolean;
}

interface CoachMessage {
  id: string;
  sender: 'HERO' | 'COACH';
  text: string;
  timestamp: string;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  isAssessment = false,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      sender: 'COACH',
      text: 'Halo, Pahlawan Matematika SMKN 4 Soppeng! Saya AI Coach – Sahabat Hero. Butuh bimbingan sifat bilangan berpangkat, strategi menghadapi monster, atau petunjuk menyelesaikan quest? Tanyakan apa saja padaku!',
      timestamp: 'Baru saja',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Coach, kenapa 2³ × 2⁴ hasilnya 2⁷?',
    'Jelaskan sifat pembagian aᵐ : aⁿ = aᵐ⁻ⁿ',
    'Kenapa bilangan dipangkatkan nol hasilnya 1?',
    'Bagaimana memahami pangkat negatif a⁻ⁿ = 1/aⁿ?',
    'Beri strategi menaklukkan Boss Dark Exponent di Zona 6!',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    sound.playButtonClick();

    const userMsg: CoachMessage = {
      id: `u-${Date.now()}`,
      sender: 'HERO',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context: 'Game Edu Legends Power Survival - Matematika SMK Fase E Sifat-Sifat Bilangan Berpangkat',
          isAssessment,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi AI Coach');
      }

      const data = await response.json();
      sound.playSpell();

      const coachMsg: CoachMessage = {
        id: `c-${Date.now()}`,
        sender: 'COACH',
        text: data.reply || 'Tetap semangat belajar, Hero! Terus berlatih di setiap zona!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: CoachMessage = {
        id: `c-err-${Date.now()}`,
        sender: 'COACH',
        text: 'Hero, jangan lupa aturan dasarnya: pada perkalian basis sama jumlahkan pangkat (aᵐ × aⁿ = aᵐ⁺ⁿ), pada pembagian kurangkan pangkat (aᵐ : aⁿ = aᵐ⁻ⁿ), dan pangkat negatif adalah kebalikan (a⁻ⁿ = 1/aⁿ). Semangat berjuang!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-800/60 rounded-3xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-cyan-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-game font-bold text-base text-white">
                  AI COACH – SAHABAT HERO
                </h3>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-mono-math">
                  AKTIF
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pelatih Matematika Pribadi Fase E · SMKN 4 Soppeng
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playButtonClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assessment Guard Notice */}
        {isAssessment && (
          <div className="bg-amber-950/60 border-b border-amber-900/60 px-4 py-2 text-xs text-amber-300 font-mono-math flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Mode Asesmen Aktif: AI Coach hanya memberi bimbingan konsep, bukan kunci jawaban.</span>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isHero = msg.sender === 'HERO';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isHero ? 'justify-end' : 'justify-start'}`}
              >
                {!isHero && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isHero
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 font-mono-math ${
                      isHero ? 'text-cyan-200 text-right' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-cyan-400 font-mono-math flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AI Coach sedang menyusun bimbingan matematika...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/60 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputVal);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tanyakan konsep, rumus, atau strategi matematika..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
