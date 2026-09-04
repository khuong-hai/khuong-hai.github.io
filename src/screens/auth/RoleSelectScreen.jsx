import { useState } from 'react';
import Scene from '../../art/Scene';
import { useGameStore } from '../../store/gameStore';

// ROLE-01 — "Hôm nay ai vào Numeria?" (spec mục 8). Phải chạy được cả
// online/offline: màn này không gọi mạng, chỉ chọn vai trò rồi chuyển màn PIN.
//
// Card "Học sinh" DÙNG LẠI đúng card nhân vật con đã chọn ở AvatarSelect
// (card_nha<id>.png, cùng file với màn chọn nhân vật) — không vẽ ảnh riêng.
const STUDENT_CARD_FILES = {
  dandduong: '/assets/avatar-cards/card_nhadanduong.png',
  truytim: '/assets/avatar-cards/card_nhatruytim.png',
  kientao: '/assets/avatar-cards/card_nhakientao.png',
  giaima: '/assets/avatar-cards/card_nhagiaima.png',
};

// Card "Phụ huynh" — ảnh vẽ riêng, đặt cùng chỗ với avatar-cards (khác quy
// ước ban đầu là 1 folder role-select/ riêng, nhưng asset thực tế được thả
// vào avatar-cards/ nên đi theo đúng chỗ đó). Trước khi có ảnh, card tự rơi
// về emoji placeholder (onError) nên không vỡ layout.
const PARENT_CARD_FILE = '/assets/avatar-cards/card_phuhuynh.png';

const ROLES = [
  { key: 'student', label: 'Con', emoji: '🧒' },
  { key: 'parent', label: 'Ba mẹ', emoji: '👨‍👩‍👧' },
];

export default function RoleSelectScreen({ onSelectStudent, onSelectParent }) {
  const [broken, setBroken] = useState({});
  const avatarId = useGameStore((s) => s.profile.avatarId);

  function handleSelect(key) {
    if (key === 'student') onSelectStudent();
    else onSelectParent();
  }

  function cardSrc(key) {
    if (key === 'student') return avatarId ? STUDENT_CARD_FILES[avatarId] : null;
    return PARENT_CARD_FILE;
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: 520 }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(20px,3.4vw,30px)', marginBottom: 28 }}>
          Hôm nay ai vào Numeria?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(14px, 3vw, 28px)', flexWrap: 'wrap' }}>
          {ROLES.map((role) => {
            const src = cardSrc(role.key);
            const isBroken = broken[role.key] || !src;
            return (
              <button
                key={role.key}
                onClick={() => handleSelect(role.key)}
                className="pick-card"
                style={{
                  width: 'clamp(150px, 24vw, 220px)',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  background: 'none',
                  border: 'none',
                }}
              >
                {/* Khung ảnh riêng (không đè chữ lên card) — card nhân vật
                    thật (Học sinh) đã tự khắc sẵn tên/chỉ số ở đáy ảnh, đè
                    caption lên đó sẽ chồng chữ lên chữ. */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '2 / 3',
                    borderRadius: 20,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 6px 0 rgba(0,0,0,0.18), 0 10px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  {!isBroken ? (
                    <img
                      src={src}
                      alt={role.label}
                      onError={() => setBroken((b) => ({ ...b, [role.key]: true }))}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      draggable={false}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--paper)',
                      }}
                    >
                      <span style={{ fontSize: 'clamp(40px,8vw,64px)' }}>{role.emoji}</span>
                    </div>
                  )}
                </div>

                <span
                  className="font-display"
                  style={{ fontWeight: 700, fontSize: 'clamp(15px, 2.2vw, 19px)', color: 'var(--paper)' }}
                >
                  {role.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
