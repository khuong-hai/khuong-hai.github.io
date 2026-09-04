const CRYSTAL_COLORS = [
  '/assets/crystals/crystal_01.png',
  '/assets/crystals/crystal_03.png',
  '/assets/crystals/crystal_04.png',
  '/assets/crystals/crystal_06.png',
  '/assets/crystals/crystal_07.png',
  '/assets/crystals/crystal_02.png',
  '/assets/crystals/crystal_05.png',
  '/assets/crystals/crystal_08.png',
];

export default function EnergyBar({ current, target }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
      <div style={{ display: 'flex', gap: 'clamp(2px, 0.8vw, 6px)' }}>
        {Array.from({ length: target }).map((_, i) => (
          <img
            key={i}
            src={CRYSTAL_COLORS[i % CRYSTAL_COLORS.length]}
            alt=""
            className={i < current ? 'glow-pulse' : ''}
            style={{
              height: 'clamp(20px, 3.6vw, 32px)',
              width: 'auto',
              filter: i < current ? undefined : 'grayscale(1) opacity(0.35)',
              transition: 'filter 0.3s ease',
            }}
          />
        ))}
      </div>
      <span className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(12px, 2vw, 15px)', opacity: 0.85 }}>
        {current}/{target}
      </span>
    </div>
  );
}
