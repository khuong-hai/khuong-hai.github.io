// Nút bấm dùng ảnh thật (chỉ dùng cho nhãn khớp đúng chữ đã khắc sẵn trong ảnh:
// Bắt đầu, Tiếp tục...). Các nhãn khác vẫn dùng nút CSS (.btn-primary) vì linh hoạt hơn.
const FILES = {
  batdau: '/assets/ui/btn_batdau.png',
  tieptuc: '/assets/ui/btn_tieptuc.png',
  chon: '/assets/ui/btn_chon.png',
  vaonumberia: '/assets/ui/btn_vaonumberia.png',
  vongtieptheo: '/assets/ui/btn_vongtieptheo.png',
  xacnhan: '/assets/ui/btn_xacnhan.png',
  hoanthanh: '/assets/ui/btn_hoanthanh.png',
  thamgia: '/assets/ui/btn_thamgia.png',
};

export default function ImgButton({ kind, onClick, height = 'clamp(48px, 8vw, 68px)', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 0.12s ease',
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.95)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img src={FILES[kind]} alt="" style={{ height, width: 'auto', display: 'block' }} draggable={false} />
    </button>
  );
}
