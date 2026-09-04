// PLACEHOLDER ART — thay bằng ảnh PNG thật khi có (xem mission plan mục 5A).
// Mỗi "creature" chỉ là 1 blob SVG đổi màu + biểu cảm theo props, để dễ
// nhận diện nhân vật trong lúc chờ asset thật, và dễ gỡ bỏ sau này.

const EXPRESSIONS = {
  idle: { mouth: 'M -14,10 Q 0,18 14,10', eye: 'circle' },
  happy: { mouth: 'M -16,6 Q 0,26 16,6', eye: 'happy' },
  worried: { mouth: 'M -14,16 Q 0,8 14,16', eye: 'worried' },
  hint: { mouth: 'M -10,12 Q 0,10 10,12', eye: 'hint' },
  sad: { mouth: 'M -14,18 Q 0,10 14,18', eye: 'sad' },
};

function Eyes({ type }) {
  if (type === 'happy') {
    return (
      <>
        <path d="M -22,-8 Q -14,-16 -6,-8" stroke="#2b1c4f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 6,-8 Q 14,-16 22,-8" stroke="#2b1c4f" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (type === 'worried' || type === 'sad') {
    return (
      <>
        <circle cx="-14" cy="-6" r="5" fill="#2b1c4f" />
        <circle cx="14" cy="-6" r="5" fill="#2b1c4f" />
        <path d="M -20,-16 L -8,-12" stroke="#2b1c4f" strokeWidth="3" strokeLinecap="round" />
        <path d="M 20,-16 L 8,-12" stroke="#2b1c4f" strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }
  if (type === 'hint') {
    return (
      <>
        <circle cx="-14" cy="-6" r="5" fill="#2b1c4f" />
        <circle cx="14" cy="-6" r="6.5" fill="#2b1c4f" />
      </>
    );
  }
  return (
    <>
      <circle cx="-14" cy="-6" r="5.5" fill="#2b1c4f" />
      <circle cx="14" cy="-6" r="5.5" fill="#2b1c4f" />
    </>
  );
}

export default function Creature({
  color = '#4fe8c4',
  accent = '#2ba98a',
  expression = 'idle',
  size = 120,
  label,
  badge,
  className = '',
  animate = false,
}) {
  const exp = EXPRESSIONS[expression] || EXPRESSIONS.idle;
  return (
    <div
      className={`${className} ${animate ? 'float' : ''}`}
      style={{ width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}
    >
      <svg viewBox="-60 -60 120 120" width={size} height={size}>
        <ellipse cx="0" cy="42" rx="30" ry="8" fill="rgba(0,0,0,0.18)" />
        <path
          d="M 0,-46 C 30,-46 46,-24 44,0 C 46,22 30,44 0,44 C -30,44 -46,22 -44,0 C -46,-24 -30,-46 0,-46 Z"
          fill={color}
          stroke={accent}
          strokeWidth="3"
        />
        <g transform="translate(0,-4)">
          <Eyes type={exp.eye} />
          <path d={exp.mouth} stroke="#2b1c4f" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        {expression === 'hint' && (
          <text x="30" y="-30" fontSize="26" fontFamily="Baloo 2, sans-serif" fill="#ffd166">?</text>
        )}
      </svg>
      {badge && (
        <span
          style={{
            position: 'absolute',
            bottom: size * 0.12,
            right: size * 0.04,
            fontSize: size * 0.28,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))',
          }}
        >
          {badge}
        </span>
      )}
      {label && (
        <span className="font-display" style={{ fontSize: 12, fontWeight: 700, color: 'var(--paper)', opacity: 0.85 }}>
          {label}
        </span>
      )}
    </div>
  );
}
