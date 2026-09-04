import { create } from 'zustand';

const STORAGE_KEY = 'numeria_save_v1';

// --- GameDataStore abstraction -------------------------------------------
// Đọc/ghi luôn ưu tiên local trước (localStorage cho demo; sẽ đổi sang
// IndexedDB khi mở rộng). Khi có backend sync (Firebase), chỉ cần thêm
// 1 lớp "push/pull" gọi các action bên dưới — không cần sửa logic game.

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persist(state) {
  const toSave = {
    profile: state.profile,
    energy: state.energy,
    stars: state.stars,
    badges: state.badges,
    completedMissions: state.completedMissions,
    hasSeenIntro: state.hasSeenIntro,
    soundEnabled: state.soundEnabled,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    /* ignore quota errors for demo */
  }
}

const saved = loadSave();

export const AVATARS = [
  { id: 'dandduong', name: 'Nhà Dẫn Đường', item: 'La Bàn Pha Lê', badge: '🧭' },
  { id: 'truytim', name: 'Nhà Truy Tìm', item: 'Kính Soi Sao', badge: '🔭' },
  { id: 'kientao', name: 'Nhà Kiến Tạo', item: 'Búa Ánh Sáng', badge: '🔨' },
  { id: 'giaima', name: 'Nhà Giải Mã', item: 'Chìa Khoá Toán Học', badge: '🗝️' },
];

// Màu/khung nhân vật CHUNG cho cả 4 — chỉ 1 nhân vật, đổi trang phục/vật phẩm
// (theo quyết định "1 nhân vật, 4 bộ trang phục" thay vì 4 nhân vật riêng biệt).
export const PLAYER_BASE = { color: '#4fe8c4', accent: '#2ba98a' };

export const useGameStore = create((set, get) => ({
  profile: saved?.profile || { name: '', avatarId: null },
  energy: saved?.energy ?? 0,
  stars: saved?.stars ?? 0,
  badges: saved?.badges || [],
  completedMissions: saved?.completedMissions || {}, // { m1: { done: true, firstTry: true } }
  hasSeenIntro: saved?.hasSeenIntro ?? false,
  // Bật/tắt toàn bộ âm thanh (nhạc nền + sfx) — chọn được ngay từ màn
  // cinematic đầu game, giữ nguyên xuyên suốt cho tới khi người chơi bật lại.
  soundEnabled: saved?.soundEnabled ?? true,

  toggleSound() {
    set((s) => ({ soundEnabled: !s.soundEnabled }));
    persist(get());
  },

  setAvatar(avatarId) {
    set((s) => ({ profile: { ...s.profile, avatarId } }));
    persist(get());
  },

  setName(name) {
    set((s) => ({ profile: { ...s.profile, name } }));
    persist(get());
  },

  markIntroSeen() {
    set({ hasSeenIntro: true });
    persist(get());
  },

  completeMission(missionId, reward = {}) {
    const s = get();
    const already = s.completedMissions[missionId]?.done;
    const next = {
      ...s.completedMissions,
      [missionId]: { done: true, firstTry: !already ? true : s.completedMissions[missionId].firstTry },
    };
    let energy = s.energy;
    let stars = s.stars;
    let badges = s.badges;
    // Năng lượng chỉ cộng ở lần hoàn thành đầu tiên (SRS 2.7)
    if (!already) {
      if (reward.energy) energy += reward.energy;
      if (reward.stars) stars += reward.stars;
      if (reward.badge && !badges.includes(reward.badge)) badges = [...badges, reward.badge];
    }
    set({ completedMissions: next, energy, stars, badges });
    persist(get());
  },

  resetSave() {
    localStorage.removeItem(STORAGE_KEY);
    set({
      profile: { name: '', avatarId: null },
      energy: 0,
      stars: 0,
      badges: [],
      completedMissions: {},
      hasSeenIntro: false,
    });
  },
}));
