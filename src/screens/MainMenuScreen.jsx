import { useState } from 'react';
import { AVATARS, useGameStore } from '../store/gameStore';
import chapter1 from '../content/chapter1.json';

const CHARACTER_FILES = {
  dandduong: '/assets/avatar-cards/nhanvat_nhadanduong.png',
  truytim: '/assets/avatar-cards/nhanvat_nhatruytim.png',
  kientao: '/assets/avatar-cards/nhanvat_nhakientao.png',
  giaima: '/assets/avatar-cards/nhanvat_nhagiaima.png',
};

// Toạ độ % đọc từ bg_mainmenu.png (1672×941) — ảnh đã khắc sẵn khung avatar
// tròn + 2 ô số liệu (năng lượng, mảnh pha lê) phía trên, và 4 biển chỉ
// đường bên phải. Code chỉ đè dữ liệu thật lên đúng các khung có sẵn.
const AVATAR_CIRCLE = { x: 4.5, y: 8, size: 9 };
const NAME_PLATE = { x: 17, y: 8, w: 15 };
const ENERGY_PLATE = { x: 35.5, y: 8, w: 12 };
const CRYSTAL_PLATE = { x: 53, y: 8, w: 10 };

const SIGNS = [
  { key: 'continue', label: 'Chơi tiếp', x: 87, y: 29.5, w: 22, h: 12 },
  { key: 'story', label: 'Câu chuyện', x: 87, y: 44.5, w: 22, h: 12 },
  { key: 'settings', label: 'Cài đặt', x: 87, y: 59.5, w: 22, h: 12 },
  { key: 'exit', label: 'Thoát', x: 87, y: 74.5, w: 22, h: 12 },
];

function signStyle(sign) {
  return {
    position: 'absolute',
    left: `${sign.x}%`,
    top: `${sign.y}%`,
    width: `${sign.w}%`,
    height: `${sign.h}%`,
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 'none',
    borderRadius: 16,
    padding: 0,
    cursor: 'pointer',
  };
}

export default function MainMenuScreen({ onContinue, onExit }) {
  const profile = useGameStore((s) => s.profile);
  const energy = useGameStore((s) => s.energy);
  const stars = useGameStore((s) => s.stars);
  const avatar = AVATARS.find((a) => a.id === profile.avatarId);
  const [toast, setToast] = useState('');

  function showComingSoon() {
    setToast('Tính năng đang được xây dựng!');
    setTimeout(() => setToast(''), 1800);
  }

  const infoTextStyle = {
    position: 'absolute',
    transform: 'translateY(-50%)',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    color: '#4a2f14',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #bcdcf7 0%, #3f8fe0 100%)' }} />

      {/* Tràn kín màn hình (object-fit: cover) — khung giữ-tỉ-lệ trước đây
          luôn hở 1 dải nền ở cạnh nào đó vì cửa sổ hiếm khi đúng khít 16:9.
          Các khung avatar/số liệu/biển chỉ đường đều chừa lề vài % quanh mép
          nên crop nhẹ do cover không chạm tới chúng. */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="/assets/backgrounds/bg_mainmenu.png"
          alt="Main Menu"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          draggable={false}
        />

        {/* Avatar tròn */}
        <div
          style={{
            position: 'absolute',
            left: `${AVATAR_CIRCLE.x}%`,
            top: `${AVATAR_CIRCLE.y}%`,
            width: `${AVATAR_CIRCLE.size}%`,
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          {avatar && (
            <img
              src={CHARACTER_FILES[avatar.id]}
              alt={avatar.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
              draggable={false}
            />
          )}
        </div>

        {/* Tên nhân vật */}
        <div
          style={{
            ...infoTextStyle,
            top: `${NAME_PLATE.y}%`,
            left: `${NAME_PLATE.x - NAME_PLATE.w / 2 + 3}%`,
            width: `${NAME_PLATE.w - 3}%`,
            fontSize: 'clamp(22px, 3.4vw, 36px)',
          }}
        >
          {profile.name || 'Nhà Thám Hiểm'}
        </div>

        {/* Năng lượng */}
        <div
          style={{
            ...infoTextStyle,
            top: `${ENERGY_PLATE.y}%`,
            left: `${ENERGY_PLATE.x - ENERGY_PLATE.w / 2 + 6}%`,
            width: `${ENERGY_PLATE.w - 6}%`,
            fontSize: 'clamp(22px, 3.6vw, 38px)',
          }}
        >
          {energy}/{chapter1.energyTarget}
        </div>

        {/* Mảnh pha lê — placeholder: chưa có mission nào cộng "stars" thật,
            hiển thị theo lore "8 Mảnh Pha Lê" của cả game để sẵn chỗ. */}
        <div
          style={{
            ...infoTextStyle,
            top: `${CRYSTAL_PLATE.y}%`,
            left: `${CRYSTAL_PLATE.x - CRYSTAL_PLATE.w / 2 + 6}%`,
            width: `${CRYSTAL_PLATE.w - 6}%`,
            fontSize: 'clamp(22px, 3.6vw, 38px)',
          }}
        >
          {stars}/8
        </div>

        {/* Nhân vật đã chọn đứng cạnh Lumi (Lumi đã vẽ sẵn trong ảnh, góc
            dưới-trái). Bọc riêng 1 lớp để định vị — animation "float" đổi
            transform (bồng bềnh) nên không thể đặt chung 1 phần tử với
            transform định vị translate(-50%,-100%), sẽ bị ghi đè mất neo. */}
        {avatar && (
          <div
            style={{
              position: 'absolute',
              left: '28%',
              top: '88%',
              width: '10%',
              transform: 'translate(-50%, -100%)',
            }}
          >
            <img
              src={CHARACTER_FILES[avatar.id]}
              alt={avatar.name}
              className="pop-in float"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              draggable={false}
            />
          </div>
        )}

        {SIGNS.map((sign) => (
          <button
            key={sign.key}
            className="menu-sign"
            onClick={sign.key === 'continue' ? onContinue : sign.key === 'exit' ? onExit : showComingSoon}
            style={signStyle(sign)}
            aria-label={sign.label}
          />
        ))}
      </div>

      {toast && (
        <div
          className="pop-in font-display"
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20,12,45,0.85)',
            color: 'var(--paper)',
            padding: '10px 20px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
