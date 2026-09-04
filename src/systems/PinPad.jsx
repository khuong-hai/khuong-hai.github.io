import { useState } from 'react';

// Bàn phím số 4 chữ số dùng chung cho mọi màn PIN (tạo/xác nhận/đăng nhập
// Parent PIN & Student PIN). Không tự xoá số sau khi đủ 4 chữ số — màn cha
// gọi lại với `key` mới để "reset sạch" khi cần nhập lại (sai PIN, đổi bước).
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

export default function PinPad({ length = 4, onComplete, shake = false }) {
  const [digits, setDigits] = useState('');

  function press(key) {
    if (key === 'back') {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length >= length) return;
    const next = digits + key;
    setDigits(next);
    if (next.length === length) onComplete(next);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(16px, 3vw, 26px)' }}>
      <div className={`pin-dots${shake ? ' shake' : ''}`}>
        {Array.from({ length }).map((_, i) => (
          <span key={i} className={`pin-dot${i < digits.length ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="pin-keys">
        {KEYS.map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              className="pin-key"
              onClick={() => press(k)}
              aria-label={k === 'back' ? 'Xoá' : k}
            >
              {k === 'back' ? '⌫' : k}
            </button>
          )
        )}
      </div>
    </div>
  );
}
