import { useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import SoundToggle from '../systems/SoundToggle';
import ImgButton from '../systems/ImgButton';

export default function VideoIntro({ onComplete }) {
  const videoRef = useRef(null);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const [stopped, setStopped] = useState(false);

  // Dừng video (hết clip hoặc bấm "Bỏ qua") không chuyển màn ngay — hiện nút
  // "Tham Gia" để người chơi tự bấm mới sang màn chọn nhân vật.
  function stopVideo() {
    videoRef.current.pause();
    setStopped(true);
  }

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <video
        ref={videoRef}
        src="/assets/video/intro_cinematic.mp4"
        autoPlay
        muted={!soundEnabled}
        playsInline
        onEnded={stopVideo}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Icon âm thanh đặt bên trái để không đè lên nút "Bỏ qua"/"Tham Gia" bên phải */}
      <SoundToggle style={{ left: 18, right: 'auto' }} />
      {stopped ? (
        // Lớp ngoài lo căn giữa (translateX tĩnh), lớp trong lo hiệu ứng
        // pop-in (animation transform: scale) — 2 transform trên cùng 1 thẻ
        // sẽ đè nhau (animation thắng), làm mất căn giữa. Tách 2 lớp như
        // MainMenuScreen đã từng gặp lỗi tương tự.
        <div style={{ position: 'absolute', left: '50%', bottom: '12%', transform: 'translateX(-50%)' }}>
          <div className="pop-in">
            <ImgButton kind="thamgia" onClick={onComplete} height="clamp(56px, 9vw, 80px)" />
          </div>
        </div>
      ) : (
        <button
          className="btn-ghost"
          style={{ position: 'absolute', top: 20, right: 20 }}
          onClick={stopVideo}
        >
          Bỏ qua ⏭
        </button>
      )}
    </div>
  );
}
