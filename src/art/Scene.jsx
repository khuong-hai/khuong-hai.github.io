// PLACEHOLDER ART — thay bằng bg_*.png thật khi có (mục 5B trong kế hoạch).
// Dùng gradient + hình khối nổi (đảo lơ lửng) để gợi không khí Numeria
// mà không cần asset vẽ tay.

// Nền thật (đã cắt từ background sheet do bạn cung cấp) — mỗi preset dùng lớp
// "front" (chi tiết nhất) làm nền full-bleed. Lớp back/mid vẫn lưu trong
// /public/assets/backgrounds để dùng cho parallax cuộn thật ở Phase 2.
const PRESET_IMAGES = {
  splash: '/assets/backgrounds/bg_splash_screen.png',
  chonnhanvat: '/assets/backgrounds/bg_chonnhanvat.png',
  intro: '/assets/backgrounds/bg_numeria_intro_front.png',
  chaos: '/assets/backgrounds/bg_numeria_chaos_front.png',
  chapter1: '/assets/backgrounds/bg_chapter1_area_front.png',
  'chapter1-intro': '/assets/backgrounds/bg_danchuyenchuong1.png',
  gate: '/assets/backgrounds/bg_cong_so_front.png',
  map: '/assets/backgrounds/bg_chapter1_area_front.png',
};

export default function Scene({ preset = 'intro', children }) {
  const img = PRESET_IMAGES[preset] || PRESET_IMAGES.intro;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #2c1f57 0%, #1a1136 100%)',
      }}
    >
      <img
        src={img}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 70%',
        }}
        draggable={false}
      />
      {/* lớp phủ tối nhẹ để chữ/nhân vật luôn nổi rõ trên mọi nền */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,12,45,0.35) 0%, rgba(20,12,45,0.55) 100%)' }} />
      <div className="stars-bg" />
      {children}
    </div>
  );
}
