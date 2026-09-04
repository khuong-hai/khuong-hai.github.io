import { useState } from 'react';
import Scene from '../art/Scene';
import DialogueBox from '../systems/DialogueBox';
import ImgButton from '../systems/ImgButton';
import { AVATARS, useGameStore } from '../store/gameStore';

const CHARACTER_FILES = {
  dandduong: '/assets/avatar-cards/nhanvat_nhadanduong.png',
  truytim: '/assets/avatar-cards/nhanvat_nhatruytim.png',
  kientao: '/assets/avatar-cards/nhanvat_nhakientao.png',
  giaima: '/assets/avatar-cards/nhanvat_nhagiaima.png',
};

// Viết hoa chữ cái đầu mỗi từ — con có thể gõ thường ("an", "nguyễn văn an").
function capitalizeWords(str) {
  return str
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export default function NameInput({ avatarId, onDone }) {
  const [name, setName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const avatar = AVATARS.find((a) => a.id === avatarId);
  const setProfileName = useGameStore((s) => s.setName);

  function handleConfirm() {
    const capitalized = capitalizeWords(name.trim());
    setName(capitalized);
    setProfileName(capitalized);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="safe-stage fade-in">
        <Scene preset="chonnhanvat" />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(10px, 2.4vw, 22px)',
            width: '100%',
          }}
        >
          <img
            src={CHARACTER_FILES[avatarId]}
            alt={avatar?.name || 'Nhân vật'}
            className="pop-in float"
            style={{ height: 'clamp(180px, 30vw, 300px)', width: 'auto' }}
            draggable={false}
          />

          <DialogueBox
            speaker="Lumi"
            expression="happy"
            text={`${name || 'Bạn nhỏ'}, từ giờ chúng ta là một đội!`}
            onNext={onDone}
            nextLabel="Vào Numeria"
            maxWidth={640}
            lumiScale={2 / 3}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: 420 }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 18 }}>
          {avatar ? `${avatar.name}, con tên là gì?` : 'Con tên là gì?'}
        </h2>
        <input
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của con"
          style={{
            width: '100%',
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            padding: '14px 18px',
            borderRadius: 16,
            border: 'none',
            textAlign: 'center',
            background: 'var(--paper)',
            color: 'var(--paper-ink)',
            marginBottom: 20,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ImgButton
            kind="xacnhan"
            disabled={name.trim().length === 0}
            onClick={handleConfirm}
            height="clamp(46px, 8vw, 62px)"
          />
        </div>
      </div>
    </div>
  );
}
