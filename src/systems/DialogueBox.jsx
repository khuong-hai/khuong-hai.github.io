import { useLayoutEffect, useRef, useState } from 'react';
import Creature from '../art/Creature';
import LumiArt from '../art/LumiArt';
import ZeroArt from '../art/ZeroArt';
import NumberArt from '../art/NumberArt';
import ImgButton from './ImgButton';

const SPEAKERS = {
  Lumi: { color: '#4fe8c4', accent: '#2ba98a', label: 'Lumi' },
  Zero: { color: '#403a5e', accent: '#241645', label: 'Zero' },
  number: { color: '#ffd166', accent: '#e0a733', label: 'Bạn Số' },
};

// Nhãn nút khớp đúng chữ đã khắc sẵn trong ảnh ImgButton — nhãn khác vẫn
// dùng nút CSS (.btn-primary).
const NEXT_LABEL_TO_IMG_BTN = {
  'Tiếp tục': 'tieptuc',
  'Bắt đầu': 'batdau',
  'Vào Numeria': 'vaonumberia',
  'Vòng tiếp theo': 'vongtieptheo',
  'Hoàn thành': 'hoanthanh',
};

export default function DialogueBox({
  speaker,
  text,
  expression = 'idle',
  onNext,
  nextLabel = 'Tiếp tục',
  maxWidth = 680,
  lumiScale = 1,
}) {
  const meta = speaker ? SPEAKERS[speaker] : null;
  const imgBtnKind = onNext ? NEXT_LABEL_TO_IMG_BTN[nextLabel] : null;

  // Lumi đứng bên trái, cao gấp đôi khung hội thoại — đo chiều cao thật của
  // khung (đổi theo lượng chữ) rồi nhân đôi, thay vì áng chừng 1 size cố định.
  const boxRef = useRef(null);
  const [boxHeight, setBoxHeight] = useState(null);

  useLayoutEffect(() => {
    if (!boxRef.current || typeof ResizeObserver === 'undefined') return;
    const el = boxRef.current;
    const update = () => setBoxHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  // Chặn trần: Lumi không được cao quá 40% bề rộng khung tổng — nếu không,
  // khi khung hẹp (maxWidth nhỏ), Lumi to ra sẽ ăn gần hết chỗ, đẩy khung
  // hội thoại co lại thành hình vuông/cao thay vì hình chữ nhật nằm ngang
  // (chữ xuống dòng → khung càng cao → Lumi càng to thêm, vòng lặp xấu).
  const lumiSize = boxHeight ? `${Math.min(boxHeight * 2 * lumiScale, maxWidth * 0.4)}px` : 'clamp(96px, 15vw, 180px)';

  const nextButton = onNext && (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
      {imgBtnKind ? (
        <ImgButton kind={imgBtnKind} onClick={onNext} height="clamp(38px, 6vw, 52px)" />
      ) : (
        <button className="btn-primary" style={{ padding: '8px 22px', fontSize: 14 }} onClick={onNext}>
          {nextLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="pop-in" style={{ display: 'flex', alignItems: 'flex-end', gap: 14, maxWidth: `min(92vw, ${maxWidth}px)`, width: '100%' }}>
      {speaker === 'Lumi' && <LumiArt expression={expression} size={lumiSize} animate />}
      {speaker === 'Zero' && <ZeroArt pose="default" size="clamp(90px, 14vw, 160px)" animate />}
      {speaker === 'number' && <NumberArt state={expression} size="clamp(80px, 13vw, 150px)" animate />}
      {meta && speaker !== 'Lumi' && speaker !== 'Zero' && speaker !== 'number' && (
        <Creature color={meta.color} accent={meta.accent} expression={expression} size={72} animate />
      )}
      <div className="dialogue-box" ref={boxRef} style={{ flex: 1 }}>
        {meta && <span className="dialogue-name">{meta.label}</span>}
        <p style={{ margin: 0 }}>{text}</p>
        {nextButton}
      </div>
    </div>
  );
}
