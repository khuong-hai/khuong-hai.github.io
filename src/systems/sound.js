import { useGameStore } from '../store/gameStore';

const SFX_FILES = {
  tap: '/assets/audio/sfx/sfx_button_tap.mp3',
  correct: '/assets/audio/sfx/sfx_correct.mp3',
  wrong: '/assets/audio/sfx/sfx_wrong.mp3',
  hint: '/assets/audio/sfx/sfx_hint.mp3',
  roundComplete: '/assets/audio/sfx/sfx_round_complete.mp3',
  missionComplete: '/assets/audio/sfx/sfx_mission_complete.mp3',
};

// Phát 1 tiếng SFX ngắn (không lặp). Tôn trọng cờ soundEnabled toàn cục —
// đọc thẳng từ store bằng getState() (không phải hook) vì hàm này được gọi
// từ handler thường (onClick...), không phải từ component React.
export function playSfx(name) {
  if (!useGameStore.getState().soundEnabled) return;
  const src = SFX_FILES[name];
  if (!src) return;
  const audio = new Audio(src);
  audio.play().catch(() => {});
}
