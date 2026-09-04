// Ảnh thật của Zero (đã cắt từ character sheet do bạn cung cấp).
// File nằm ở /public/assets/zero/*.png — 4 trạng thái: default, attack, victory, angry.

const FILES = {
  default: '/assets/zero/default.png',
  attack: '/assets/zero/attack.png',
  victory: '/assets/zero/victory.png',
  angry: '/assets/zero/angry.png',
};

export default function ZeroArt({ pose = 'default', size = 110, animate = false, className = '' }) {
  const src = FILES[pose] || FILES.default;
  return (
    <img
      src={src}
      alt="Zero"
      className={`${className} ${animate ? 'float' : ''}`}
      style={{ width: size, height: 'auto', display: 'block' }}
      draggable={false}
    />
  );
}
