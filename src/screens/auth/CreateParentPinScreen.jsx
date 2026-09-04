import { useState } from 'react';
import Scene from '../../art/Scene';
import PinPad from '../../systems/PinPad';
import { useAuthStore } from '../../store/authStore';

// SETUP-01 — Tạo Parent PIN (spec mục 6.3): nhập 4 số, nhập lại để xác nhận.
export default function CreateParentPinScreen({ onDone }) {
  const [step, setStep] = useState('enter'); // 'enter' | 'confirm'
  const [attempt, setAttempt] = useState(0);
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const setParentPin = useAuthStore((s) => s.setParentPin);

  function retryFromStart(message) {
    setError(message);
    setShake(true);
    setStep('enter');
    setFirstPin('');
    setAttempt((n) => n + 1);
    setTimeout(() => setShake(false), 400);
  }

  function handleFirstComplete(pin) {
    setError('');
    setFirstPin(pin);
    setStep('confirm');
  }

  function handleConfirmComplete(pin) {
    if (pin !== firstPin) {
      retryFromStart('Hai lần nhập chưa khớp. Thử lại nhé!');
      return;
    }
    setParentPin(pin);
    onDone();
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6 }}>
          {step === 'enter' ? 'Tạo mã PIN Phụ huynh' : 'Nhập lại mã PIN để xác nhận'}
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
          onComplete={step === 'enter' ? handleFirstComplete : handleConfirmComplete}
          shake={shake}
        />
      </div>
    </div>
  );
}
