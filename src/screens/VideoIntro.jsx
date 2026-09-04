import { useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import SoundToggle from '../systems/SoundToggle';

// File video (~135MB) vượt giới hạn 100MB/file của GitHub nên không nằm
// trong repo (xem .gitignore) — bản build production phát video từ 1 GitHub
// Release asset (host ngoài repo, không giới hạn 100MB, phục vụ trực tiếp
// qua URL, không có vấn đề như Git LFS trên GitHub Pages). Dev local vẫn
// dùng file thật trong public/assets/video/ như cũ, không đổi gì.
// TODO: thay URL dưới bằng link Release thật sau khi upload
// (https://github.com/<user>/<repo>/releases -> Draft a new release ->
// kéo thả file .mp4 vào -> Publish -> bấm chuột phải vào link file, Copy
// Link Address).
const VIDEO_SRC = import.meta.env.PROD
  ? 'https://github.com/<user>/<repo>/releases/download/<tag>/intro_cinematic.mp4'
  : '/assets/video/intro_cinematic.mp4';

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
        src={VIDEO_SRC}
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
