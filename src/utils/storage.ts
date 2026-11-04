import { PlayerProfile, DiscussionComment, ChatMessage, StudentScoreRecord, TeacherSettings } from '../types/game';
import { INITIAL_COMMENTS, MOCK_STUDENTS } from '../data/gameData';

const STORAGE_KEYS = {
  PROFILE: 'edu_legends_player_profile',
  COMMENTS: 'edu_legends_comments',
  CHAT_MESSAGES: 'edu_legends_chat_messages',
  STUDENTS: 'edu_legends_students_scores',
  TEACHER_SETTINGS: 'edu_legends_teacher_settings',
};

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Peserta Didik SMKN 4 Soppeng',
  school: 'SMKN 4 Soppeng',
  classGrade: 'X SMK (Fase E)',
  selectedHeroId: 'hero-tank',
  selectedSkinId: 'skin-t1',
  level: 1,
  exp: 0,
  nextLevelExp: 100,
  gold: 150,
  highestZoneUnlocked: 1,
  completedZones: [],
  completedQuests: [],
  inventory: [
    { itemId: 'item-concentration-potion', quantity: 2 },
  ],
  equippedItems: [],
  badges: ['First Step Hero'],
  battlesWon: 0,
  battlesTotal: 0,
  assessmentTaken: false,
  lastPlayed: new Date().toISOString(),
};

export function getPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading profile from storage:', err);
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.lastPlayed = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile:', err);
  }
}

export function resetPlayerProfile(): PlayerProfile {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }
  return DEFAULT_PROFILE;
}

export function addPlayerExp(currentProfile: PlayerProfile, gainedExp: number): { updatedProfile: PlayerProfile; leveledUp: boolean } {
  let { level, exp, nextLevelExp } = currentProfile;
  let leveledUp = false;

  exp += gainedExp;

  while (exp >= nextLevelExp && level < 30) {
    exp -= nextLevelExp;
    level += 1;
    nextLevelExp = Math.floor(nextLevelExp * 1.35);
    leveledUp = true;
  }

  const updatedProfile: PlayerProfile = {
    ...currentProfile,
    level,
    exp,
    nextLevelExp,
  };

  savePlayerProfile(updatedProfile);
  return { updatedProfile, leveledUp };
}

export function getComments(): DiscussionComment[] {
  if (typeof window === 'undefined') return INITIAL_COMMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!raw) return INITIAL_COMMENTS;
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_COMMENTS;
  }
}

export function saveComments(comments: DiscussionComment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } catch (err) {
    console.error('Error saving comments:', err);
  }
}

export const INITIAL_CHAT: ChatMessage[] = [
  { id: 'c1', channel: 'GLOBAL', sender: 'Suwandi, S.Pd.', senderRole: 'GURU', text: 'Selamat bertanding, anak-anakku! Teliti membaca sifat-sifat bilangan berpangkat.', timestamp: '08:00' },
  { id: 'c2', channel: 'GLOBAL', sender: 'Fadil', senderRole: 'MURID', text: 'Siap Pak! Saya sudah sampai di Power Zone!', timestamp: '08:05' },
  { id: 'c3', channel: 'GURU', sender: 'Suwandi, S.Pd.', senderRole: 'GURU', text: 'Halo! Jangan ragu bertanya jika ada langkah soal yang membingungkan.', timestamp: '08:10' },
  { id: 'c4', channel: 'TIM', sender: 'Nurul Annisa', senderRole: 'MURID', text: 'Tim 1 ayo fokus selesaikan Final Survival Zone hari ini!', timestamp: '08:15' },
];

export function getChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return INITIAL_CHAT;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (!raw) return INITIAL_CHAT;
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_CHAT;
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.error('Error saving chats:', err);
  }
}

export function getStudentsScores(): StudentScoreRecord[] {
  if (typeof window === 'undefined') return MOCK_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) return MOCK_STUDENTS;
    return JSON.parse(raw);
  } catch (err) {
    return MOCK_STUDENTS;
  }
}

export function saveStudentsScores(students: StudentScoreRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students data:', err);
  }
}

export const DEFAULT_TEACHER_SETTINGS: TeacherSettings = {
  chatEnabled: true,
  classCode: 'SMK4-MAT-EXP',
  className: 'Kelas X SMK (Fase E)',
  academicYear: '2026/2027',
};

export function getTeacherSettings(): TeacherSettings {
  if (typeof window === 'undefined') return DEFAULT_TEACHER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_SETTINGS);
    if (!raw) return DEFAULT_TEACHER_SETTINGS;
    return { ...DEFAULT_TEACHER_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_TEACHER_SETTINGS;
  }
}

export function saveTeacherSettings(settings: TeacherSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving teacher settings:', err);
  }
}
