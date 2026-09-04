import { useState, useEffect } from 'react';
import NumberArt from '../art/NumberArt';
import DialogueBox from '../systems/DialogueBox';
import { useHintEscalation } from '../systems/useHintEscalation';
import { playSfx } from '../systems/sound';

// 5 màu nhà thật (không khắc số) — luân phiên theo round để đỡ lặp lại.
const HOUSE_IMAGES = [
  '/assets/houses/house_blank_01.png',
  '/assets/houses/house_blank_02.png',
  '/assets/houses/house_blank_03.png',
  '/assets/houses/house_blank_04.png',
  '/assets/houses/house_blank_05.png',
];

export default function MatchTemplate({ round, feedback, onRoundComplete, roundIndex = 0 }) {
  const [status, setStatus] = useState('playing'); // playing | correct
  const [shakeHouse, setShakeHouse] = useState(null);
  const { wrongCount, hintLevel, registerWrong, reset } = useHintEscalation();

  useEffect(() => {
    setStatus('playing');
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // Phát tiếng gợi ý đúng lúc mức hint tăng lên (sai lần 2 → hint chữ, sai
  // lần 3 → hint trực quan) — không lặp lại nếu vẫn đứng yên ở mức đó.
  useEffect(() => {
    if (hintLevel > 0) playSfx('hint');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintLevel]);

  function handlePick(house) {
    if (status === 'correct') return;
    if (house === round.target) {
      setStatus('correct');
      playSfx('correct');
      const msg = feedback.correct[Math.floor(Math.random() * feedback.correct.length)];
      setTimeout(() => onRoundComplete(msg), 900);
    } else {
      playSfx('wrong');
      registerWrong();
      setShakeHouse(house);
      setTimeout(() => setShakeHouse(null), 400);
    }
  }

  const hintText = hintLevel === 1 ? feedback.hint2 : hintLevel === 2 ? feedback.hint3 : feedback.wrong;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: '100%' }}>
      <NumberArt
        state={status === 'correct' ? 'happy' : wrongCount > 0 ? 'confused' : 'base'}
        size="clamp(90px, 14vw, 150px)"
        label={String(round.target)}
        animate
      />

      <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {round.houses.map((h, i) => {
          const isTarget = h === round.target;
          const showGlow = hintLevel === 2 && isTarget && status !== 'correct';
          const imgSrc = HOUSE_IMAGES[(roundIndex + i) % HOUSE_IMAGES.length];
          return (
            <button
              key={h}
              onClick={() => handlePick(h)}
              className={shakeHouse === h ? 'shake' : ''}
              disabled={status === 'correct'}
              style={{
                width: 'clamp(96px, 15vw, 160px)',
                background: 'transparent',
                border: 'none',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative', width: '100%' }}>
                {showGlow && (
                  <img
                    src="/assets/houses/house_glow_overlay.png"
                    alt=""
                    style={{ position: 'absolute', inset: '-18%', width: '136%', opacity: 0.9 }}
                  />
                )}
                <img
                  src={imgSrc}
                  alt={`Nhà ${h}`}
                  style={{ position: 'relative', width: '100%', display: 'block', filter: showGlow ? 'brightness(1.15)' : undefined }}
                  draggable={false}
                />
                <span
                  className="font-display"
                  style={{
                    position: 'absolute',
                    top: '38%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    fontSize: 'clamp(16px, 2.6vw, 24px)',
                    fontWeight: 800,
                    color: '#2b1c4f',
                    textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                  }}
                >
                  {h}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ minHeight: 78, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {status !== 'correct' && wrongCount > 0 && (
          <DialogueBox speaker="Lumi" text={hintText} expression={hintLevel > 0 ? 'hint' : 'worried'} />
        )}
      </div>
    </div>
  );
}
