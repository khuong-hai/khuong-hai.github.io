// Ảnh thật của Bạn Số (đã cắt từ character sheet do bạn cung cấp).
const FILES = {
  base: '/assets/numbers/base.png',
  idle: '/assets/numbers/base.png',
  happy: '/assets/numbers/happy.png',
  confused: '/assets/numbers/confused.png',
  worried: '/assets/numbers/confused.png',
  wrong: '/assets/numbers/wrong.png',
};

export default function NumberArt({ state = 'base', size = 110, label, animate = false }) {
  const src = FILES[state] || FILES.base;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <img
        src={src}
        alt="Bạn Số"
        className={animate ? 'float' : ''}
        style={{ width: size, height: 'auto', display: 'block' }}
        draggable={false}
      />
      {label && (
        <span className="font-display" style={{ fontSize: 'clamp(16px,2.4vw,22px)', fontWeight: 800, color: 'var(--paper)' }}>
          {label}
        </span>
      )}
    </div>
  );
}
