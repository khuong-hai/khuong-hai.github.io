import { useState } from 'react';
import Scene from '../../art/Scene';
import PinPad from '../../systems/PinPad';
import { useAuthStore } from '../../store/authStore';

// PARENT-01 — Parent PIN Login (spec mục 10). Phải hoạt động offline trên
// thiết bị đã READY — verifyParentPin chỉ so sánh local, không gọi mạng.
export default function ParentPinLoginScreen({ onSuccess, onBack, onForgotPin }) {
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const verifyParentPin = useAuthStore((s) => s.verifyParentPin);

  function handleComplete(pin) {
    if (verifyParentPin(pin)) {
      onSuccess();
      return;
    }
    setError('Mã PIN chưa đúng. Bạn thử lại nhé!');
    setShake(true);
    setAttempt((n) => n + 1);
    setTimeout(() => setShake(false), 400);
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6 }}>
          Mã PIN Phụ huynh
        </h2>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 26, fontWeight: 600 }}>
          Nhập mã PIN để vào Khu vực Phụ huynh
        </p>

        {error && (
          <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{error}</p>
        )}

        <PinPad key={attempt} onComplete={handleComplete} shake={shake} />

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <button className="btn-ghost" onClick={onForgotPin}>Quên mã PIN?</button>
          <button className="btn-ghost" onClick={onBack}>← Quay lại</button>
        </div>
      </div>
    </div>
  );
}
