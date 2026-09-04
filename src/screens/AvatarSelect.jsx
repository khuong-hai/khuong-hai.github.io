import { useState } from 'react';
import Scene from '../art/Scene';
import ImgButton from '../systems/ImgButton';
import { AVATARS } from '../store/gameStore';

const CARD_FILES = {
  dandduong: '/assets/avatar-cards/card_nhadanduong.png',
  truytim: '/assets/avatar-cards/card_nhatruytim.png',
  kientao: '/assets/avatar-cards/card_nhakientao.png',
  giaima: '/assets/avatar-cards/card_nhagiaima.png',
};

export default function AvatarSelect({ onSelect }) {
  const [picked, setPicked] = useState(null);

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: 900 }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(20px,3.4vw,30px)', marginBottom: 6 }}>
          Chọn nhân vật con yêu thích
        </h2>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 24, fontWeight: 600 }}>
          Mỗi nhân vật mang 1 sức mạnh riêng
        </p>

        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: 'clamp(6px, 2vw, 20px)' }}>
          {AVATARS.map((a) => {
            const isPicked = picked === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setPicked(a.id)}
                className="pick-card"
                style={{
                  width: 'clamp(74px, 21vw, 190px)',
                  aspectRatio: '2 / 3',
                  borderRadius: 16,
                  padding: 0,
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  boxShadow: isPicked ? '0 0 0 3px var(--crystal), 0 0 18px var(--crystal-glow)' : 'none',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={CARD_FILES[a.id]}
                  alt={a.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <ImgButton kind="chon" onClick={() => onSelect(picked)} disabled={!picked} height="clamp(48px, 8vw, 66px)" />
        </div>
      </div>
    </div>
  );
}
