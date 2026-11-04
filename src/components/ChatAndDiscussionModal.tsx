import React, { useState } from 'react';
import { DiscussionComment, ChatMessage, PlayerProfile } from '../types/game';
import { getComments, saveComments, getChatMessages, saveChatMessages } from '../utils/storage';
import { MessageSquare, Users, Send, Heart, Pin, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface ChatAndDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  isTeacherMode: boolean;
  chatEnabled: boolean;
}

export const ChatAndDiscussionModal: React.FC<ChatAndDiscussionModalProps> = ({
  isOpen,
  onClose,
  player,
  isTeacherMode,
  chatEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'FORUM' | 'CHAT'>('FORUM');
  const [selectedChannel, setSelectedChannel] = useState<'GLOBAL' | 'TIM' | 'GURU'>('GLOBAL');

  // Comments state
  const [comments, setComments] = useState<DiscussionComment[]>(() => getComments());
  const [newCommentText, setNewCommentText] = useState('');

  // Chat messages state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getChatMessages());
  const [newChatText, setNewChatText] = useState('');

  if (!isOpen) return null;

  // Add Comment to Forum
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    sound.playButtonClick();

    const newComment: DiscussionComment = {
      id: `comm-${Date.now()}`,
      author: isTeacherMode ? 'Suwandi, S.Pd.' : player.name,
      authorRole: isTeacherMode ? 'GURU' : 'MURID',
      avatarHero: player.selectedHeroId,
      content: newCommentText.trim(),
      timestamp: 'Baru saja',
      likes: 0,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);
    setNewCommentText('');
  };

  // Like comment
  const handleLikeComment = (commentId: string) => {
    sound.playButtonClick();
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    });
    setComments(updated);
    saveComments(updated);
  };

  // Pin comment (Teacher only)
  const handleTogglePin = (commentId: string) => {
    if (!isTeacherMode) return;
    sound.playButtonClick();
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, pinned: !c.pinned };
      }
      return c;
    });
    setComments(updated);
    saveComments(updated);
  };

  // Delete comment (Teacher only)
  const handleDeleteComment = (commentId: string) => {
    if (!isTeacherMode) return;
    sound.playWrong();
    const updated = comments.filter((c) => c.id !== commentId);
    setComments(updated);
    saveComments(updated);
  };

  // Send Chat message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim() || !chatEnabled) return;

    sound.playButtonClick();

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      channel: selectedChannel,
      sender: isTeacherMode ? 'Suwandi, S.Pd.' : player.name,
      senderRole: isTeacherMode ? 'GURU' : 'MURID',
      text: newChatText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    saveChatMessages(updated);
    setNewChatText('');
  };

  const filteredChatMessages = chatMessages.filter(
    (m) => m.channel === selectedChannel || m.channel === 'GLOBAL'
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full h-[640px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header & Tab Toggle */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => { sound.playButtonClick(); setActiveTab('FORUM'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'FORUM'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Forum Diskusi Soal</span>
              </button>

              <button
                onClick={() => { sound.playButtonClick(); setActiveTab('CHAT'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'CHAT'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Chat Kelas & Tim</span>
              </button>
            </div>

            <span className="hidden md:inline-block text-[10px] text-slate-500 font-mono-math">
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

        {/* Honest Mode Banner */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400 flex items-center justify-between font-mono-math">
          <span>Mode Kelas Terhubung (Penyimpanan Sesi & Lokal)</span>
          {isTeacherMode && (
            <span className="text-amber-400 font-bold">MODE MODERASI GURU AKTIF</span>
          )}
        </div>

        {/* TAB 1: FORUM DISKUSI */}
        {activeTab === 'FORUM' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2.5 transition-all ${
                    comm.pinned
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{comm.author}</span>
                      {comm.authorRole === 'GURU' && (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-mono-math font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>GURU</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono-math">{comm.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {comm.pinned && (
                        <span className="text-[10px] text-amber-400 font-mono-math flex items-center gap-1 font-semibold">
                          <Pin className="w-3 h-3" />
                          <span>DISEMATKAN</span>
                        </span>
                      )}

                      {isTeacherMode && (
                        <div className="flex items-center gap-1 text-[10px]">
                          <button
                            onClick={() => handleTogglePin(comm.id)}
                            className="text-amber-400 hover:underline px-1"
                          >
                            {comm.pinned ? 'Lepas Pin' : 'Sematkan'}
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comm.id)}
                            className="text-red-400 hover:underline px-1"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-200 leading-relaxed font-sans">{comm.content}</p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => handleLikeComment(comm.id)}
                      className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{comm.likes} Disukai</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={isTeacherMode ? "Tulis bimbingan atau penjelasan guru..." : "Tulis pertanyaan atau diskusi soal perpangkatan..."}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Kirim</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CHAT KELAS & TIM */}
        {activeTab === 'CHAT' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Channel Bar */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['GLOBAL', 'TIM', 'GURU'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => { sound.playButtonClick(); setSelectedChannel(ch); }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono-math font-semibold transition-colors ${
                      selectedChannel === ch
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-800'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    #{ch === 'GLOBAL' ? 'Kelas-X' : ch === 'TIM' ? 'Tim-Hero' : 'Chat-Guru'}
                  </button>
                ))}
              </div>

              {!chatEnabled && (
                <span className="text-[10px] text-red-400 font-mono-math flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Chat dinonaktifkan guru</span>
                </span>
              )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {filteredChatMessages.map((msg) => {
                const isMine = msg.sender === (isTeacherMode ? 'Suwandi, S.Pd.' : player.name);
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono-math mb-1">
                      <span className="font-bold text-slate-400">{msg.sender}</span>
                      {msg.senderRole === 'GURU' && (
                        <span className="text-amber-400 font-bold">[GURU]</span>
                      )}
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs sm:text-sm ${
                        isMine
                          ? 'bg-cyan-600 text-white rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                disabled={!chatEnabled}
                placeholder={chatEnabled ? `Kirim pesan ke #${selectedChannel}...` : "Fitur chat sedang dinonaktifkan oleh guru."}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!newChatText.trim() || !chatEnabled}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Kirim</span>
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
