import { useState } from 'react';
import Scene from '../../art/Scene';
import PinPad from '../../systems/PinPad';
import { useAuthStore } from '../../store/authStore';

// Quên Parent PIN — không thuộc M08 (Student PIN reset dùng Parent PIN làm
// "cấp trên" xác nhận). Ở đây Parent PIN không có cấp trên nào khác, nên
// xác thực lại bằng chính email/mật khẩu đã đăng ký trước khi cho đặt PIN
// mới, sau đó vào thẳng Khu vực Phụ huynh (đã xác thực đủ 2 lớp rồi).
export default function ParentForgotPinScreen({ onDone, onCancel }) {
  const [step, setStep] = useState('verify'); // 'verify' | 'reset-enter' | 'reset-confirm'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const verifyParentAccount = useAuthStore((s) => s.verifyParentAccount);
  const setParentPin = useAuthStore((s) => s.setParentPin);

  function handleVerify() {
    if (!verifyParentAccount(emailOrPhone, password)) {
      setError('Email/SĐT hoặc mật khẩu chưa đúng. Thử lại nhé!');
      return;
    }
    setError('');
    setStep('reset-enter');
  }

  function retryReset(message) {
    setError(message);
    setShake(true);
    setStep('reset-enter');
    setFirstPin('');
    setAttempt((n) => n + 1);
    setTimeout(() => setShake(false), 400);
  }

  function handleFirstComplete(pin) {
    setError('');
    setFirstPin(pin);
    setStep('reset-confirm');
  }

  function handleConfirmComplete(pin) {
    if (pin !== firstPin) {
      retryReset('Hai lần nhập chưa khớp. Thử lại nhé!');
      return;
    }
    setParentPin(pin);
    onDone();
  }

  if (step === 'verify') {
    return (
      <div className="safe-stage fade-in">
        <Scene preset="chonnhanvat" />
        <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: 380 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6 }}>
            Xác nhận tài khoản Phụ huynh
          </h2>
          <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 20, fontWeight: 600 }}>
            Nhập lại email/SĐT và mật khẩu để đặt mã PIN mới
          </p>

          <input
            className="auth-input"
            placeholder="Email hoặc số điện thoại"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{error}</p>
          )}

          <button className="btn-primary" onClick={handleVerify}>Xác nhận</button>

          <div style={{ marginTop: 14 }}>
            <button className="btn-ghost" onClick={onCancel}>← Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6 }}>
          {step === 'reset-enter' ? 'Đặt mã PIN Phụ huynh mới' : 'Nhập lại mã PIN để xác nhận'}
        </h2>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 26, fontWeight: 600 }}>
          Dùng để bảo vệ Khu vực Phụ huynh
        </p>

        {error && (
          <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14, marginBottom: 12, maxWidth: 300 }}>
            {error}
          </p>
        )}

        <PinPad
          key={`${step}-${attempt}`}
          onComplete={step === 'reset-enter' ? handleFirstComplete : handleConfirmComplete}
          shake={shake}
        />
      </div>
    </div>
  );
}
