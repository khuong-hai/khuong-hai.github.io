import chapter1 from '../content/chapter1.json';
import { useGameStore } from '../store/gameStore';
import { useSmartCoverFit, toSmartCoverPoint } from '../systems/useTopCoverFit';

// Bản mới 1672×941, tỉ lệ 16:9 (trước là 3:2) — khớp màn desktop tốt hơn
// nhiều, nên hầu như không còn cần "zoom-out" hở lề 2 bên như bản cũ.
const IMG_AR = 1672 / 941;
// Vùng cần giữ nguyên khi bị crop: gần trọn ảnh, từ cụm đảo trên cùng tới
// đáy các đảo dưới cùng. Nếu cover chuẩn không đủ chỗ, ảnh tự thu nhỏ (hở
// nhẹ nền 2 bên) thay vì cắt mất đảo.
const CRITICAL_Y = [1, 97];
// Vùng ngang cần giữ: từ đảo trái (x≈13%) tới đảo phải (x≈91%+bán kính) —
// trên điện thoại dọc, crop ngang nặng dễ đẩy lối vào Chapter 1 (chỉ mở
// khoá duy nhất!) ra khỏi vùng bấm chính xác.
const CRITICAL_X = [8, 97];

// Toạ độ % đọc lại từ map_world1_bg.png bản mới (16:9) — chỉ đảo dưới-cùng-
// bên-trái (garden path/cầu) mở khoá, dẫn vào Chapter 1. Các đảo khác (kể
// cả lâu đài trung tâm) đều khoá, chờ nội dung sau này.
const CHAPTER1_SPOT = { x: 28, y: 73, size: 16 };

const LOCKED_SPOTS = [
  { x: 28, y: 25, size: 13 },
  { x: 17, y: 43, size: 14 },
  { x: 51, y: 28, size: 22 },
  { x: 85, y: 26, size: 13 },
  { x: 91, y: 49, size: 13 },
  { x: 72, y: 73, size: 15 },
];

function spotStyle(x, y, size) {
  return {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}%`,
    aspectRatio: '1 / 1',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 'none',
    borderRadius: '50%',
    padding: 0,
  };
}

function LockBadge() {
  return (
    <img
      src="/assets/map/map_lock_badge.png"
      alt="Chưa mở khoá"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '46%',
        filter: 'grayscale(0.3) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
      }}
      draggable={false}
    />
  );
}

export default function MapScreen({ onEnterChapter1, onBackToMainMenu }) {
  const resetSave = useGameStore((s) => s.resetSave);
  const { ref, fit } = useSmartCoverFit(IMG_AR, CRITICAL_Y, CRITICAL_X);

  function handleReset() {
    const ok = window.confirm('Xoá toàn bộ tiến trình và chơi lại từ đầu?');
    if (ok) {
      resetSave();
      window.location.reload();
    }
  }

  const chapter1Point = toSmartCoverPoint(CHAPTER1_SPOT.x, CHAPTER1_SPOT.y, fit, true);

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #bcdcf7 0%, #3f8fe0 100%)' }} />

      {/* Tràn kín mọi cạnh (kể cả trên/dưới) — chấp nhận crop nhẹ khi tỉ lệ
          cửa sổ không khớp đúng 3:2, thay vì để hở viền trên/dưới. */}
      <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
        <img
          src="/assets/map/map_world1_bg.png"
          alt="Bản đồ Numeria — World 1"
          style={fit.imgStyle}
          draggable={false}
        />

        {LOCKED_SPOTS.map((s, i) => {
          const p = toSmartCoverPoint(s.x, s.y, fit, false);
          if (p.offscreen) return null;
          return (
            <button
              key={i}
              className="map-node"
              disabled
              style={{ ...spotStyle(p.x, p.y, s.size), filter: 'grayscale(1) brightness(0.75)', opacity: 0.75 }}
              aria-label="Chưa mở khoá"
            >
              <LockBadge />
            </button>
          );
        })}

        <button
          className="map-node"
          onClick={onEnterChapter1}
          style={spotStyle(chapter1Point.x, chapter1Point.y, CHAPTER1_SPOT.size)}
          aria-label={`Vào Chapter 1 — ${chapter1.title}`}
        />
      </div>

      <div style={{ position: 'absolute', top: 18, left: 18, right: 18 }}>
        <button className="btn-ghost" onClick={onBackToMainMenu}>← Màn hình chính</button>
      </div>

      <button
        onClick={handleReset}
        className="btn-ghost"
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 12,
          opacity: 0.85,
        }}
      >
        ↺ Chơi lại từ đầu (xoá tiến trình)
      </button>
    </div>
  );
}
