import { useState, useEffect } from 'react';
import DialogueBox from '../systems/DialogueBox';
import { useHintEscalation } from '../systems/useHintEscalation';
import { playSfx } from '../systems/sound';

export default function BuildNumberTemplate({ round, feedback, onRoundComplete }) {
  const [tensPick, setTensPick] = useState(null);
  const [onesPick, setOnesPick] = useState(null);
  const [status, setStatus] = useState('playing'); // playing | correct
  const { wrongCount, hintLevel, registerWrong, reset } = useHintEscalation();

  useEffect(() => {
    setTensPick(null);
    setOnesPick(null);
    setStatus('playing');
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (tensPick === null || onesPick === null || status === 'correct') return;
    if (tensPick === round.tens && onesPick === round.ones) {
      setStatus('correct');
      playSfx('correct');
      const msg = feedback.correct[Math.floor(Math.random() * feedback.correct.length)];
      setTimeout(() => onRoundComplete(msg), 1100);
    } else {
      playSfx('wrong');
      registerWrong();
      const t = setTimeout(() => {
        setTensPick(null);
        setOnesPick(null);
      }, 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tensPick, onesPick]);

  // Phát tiếng gợi ý đúng lúc mức hint tăng lên — không lặp lại nếu vẫn
  // đứng yên ở mức đó.
  useEffect(() => {
    if (hintLevel > 0) playSfx('hint');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintLevel]);

  const hintText = hintLevel === 1 ? feedback.hint2 : hintLevel === 2 ? feedback.hint3 : feedback.wrong;

  function PickerRow({ label, options, value, onPick, correctValue }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span className="font-display" style={{ fontSize: 13, fontWeight: 700, opacity: 0.8 }}>{label}</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {options.map((n) => {
            const isGlow = hintLevel === 2 && n === correctValue && status !== 'correct';
            const isPicked = value === n;
            return (
              <button
                key={n}
                onClick={() => onPick(n)}
                disabled={status === 'correct'}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#2b1c4f',
                  background: isPicked ? 'var(--crystal)' : 'linear-gradient(180deg, #fff8ed, #f4ead2)',
                  border: isGlow ? '3px solid var(--gold)' : '3px solid transparent',
                  boxShadow: isGlow ? '0 0 18px var(--gold)' : '0 5px 0 rgba(0,0,0,0.15)',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, width: '100%' }}>
      <div
        className="pop-in"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          fontWeight: 800,
          color: 'var(--paper)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span>{tensPick !== null ? tensPick * 10 : '?'}</span>
        <span style={{ opacity: 0.6, fontSize: 22 }}>+</span>
        <span>{onesPick !== null ? onesPick : '?'}</span>
        <span style={{ opacity: 0.6, fontSize: 22 }}>=</span>
        <span style={{ color: status === 'correct' ? 'var(--crystal)' : 'var(--gold)' }}>{round.target}</span>
      </div>

      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
        <PickerRow label="Số chục" options={round.tensOptions} value={tensPick} onPick={setTensPick} correctValue={round.tens} />
        <PickerRow label="Số đơn vị" options={round.onesOptions} value={onesPick} onPick={setOnesPick} correctValue={round.ones} />
      </div>

      <div style={{ minHeight: 78, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {status !== 'correct' && wrongCount > 0 && (
          <DialogueBox speaker="Lumi" text={hintText} expression={hintLevel > 0 ? 'hint' : 'worried'} />
        )}
      </div>
    </div>
  );
}
