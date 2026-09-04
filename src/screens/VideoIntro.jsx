import { useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import SoundToggle from '../systems/SoundToggle';

export default function VideoIntro({ onComplete }) {
  const videoRef = useRef(null);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  function goToNextScreen() {
    videoRef.current.pause();
    onComplete(); // callback do App.jsx truyền vào, tự unmount VideoIntro và mount màn kế tiếp
  }

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <video
        ref={videoRef}
        src="/assets/video/intro_cinematic.mp4"
        autoPlay
        muted={!soundEnabled}
        playsInline
        onEnded={goToNextScreen}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Icon âm thanh đặt bên trái để không đè lên nút "Bỏ qua" bên phải */}
      <SoundToggle style={{ left: 18, right: 'auto' }} />
      <button
        className="btn-ghost"
        style={{ position: 'absolute', top: 20, right: 20 }}
        onClick={goToNextScreen}
      >
        Bỏ qua ⏭
      </button>
    </div>
  );
}
