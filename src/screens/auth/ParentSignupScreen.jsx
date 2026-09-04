import { useState } from 'react';
import Scene from '../../art/Scene';
import ImgButton from '../../systems/ImgButton';
import { useAuthStore } from '../../store/authStore';

export default function ParentSignupScreen({ onDone }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const signupParent = useAuthStore((s) => s.signupParent);

  function handleSubmit() {
    if (!emailOrPhone.trim() || !password || !confirm) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (password.length < 4) {
      setError('Mật khẩu cần ít nhất 4 ký tự.');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }
    signupParent(emailOrPhone.trim(), password);
    onDone();
  }

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chonnhanvat" />
      <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: 380 }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginBottom: 6 }}>
          Đăng ký tài khoản Phụ huynh
        </h2>
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: 20, fontWeight: 600 }}>
          Để bắt đầu hành trình cùng Numeria
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
        <input
          className="auth-input"
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <ImgButton kind="tieptuc" onClick={handleSubmit} height="clamp(46px, 8vw, 62px)" />
        </div>
      </div>
    </div>
  );
}
