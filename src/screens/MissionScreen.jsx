import { useState } from 'react';
import DialogueBox from '../systems/DialogueBox';
import EnergyBar from '../systems/EnergyBar';
import ImgButton from '../systems/ImgButton';
import MatchTemplate from '../templates/MatchTemplate';
import BuildNumberTemplate from '../templates/BuildNumberTemplate';
import chapter1 from '../content/chapter1.json';
import { useGameStore } from '../store/gameStore';
import { playSfx } from '../systems/sound';

const TEMPLATES = { match: MatchTemplate, build: BuildNumberTemplate };

export default function MissionScreen({ mission, onMissionComplete, onBackToMap }) {
  const [phase, setPhase] = useState('intro'); // intro | playing | roundFeedback | reward
  const [roundIndex, setRoundIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const energy = useGameStore((s) => s.energy);

  const Template = TEMPLATES[mission.type];
  const round = mission.rounds[roundIndex];
  const isLastRound = roundIndex === mission.rounds.length - 1;

  function handleRoundComplete(msg) {
    playSfx('roundComplete');
    setFeedbackText(msg);
    setPhase('roundFeedback');
  }

  function handleContinueAfterRound() {
    if (isLastRound) {
      playSfx('missionComplete');
      setPhase('reward');
    } else {
      setRoundIndex((r) => r + 1);
      setPhase('playing');
    }
  }

  return (
    <div className="safe-stage fade-in">
      {/* Game hiển thị trên nền map (đang chơi ở), map bị làm mờ để nổi bật
          nội dung nhiệm vụ phía trên — thay vì đổi hẳn sang scene riêng. */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src="/assets/map/map_daosochuong1.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(14px) brightness(0.7)',
            transform: 'scale(1.1)',
          }}
          draggable={false}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,12,45,0.35) 0%, rgba(20,12,45,0.55) 100%)',
          }}
        />
      </div>

      <div style={{ position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-ghost" onClick={onBackToMap}>← Bản đồ</button>
        <EnergyBar current={energy} target={chapter1.energyTarget} />
      </div>

      {phase === 'intro' && (
        <div style={{ position: 'relative' }}>
          <DialogueBox
            speaker="Lumi"
            text={mission.intro.text}
            onNext={() => setPhase('playing')}
            nextLabel="Bắt đầu"
          />
        </div>
      )}

      {phase === 'playing' && (
        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span className="font-display" style={{ fontSize: 12, fontWeight: 700, opacity: 0.6 }}>
            {mission.title} — Vòng {roundIndex + 1}/{mission.rounds.length}
          </span>
          <Template round={round} feedback={mission.feedback} onRoundComplete={handleRoundComplete} roundIndex={roundIndex} />
        </div>
      )}

      {phase === 'roundFeedback' && (
        <div className="pop-in" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>✨</div>
          <DialogueBox
            speaker="Lumi"
            expression="happy"
            text={feedbackText}
            onNext={handleContinueAfterRound}
            nextLabel={isLastRound ? 'Hoàn thành' : 'Vòng tiếp theo'}
          />
        </div>
      )}

      {phase === 'reward' && (
        <div className="pop-in" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="glow-pulse" style={{ fontSize: 72, marginBottom: 12 }}>⚡</div>
          <h3 className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>Nhiệm vụ hoàn thành!</h3>
          <p style={{ opacity: 0.85, fontWeight: 600, marginBottom: 22 }}>
            +{mission.reward.energy} Năng lượng
          </p>
          <ImgButton
            kind="tieptuc"
            onClick={() => onMissionComplete(mission.id, mission.reward)}
            height="clamp(46px, 8vw, 62px)"
          />
        </div>
      )}
    </div>
  );
}
