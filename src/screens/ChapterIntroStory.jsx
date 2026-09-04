import { useState } from 'react';
import Scene from '../art/Scene';
import DialogueBox from '../systems/DialogueBox';
import ImgButton from '../systems/ImgButton';
import chapter1 from '../content/chapter1.json';

export default function ChapterIntroStory({ onDone }) {
  const [i, setI] = useState(0);
  const beat = chapter1.introStory[i];
  const isLast = i === chapter1.introStory.length - 1;

  return (
    <div className="safe-stage fade-in">
      <Scene preset="chapter1-intro" />

      {/* Cho phép bỏ qua đoạn dẫn chuyện, vào thẳng đảo số của chương —
          dùng chung onDone (cùng đích tới với việc xem hết 4 câu thoại). */}
      <button
        className="btn-ghost"
        style={{ position: 'absolute', top: 18, left: 18 }}
        onClick={onDone}
      >
        ← Bản đồ
      </button>

      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {beat.speaker ? (
          <DialogueBox
            speaker={beat.speaker}
            text={beat.text}
            expression={beat.speaker === 'Lumi' ? 'idle' : beat.speaker === 'number' ? 'wrong' : 'worried'}
            onNext={() => (isLast ? onDone() : setI((n) => n + 1))}
            nextLabel={isLast ? 'Bắt đầu' : 'Tiếp tục'}
          />
        ) : (
          <div className="dialogue-box pop-in" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>{beat.text}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <ImgButton kind="tieptuc" onClick={() => setI((n) => n + 1)} height="clamp(38px, 6vw, 52px)" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
