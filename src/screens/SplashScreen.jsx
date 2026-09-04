import Scene from '../art/Scene';
import ImgButton from '../systems/ImgButton';
import SoundToggle from '../systems/SoundToggle';

export default function SplashScreen({ onDone }) {
  return (
    <div className="safe-stage fade-in">
      <Scene preset="splash" />
      <SoundToggle />
      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/assets/logo_numeria.png"
          alt="Numeria — Hành Trình Khôi Phục Trái Tim Toán Học"
          className="float"
          style={{ width: 'min(78vw, 420px)', height: 'auto', marginBottom: 8, display: 'block' }}
          draggable={false}
        />
        <div style={{ marginTop: 18 }}>
          <ImgButton kind="batdau" onClick={onDone} height="clamp(52px, 9vw, 76px)" />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        Phát triển bởi Thanh Khương K03 - AIUNI @2026
      </div>
    </div>
  );
}
