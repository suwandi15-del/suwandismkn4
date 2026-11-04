import React, { useState, useEffect } from 'react';
import { AssessmentQuestion, PlayerProfile } from '../types/game';
import { ASSESSMENT_QUESTIONS } from '../data/gameData';
import { sound } from '../utils/audio';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';

interface AssessmentViewProps {
  player: PlayerProfile;
  onSaveAssessmentScore: (score: number, answers: number[]) => void;
  onBack: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  player,
  onSaveAssessmentScore,
  onBack,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(player.assessmentTaken);
  const [finalScore, setFinalScore] = useState<number>(player.assessmentScore || 0);

  // Assessment timer (e.g., 20 minutes)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);

  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted]);

  const currentQ: AssessmentQuestion = ASSESSMENT_QUESTIONS[currentIdx];

  const handleSelectAnswer = (optionIdx: number) => {
    if (isCompleted) return;
    sound.playButtonClick();
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  const handleSubmitAssessment = () => {
    sound.playLevelUp();

    let correctCount = 0;
    const answerArr: number[] = [];

    ASSESSMENT_QUESTIONS.forEach((q) => {
      const ans = userAnswers[q.id];
      answerArr.push(ans !== undefined ? ans : -1);
      if (ans === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);
    setFinalScore(score);
    setIsCompleted(true);
    onSaveAssessmentScore(score, answerArr);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono-math uppercase text-amber-400 tracking-wider">
            ASESMEN AKHIR RESMI MATEMATIKA SMK FASE E
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-game text-white tracking-wide">
            EVALUASI SIFAT-SIFAT BILANGAN BERPANGKAT
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Uji pemahaman C3 & C4 kontekstual kejuruan melalui 10 soal pilihan ganda 5 opsi (A–E). Penilaian objektif independen dari skor game.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!isCompleted && (
            <div className="bg-slate-900 border border-amber-600/50 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono-math text-amber-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Sisa Waktu: {formatTimer(secondsRemaining)}</span>
            </div>
          )}

          <button
            onClick={() => { sound.playButtonClick(); onBack(); }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-colors"
          >
            Kembali ke Lobby
          </button>
        </div>
      </div>

      {/* RESULT REPORT VIEW (When completed) */}
      {isCompleted ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Score Card Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-10 h-10 text-cyan-300" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono-math uppercase text-cyan-400 font-bold tracking-widest">
                HASIL ASESMEN AKHIR RESMI
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-game text-white">
                NILAI ANDA: <span className="text-cyan-300">{finalScore}</span> / 100
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {finalScore >= 75
                  ? 'Selamat! Anda dinyatakan LULUS kompetensi sifat-sifat bilangan berpangkat Fase E dengan predikat memuaskan!'
                  : 'Hasil asesmen membutuhkan penguatan/remedial pada beberapa indikator soal. Pelajari pembahasan lengkap di bawah ini!'}
              </p>
            </div>

            <div className="flex justify-center gap-4 text-xs font-mono-math pt-2">
              <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Predikat: <strong>{finalScore >= 85 ? 'Sangat Baik (A)' : finalScore >= 75 ? 'Baik (B)' : 'Perlu Bimbingan (C)'}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
                Guru: <strong>Suwandi, S.Pd.</strong>
              </span>
            </div>
          </div>

          {/* Complete 10 Questions Step-by-Step Review */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-game text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>PEMBAHASAN LENGKAP 10 SOAL ASESMEN</span>
            </h3>

            <div className="space-y-6">
              {ASSESSMENT_QUESTIONS.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-6 space-y-4 ${
                      isCorrect
                        ? 'bg-slate-950/80 border-emerald-800/60'
                        : 'bg-slate-950/80 border-red-900/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-cyan-400 font-bold font-mono-math text-xs flex items-center justify-center border border-slate-700">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{q.topic}</span>
                        <span className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-mono-math border border-slate-800">
                          {q.cognitiveLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono-math text-xs">
                        {isCorrect ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>BENAR (+10)</span>
                          </span>
                        ) : (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            <span>SALAH (0)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="text-[11px] text-cyan-400/80 font-mono-math">
                        Konteks Kejuruan: {q.vocationalContext}
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans">{q.question}</p>
                      <div className="py-2 px-4 bg-slate-900 border border-slate-800 rounded-lg inline-block font-mono-math font-bold text-cyan-300 text-base">
                        {q.expression}
                      </div>
                    </div>

                    {/* 5 Options Review */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 font-mono-math text-xs pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctIndex;
                        const isThisUser = optIdx === userAns;

                        let style = 'bg-slate-900/60 border-slate-800 text-slate-400';
                        if (isThisCorrect) {
                          style = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isThisUser && !isThisCorrect) {
                          style = 'bg-red-950/80 border-red-500 text-red-300 font-bold';
                        }

                        return (
                          <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center justify-between ${style}`}>
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isThisCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {isThisUser && !isThisCorrect && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-Step Pedagogical Solution */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-1">
                      <span className="font-bold text-amber-400 block font-mono-math">PEMBAHASAN LANGKAH DEMI LANGKAH:</span>
                      <p className="text-slate-300 leading-relaxed">{q.stepByStepSolution}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                sound.playButtonClick();
                setIsCompleted(false);
                setUserAnswers({});
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 mx-auto transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Kerjakan Ulang Asesmen</span>
            </button>
          </div>

        </div>
      ) : (
        /* ACTIVE QUESTION TEST INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Current Question */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold font-mono-math text-cyan-300 text-sm">
                  {currentIdx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">{currentQ.topic}</h3>
                  <span className="text-[10px] text-cyan-400 font-mono-math">Level {currentQ.cognitiveLevel}</span>
                </div>
              </div>

              <span className="text-xs font-mono-math text-slate-400">
                Soal {currentIdx + 1} dari {ASSESSMENT_QUESTIONS.length}
              </span>
            </div>

            {/* Context & Question Prompt */}
            <div className="space-y-4">
              <div className="text-xs text-amber-400/90 font-mono-math bg-amber-950/20 border border-amber-900/40 px-3.5 py-1.5 rounded-lg inline-block">
                Konteks SMK: {currentQ.vocationalContext}
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                {currentQ.question}
              </p>

              <div className="py-3 px-6 bg-slate-950 border border-cyan-800/40 rounded-xl inline-block text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono-math tracking-wider shadow-inner">
                {currentQ.expression}
              </div>
            </div>

            {/* 5 Options (A, B, C, D, E) */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono-math uppercase text-slate-400 font-semibold block">
                PILIHAN JAWABAN (A–E):
              </span>
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full p-4 rounded-xl border text-left font-mono-math text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/50 text-white font-bold shadow-md'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  sound.playButtonClick();
                  setCurrentIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIdx === 0}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIdx < ASSESSMENT_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => {
                    sound.playButtonClick();
                    setCurrentIdx((prev) => Math.min(ASSESSMENT_QUESTIONS.length - 1, prev + 1));
                  }}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-game flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold font-game rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>KIRIM ASESMEN</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Number Matrix & Progress */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-20">
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-game text-white">
                LEMBAR JAWABAN DIGITAL
              </h4>
              <p className="text-xs text-slate-400">
                Terjawab: <span className="text-cyan-300 font-bold font-mono-math">{answeredCount}</span> dari 10 soal
              </p>
            </div>

            {/* 10 Numbers Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {ASSESSMENT_QUESTIONS.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sound.playButtonClick();
                      setCurrentIdx(idx);
                    }}
                    className={`h-11 rounded-xl font-mono-math text-xs font-bold transition-all border flex items-center justify-center ${
                      isCurrent
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-950 text-cyan-200'
                        : isAnswered
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-600" />
                <span>Sudah dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
                <span>Belum dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-cyan-950 border border-cyan-400" />
                <span>Soal aktif</span>
              </div>
            </div>

            <button
              onClick={handleSubmitAssessment}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold font-game rounded-xl text-xs shadow-lg transition-all"
            >
              SELESAIKAN & KIRIM JAWABAN
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
