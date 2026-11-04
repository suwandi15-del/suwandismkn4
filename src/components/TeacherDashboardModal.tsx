import React, { useState } from 'react';
import { StudentScoreRecord, TeacherSettings } from '../types/game';
import { getStudentsScores, saveStudentsScores, getTeacherSettings, saveTeacherSettings } from '../utils/storage';
import {
  GraduationCap,
  Download,
  Users,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  AlertCircle,
  X,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTeacherMode: boolean;
  onToggleTeacherMode: (enabled: boolean) => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  isTeacherMode,
  onToggleTeacherMode,
}) => {
  const [students, setStudents] = useState<StudentScoreRecord[]>(() => getStudentsScores());
  const [settings, setSettings] = useState<TeacherSettings>(() => getTeacherSettings());
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LULUS' | 'REMEDIAL'>('ALL');

  if (!isOpen) return null;

  const handleToggleChat = () => {
    sound.playButtonClick();
    const updated = { ...settings, chatEnabled: !settings.chatEnabled };
    setSettings(updated);
    saveTeacherSettings(updated);
  };

  const handleExportCSV = () => {
    sound.playLevelUp();

    const headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Hero Pilihan', 'Level', 'Zona Tuntas', 'Nilai Asesmen', 'Status'];
    const rows = students.map((s, idx) => [
      idx + 1,
      s.nis,
      `"${s.name}"`,
      s.classGroup,
      s.hero,
      s.level,
      `${s.zonesCompleted}/6`,
      s.score,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_Matematika_SMKN4_Soppeng_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averageScore = Math.round(
    students.reduce((acc, curr) => acc + curr.score, 0) / (students.length || 1)
  );

  const passingCount = students.filter((s) => s.status === 'LULUS').length;
  const filteredStudents = students.filter((s) => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-600/40 rounded-3xl max-w-5xl w-full h-[680px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/50 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-game font-bold text-lg text-white">
                  DASHBOARD GURU – SUWANDI, S.Pd.
                </h3>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 rounded font-mono-math font-bold">
                  SMKN 4 SOPPENG
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat Rekapitulasi Pembelajaran & Evaluasi Sifat Bilangan Berpangkat Kelas X SMK (Fase E)
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playButtonClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Top Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono-math">Total Murid</span>
            <span className="text-xl font-bold text-white font-mono-math">{students.length} Siswa</span>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono-math">Rata-Rata Nilai</span>
            <span className="text-xl font-bold text-cyan-400 font-mono-math">{averageScore} / 100</span>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono-math">Ketuntasan Klasikal</span>
            <span className="text-xl font-bold text-emerald-400 font-mono-math">
              {Math.round((passingCount / (students.length || 1)) * 100)}% ({passingCount} Lulus)
            </span>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono-math">Status Chat Murid</span>
              <span className={`text-xs font-bold font-mono-math ${settings.chatEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                {settings.chatEnabled ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <button onClick={handleToggleChat} className="text-amber-400">
              {settings.chatEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Main Content: Student Score Table & Analytics */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 font-mono-math">FILTER:</span>
              {(['ALL', 'LULUS', 'REMEDIAL'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => { sound.playButtonClick(); setFilterStatus(st); }}
                  className={`px-3 py-1 text-xs rounded-lg font-mono-math font-semibold transition-colors ${
                    filterStatus === st
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Rekap Nilai (CSV)</span>
            </button>
          </div>

          {/* Student Table */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/70">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 font-mono-math text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-3.5">NIS</th>
                    <th className="p-3.5">Nama Siswa</th>
                    <th className="p-3.5">Kelas</th>
                    <th className="p-3.5">Hero Pilihan</th>
                    <th className="p-3.5 text-center">Level</th>
                    <th className="p-3.5 text-center">Zona</th>
                    <th className="p-3.5 text-center">Nilai Asesmen</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono-math">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 text-slate-400">{st.nis}</td>
                      <td className="p-3.5 font-bold text-white font-sans">{st.name}</td>
                      <td className="p-3.5 text-slate-300">{st.classGroup}</td>
                      <td className="p-3.5 text-cyan-300">{st.hero}</td>
                      <td className="p-3.5 text-center text-amber-300">Lv.{st.level}</td>
                      <td className="p-3.5 text-center text-slate-300">{st.zonesCompleted}/6</td>
                      <td className="p-3.5 text-center font-bold text-sm text-cyan-400">{st.score}</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            st.status === 'LULUS'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Diagnosis & Remedial Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 font-mono-math flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>ANALISIS BUTIR SOAL TERSULIT KELAS X:</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                1. <strong>Operasi Campuran Pecahan (Soal 9 & 10)</strong>: 35% siswa masih keliru mendistribusikan tanda minus saat menyederhanakan pangkat negatif di bagian penyebut.
              </p>
              <p className="text-slate-300 leading-relaxed">
                2. <strong>Pangkat Negatif (Soal 7)</strong>: Beberapa siswa menganggap pangkat minus menghasilkan angka minus negatif alih-alih pecahan inversi.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 font-mono-math flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>REKOMENDASI TINDAK LANJUT GURU SUWANDI:</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                • Berikan sesi penguatan mini di Laboratorium Komputer untuk siswa dengan nilai &lt; 75 menggunakan Menu Simulasi Eksponen.
              </p>
              <p className="text-slate-300 leading-relaxed">
                • Arahkan siswa menanyakan langkah demi langkah perkalian basis bertingkat pada AI Coach sebelum menghadapi asesmen ulang.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
