import { useState } from 'react';
import Scene from '../../art/Scene';
import PinPad from '../../systems/PinPad';
import { useAuthStore } from '../../store/authStore';
import { useGameStore } from '../../store/gameStore';

// STUDENT-02 — Student PIN Login (spec mục 9.3/9.5). Phải hoạt động offline
// trên thiết bị đã READY — verifyStudentPin chỉ so sánh local, không gọi mạng.
export default function StudentPinLoginScreen({ onSuccess, onBack }) {
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState('');
  const verifyStudentPin = useAuthStore((s) => s.verifyStudentPin);
  const childName = useGameStore((s) => s.profile.name);

  function handleComplete(pin) {
    if (verifyStudentPin(pin)) {
      onSuccess();
      return;
    }
    setError('Mã PIN chưa đúng. Bạn thử lại nhé!');
    setShake(true);
    setAttempt((n) => n + 1);
    setTimeout(() => setShake(false), 400);
  }

  function showComingSoon() {
    setToast('Hãy nhờ bố mẹ giúp nhé — tính năng đặt lại PIN đang được xây dựng.');
    setTimeout(() => setToast(''), 2400);
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6 }}>
          Xin chào {childName || 'bạn nhỏ'}!
        </h2>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 26, fontWeight: 600 }}>
          Nhập mã PIN để tiếp tục hành trình Numeria
        </p>

        {error && (
          <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{error}</p>
        )}

        <PinPad key={attempt} onComplete={handleComplete} shake={shake} />

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <button className="btn-ghost" onClick={showComingSoon}>Quên mã PIN?</button>
          <button className="btn-ghost" onClick={onBack}>← Quay lại</button>
        </div>
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
            maxWidth: 320,
            textAlign: 'center',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
