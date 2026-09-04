import { useGameStore } from '../store/gameStore';

// Icon bật/tắt âm thanh — hiện ở các màn cinematic đầu game (trước Main
// Menu) để người chơi chọn tắt sớm nếu muốn; trạng thái lưu vào store nên
// áp dụng xuyên suốt toàn app (nhạc nền + sfx) cho tới khi bật lại.
export default function SoundToggle({ style }) {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  return (
    <button
      onClick={toggleSound}
      aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      style={{
        position: 'absolute',
        top: 18,
        right: 18,
        width: 'clamp(36px, 6vw, 48px)',
        height: 'clamp(36px, 6vw, 48px)',
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(20,12,45,0.55)',
        color: 'var(--paper)',
        fontSize: 'clamp(16px, 3vw, 22px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  );
}
