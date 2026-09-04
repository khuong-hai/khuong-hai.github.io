import { useState } from 'react';
import Scene from '../../art/Scene';
import PinPad from '../../systems/PinPad';
import { useAuthStore } from '../../store/authStore';

// SETUP-03 — Tạo Student PIN (spec mục 6.4 + 6.5): phụ huynh đặt PIN cho
// con, không được trùng Parent PIN. Chạy TRƯỚC khi chọn nhân vật/nhập tên
// (spec mục 7 dời sau splash) nên chưa có tên con — dùng nhãn chung "con".
export default function CreateStudentPinScreen({ onDone }) {
  const [step, setStep] = useState('enter'); // 'enter' | 'confirm'
  const [attempt, setAttempt] = useState(0);
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const parentPin = useAuthStore((s) => s.parentPin);
  const setStudentPin = useAuthStore((s) => s.setStudentPin);

  function retryFromStart(message) {
    setError(message);
    setShake(true);
    setStep('enter');
    setFirstPin('');
    setAttempt((n) => n + 1);
    setTimeout(() => setShake(false), 400);
  }

  function handleFirstComplete(pin) {
    if (pin === parentPin) {
      retryFromStart('Mã này đang được dùng cho khu vực Phụ huynh. Hãy chọn mã khác cho con.');
      return;
    }
    setError('');
    setFirstPin(pin);
    setStep('confirm');
  }

  function handleConfirmComplete(pin) {
    if (pin !== firstPin) {
      retryFromStart('Hai lần nhập chưa khớp. Thử lại nhé!');
      return;
    }
    setStudentPin(pin);
    onDone();
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6, maxWidth: 340 }}>
          {step === 'enter' ? 'Tạo mã PIN cho con' : 'Nhập lại mã PIN để xác nhận'}
        </h2>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 26, fontWeight: 600 }}>
          Con sẽ dùng mã này mỗi lần vào Numeria
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
