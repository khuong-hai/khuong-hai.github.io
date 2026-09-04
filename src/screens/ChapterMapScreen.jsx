import EnergyBar from '../systems/EnergyBar';
import chapter1 from '../content/chapter1.json';
import { useGameStore } from '../store/gameStore';
import { useSmartCoverFit, toSmartCoverPoint } from '../systems/useTopCoverFit';

// Bản mới 1672×941, tỉ lệ 16:9 (trước là 3:2) — khớp màn desktop tốt hơn
// nhiều, nên hầu như không còn cần "zoom-out" hở lề 2 bên như bản cũ.
const IMG_AR = 1672 / 941;
// Vùng cần giữ nguyên khi bị crop: gần trọn ảnh — từ sát mép trên (logo
// "ĐẢO SỐ RỰC RỠ") tới sát mép dưới (biển gỗ dưới số 5 + thác nước). Nếu
// cover chuẩn không đủ chỗ, ảnh sẽ tự thu nhỏ (hở nhẹ nền 2 bên) thay vì cắt.
const CRITICAL_Y = [1, 97];
// Vùng ngang cần giữ: từ số 1 (x≈20%) tới số 4 (x≈72%), có margin — trên
// điện thoại dọc, cover theo chiều cao có thể crop ngang mất >60% bề rộng
// ảnh nếu không chặn, dễ làm số 1/4 ở rìa bị cắt hoặc icon lệch vị trí.
const CRITICAL_X = [10, 82];

// Toạ độ % đọc lại từ map_daosochuong1.png bản mới (16:9) — đảo số duy nhất
// có sẵn 5 số 1-5, mỗi số ứng với 1 mission. Chỉ m1/m2 có nội dung thật;
// 3/4/5 luôn khoá (chưa xây) — làm xám + icon khoá giống World Map.
// w/h đo riêng theo từng số (không ép vuông đều) — mỗi số hình dáng khác hẳn
// nhau (số "1" cao-gầy, số "2" thấp-rộng hơn...), dùng chung 1 kích thước
// tròn/vuông làm icon khoá không ôm khớp hình. Đo bằng lưới pixel trên ảnh
// gốc rồi nhân thêm ~1.3 lần để có vùng bấm/đặt icon thoải mái hơn khung
// người thật.
const MISSION_SPOTS = [
  { n: 1, missionId: 'm1', x: 20, y: 42, w: 8, h: 22 },
  { n: 2, missionId: 'm2', x: 41, y: 20, w: 10, h: 18 },
  { n: 3, missionId: null, x: 64, y: 22, w: 12, h: 20 },
  { n: 4, missionId: null, x: 72, y: 45, w: 11, h: 17 },
  { n: 5, missionId: null, x: 50, y: 63, w: 12, h: 19 },
];

function spotStyle(x, y, w, h) {
  return {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    height: `${h}%`,
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 'none',
    borderRadius: 12,
    padding: 0,
  };
}

// Đảo số riêng của Chapter 1 — vào từ World Map sau khi mở khoá chương này.
// Chọn 1 nhiệm vụ đang mở (unlocked/completed) ở đây để chơi.
export default function ChapterMapScreen({ onPlayMission, onComingSoon, onBackToWorld }) {
  const energy = useGameStore((s) => s.energy);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const gateReached = energy >= chapter1.energyTarget;
  const { ref, fit } = useSmartCoverFit(IMG_AR, CRITICAL_Y, CRITICAL_X);

  function spotState(spot) {
    if (!spot.missionId) return 'soon'; // m3-m5: chưa xây, luôn xám
    if (completedMissions[spot.missionId]?.done) return 'completed';
    const builtIds = MISSION_SPOTS.filter((s) => s.missionId).map((s) => s.missionId);
    const idx = builtIds.indexOf(spot.missionId);
    const prevId = builtIds[idx - 1];
    if (prevId && !completedMissions[prevId]?.done) return 'locked';
    return 'unlocked';
  }

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #bcdcf7 0%, #3f8fe0 100%)' }} />

      {/* Tràn kín mọi cạnh (kể cả trên/dưới) — chấp nhận crop nhẹ khi tỉ lệ
          cửa sổ không khớp đúng 3:2, thay vì để hở viền trên/dưới. */}
      <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
        <img
          src="/assets/map/map_daosochuong1.png"
          alt="Đảo Số Rực Rỡ — Chapter 1"
          style={fit.imgStyle}
          draggable={false}
        />

        {MISSION_SPOTS.map((spot) => {
          const state = spotState(spot);
          const clickable = state === 'unlocked' || state === 'completed';
          const p = toSmartCoverPoint(spot.x, spot.y, fit, true);
          return (
            <button
              key={spot.n}
              className="map-node"
              onClick={() => (clickable ? onPlayMission(spot.missionId) : onComingSoon())}
              style={{
                ...spotStyle(p.x, p.y, spot.w, spot.h),
                filter: state === 'locked' || state === 'soon' ? 'grayscale(1) brightness(0.75)' : 'none',
                opacity: state === 'locked' || state === 'soon' ? 0.7 : 1,
              }}
              aria-label={
                spot.missionId
                  ? chapter1.missions.find((m) => m.id === spot.missionId)?.name
                  : `Nhiệm vụ ${spot.n} — sắp ra mắt`
              }
            >
              {(state === 'locked' || state === 'soon') && (
                <img
                  src="/assets/map/map_lock_badge.png"
                  alt="Chưa mở khoá"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '46%',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  }}
                  draggable={false}
                />
              )}
              {state === 'completed' && (
                <img
                  src="/assets/map/map_node_completed.png"
                  alt="Đã hoàn thành"
                  style={{
                    position: 'absolute',
                    top: '-12%',
                    right: '-12%',
                    width: '42%',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                  }}
                  draggable={false}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          right: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <button className="btn-ghost" onClick={onBackToWorld}>← Bản đồ</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <EnergyBar current={energy} target={chapter1.energyTarget} />
          <span
            className="font-display"
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 999,
              background: gateReached ? 'var(--crystal)' : 'rgba(20,12,45,0.55)',
              color: gateReached ? 'var(--ink-deep)' : 'var(--paper)',
            }}
          >
            {gateReached ? 'Cổng đã mở' : 'Đang khám phá'}
          </span>
        </div>
      </div>
    </div>
  );
}
