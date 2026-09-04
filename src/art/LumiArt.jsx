// Ảnh thật của Lumi (đã cắt từ character sheet do bạn cung cấp).
// File nằm ở /public/assets/lumi/*.png — map đúng theo 4 trạng thái đã có
// sẵn trong hệ thống: idle, happy, hint, worried.

const FILES = {
  idle: '/assets/lumi/idle.png',
  happy: '/assets/lumi/happy.png',
  hint: '/assets/lumi/hint.png',
  worried: '/assets/lumi/worried.png',
  sad: '/assets/lumi/worried.png', // chưa có ảnh riêng, dùng tạm worried
};

// size = chiều CAO mong muốn (không phải chiều rộng) — vì chỗ gọi chính
// (DialogueBox) tính size theo chiều cao khung hội thoại, ảnh cần co theo
// đúng trục đó để không "ăn" lố bề ngang.
export default function LumiArt({ expression = 'idle', size = 96, animate = false, className = '' }) {
  const src = FILES[expression] || FILES.idle;
  return (
    <img
      src={src}
      alt="Lumi"
      className={`${className} ${animate ? 'float' : ''}`}
      style={{ height: size, width: 'auto', display: 'block' }}
      draggable={false}
    />
  );
}
