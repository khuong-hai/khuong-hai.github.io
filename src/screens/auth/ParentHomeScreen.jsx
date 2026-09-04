// PARENT-PLACEHOLDER — PARENT_HOME (spec mục 9, M09: "chỉ placeholder").
// Dashboard/report/reset-PIN thật thuộc phase sau, ngoài phạm vi hiện tại.
export default function ParentHomeScreen({ onBack }) {
  return (
    <div className="safe-stage fade-in">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #2c1f57 0%, #1a1136 100%)',
        }}
      />
      <div className="stars-bg" />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          textAlign: 'center',
          maxWidth: 480,
        }}
      >
        <img
          src="/assets/avatar-cards/card_phuhuynh.png"
          alt="Phụ huynh"
          className="float"
          style={{ width: 150, height: 'auto', borderRadius: 20, boxShadow: '0 6px 0 rgba(0,0,0,0.18), 0 10px 20px rgba(0,0,0,0.2)' }}
          draggable={false}
        />
        <h2 className="font-display">Khu vực Phụ huynh</h2>
        <div className="dialogue-box">
          <p style={{ margin: 0 }}>
            Trang quản lý dành cho phụ huynh (theo dõi tiến độ, đổi mã PIN cho con, cài đặt...) đang được xây dựng.
            Quay lại sau nhé!
          </p>
        </div>
        <button className="btn-primary" onClick={onBack}>
          ← Quay lại màn chọn vai trò
        </button>
      </div>
    </div>
  );
}
