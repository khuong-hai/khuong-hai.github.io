import { useEffect, useState } from 'react';
import Scene from '../art/Scene';
import ZeroArt from '../art/ZeroArt';
import DialogueBox from '../systems/DialogueBox';

// Kịch bản theo SRS mục 1.2–1.4 và Game Flow mục 2.1.
// Lời thoại nhân vật dùng nguyên văn SRS; caption dẫn chuyện là chú thích
// bổ sung để nối cảnh, không phải lời thoại nhân vật.
const BEATS = [
  { scene: 'intro', duration: 3400, visual: 'heart-whole', caption: 'Trái Tim Toán Học giữ cho Numeria vận hành đúng quy luật.' },
  { scene: 'intro', duration: 3400, visual: 'zero', speaker: 'Zero', text: 'Tại sao mọi thứ lúc nào cũng phải đúng chứ?' },
  { scene: 'chaos', duration: 3800, visual: 'heart-break', caption: 'Zero phá vỡ Trái Tim Toán Học! Trái Tim vỡ thành 8 Mảnh Pha Lê, bay tới 8 vùng đất của Numeria.' },
  { scene: 'chaos', duration: 3000, visual: 'chaos', caption: 'Numeria bắt đầu hỗn loạn...' },
  { scene: 'chaos', duration: 3400, visual: 'lumi', speaker: 'Lumi', expression: 'worried', text: 'Một mình tớ không thể cứu Numeria.' },
  { scene: 'chaos', duration: 3400, visual: 'lumi', speaker: 'Lumi', expression: 'idle', text: 'Cậu sẽ trở thành Nhà Thám Hiểm và giúp tớ chứ?' },
];

function Visual({ kind }) {
  if (kind === 'heart-whole') {
    return (
      <img
        src="/assets/vfx/heart_whole.png"
        alt=""
        className="pop-in float"
        style={{ height: 'clamp(120px, 20vw, 220px)', width: 'auto' }}
      />
    );
  }
  if (kind === 'heart-break') {
    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 24px)' }}>
        <ZeroArt pose="attack" size="clamp(170px, 26vw, 320px)" className="pop-in" />
        <img
          src="/assets/vfx/heart_explosion.png"
          alt=""
          className="pop-in"
          style={{ height: 'clamp(140px, 22vw, 260px)', width: 'auto' }}
        />
      </div>
    );
  }
  if (kind === 'chaos') {
    return (
      <img
        src="/assets/vfx/dark_vortex.png"
        alt=""
        className="shake"
        style={{ height: 'clamp(110px, 18vw, 200px)', width: 'auto' }}
      />
    );
  }
  if (kind === 'zero') {
    return <ZeroArt pose="default" size="clamp(150px, 24vw, 280px)" animate />;
  }
  if (kind === 'lumi') {
    return null; // Lumi được vẽ trong DialogueBox
  }
  return null;
}

export default function StoryIntro({ onDone }) {
  const [step, setStep] = useState(0);
  const beat = BEATS[step];

  useEffect(() => {
    if (step >= BEATS.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), beat.duration);
    return () => clearTimeout(t);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const finished = step >= BEATS.length;

  return (
    <div className="safe-stage fade-in">
      <Scene preset={finished ? 'chaos' : beat.scene} />
      <button
        className="btn-ghost"
        style={{ position: 'absolute', top: 20, right: 20 }}
        onClick={onDone}
      >
        Bỏ qua ⏭
      </button>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, width: '100%' }}>
        {!finished && (
          <>
            <div style={{ minHeight: 'clamp(150px, 24vw, 320px)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {beat.visual !== 'lumi' && <Visual kind={beat.visual} />}
            </div>
            {beat.speaker ? (
              <DialogueBox speaker={beat.speaker} text={beat.text} expression={beat.expression || 'idle'} />
            ) : (
              <p key={step} className="pop-in font-display" style={{ maxWidth: 480, textAlign: 'center', fontSize: 16, fontWeight: 600, opacity: 0.9 }}>
                {beat.caption}
              </p>
            )}
          </>
        )}

        {finished && (
          <div className="pop-in" style={{ textAlign: 'center' }}>
            <p className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 22 }}>
              Numeria đang cần con giúp đỡ!
            </p>
            <button className="btn-primary" onClick={onDone}>THAM GIA</button>
          </div>
        )}
      </div>
    </div>
  );
}
