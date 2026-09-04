import { useEffect, useRef, useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import VideoIntro from './screens/VideoIntro';
import AvatarSelect from './screens/AvatarSelect';
import NameInput from './screens/NameInput';
import MainMenuScreen from './screens/MainMenuScreen';
import MapScreen from './screens/MapScreen';
import ChapterMapScreen from './screens/ChapterMapScreen';
import ChapterIntroStory from './screens/ChapterIntroStory';
import MissionScreen from './screens/MissionScreen';
import ParentSignupScreen from './screens/auth/ParentSignupScreen';
import CreateParentPinScreen from './screens/auth/CreateParentPinScreen';
import CreateStudentPinScreen from './screens/auth/CreateStudentPinScreen';
import RoleSelectScreen from './screens/auth/RoleSelectScreen';
import StudentPinLoginScreen from './screens/auth/StudentPinLoginScreen';
import ParentPinLoginScreen from './screens/auth/ParentPinLoginScreen';
import ParentForgotPinScreen from './screens/auth/ParentForgotPinScreen';
import ParentHomeScreen from './screens/auth/ParentHomeScreen';
import mission1 from './content/mission1.json';
import mission2 from './content/mission2.json';
import { useGameStore } from './store/gameStore';
import { useAuthStore, selectDeviceReady } from './store/authStore';
import { playSfx } from './systems/sound';

const MISSIONS = { m1: mission1, m2: mission2 };

// Nhạc nền chạy liên tục xuyên suốt cụm 3 màn Main Menu ⇄ World Map ⇄
// Chapter Map (kể cả đi lùi qua lại) — chỉ dừng khi vào Mission, và KHÔNG
// phát lại từ đầu khi quay ra (audio.pause() giữ nguyên currentTime, nên
// .play() lại là tiếp tục đúng chỗ đang dừng). Mission dùng nhạc riêng
// (music_mission_loop) — 2 audio element tách biệt để không đụng vị trí
// đang phát của nhạc nhóm map.
const MAIN_MUSIC_STAGES = new Set(['main-menu', 'map', 'chapter1-map', 'demo-end']);

// STAGE (thiết bị NEW, lần đầu — KHÔNG qua màn logo splash trước Signup):
//   parent-signup -> create-parent-pin -> create-student-pin -> setup-splash
//   (logo Numeria) -> story-intro -> avatar-select -> name-input -> main-menu
//   -> map -> chapter-intro (lần đầu) -> chapter1-map (đảo số, chọn mission)
//   -> mission:<id> -> chapter1-map ...
// STAGE (thiết bị READY, các lần mở sau — chạy được cả offline):
//   boot-splash (logo Numeria) -> role-select -> student-pin-login -> main-menu ...
//                                              -> parent-pin-login -> parent-home
//                                                 (hoặc "Quên mã PIN?" -> parent-forgot-pin
//                                                  -> xác thực email/mật khẩu -> đặt PIN mới -> parent-home)
// MainMenuScreen's nút "Thoát" -> setStage('boot-splash') để demo lại luồng
// đăng nhập lần 2 (Role Select) mà không cần reload trang thật.
// `stage` không được persist (xem gameStore) nên mỗi lần RELOAD app đều bắt
// đầu lại từ đầu — nhưng thiết bị NEW và READY khởi động ở stage khác nhau
// (đọc deviceReady 1 lần lúc mount, không phải mỗi lần bấm splash) vì
// "setup-splash" (ngay sau khi vừa tạo xong 2 PIN) và "boot-splash" (mở app
// từ đầu trên máy đã READY) tuy cùng hiện SplashScreen nhưng dẫn tới 2 nơi
// khác nhau — không thể gộp chung 1 handler dựa theo deviceReady lúc bấm nút,
// vì ngay sau khi tạo PIN xong deviceReady đã = true nên sẽ tính nhầm thành
// "quay lại chọn vai trò" thay vì đi tiếp vào flow game gốc.
export default function App() {
  const [stage, setStage] = useState(() => (selectDeviceReady(useAuthStore.getState()) ? 'boot-splash' : 'parent-signup'));
  const [activeMissionId, setActiveMissionId] = useState(null);
  const mainMusicRef = useRef(null);
  const missionMusicRef = useRef(null);

  const profile = useGameStore((s) => s.profile);
  const hasSeenIntro = useGameStore((s) => s.hasSeenIntro);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const setAvatar = useGameStore((s) => s.setAvatar);
  const markIntroSeen = useGameStore((s) => s.markIntroSeen);
  const completeMission = useGameStore((s) => s.completeMission);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  useEffect(() => {
    const main = mainMusicRef.current;
    const mission = missionMusicRef.current;
    if (!main || !mission) return;
    if (MAIN_MUSIC_STAGES.has(stage)) {
      main.play().catch(() => {});
      mission.pause();
    } else if (stage === 'mission') {
      mission.play().catch(() => {});
      main.pause();
    } else {
      // Các màn cinematic đầu game (splash/video/chọn nhân vật) — chưa có
      // nhạc nền, cả 2 track đều tắt.
      main.pause();
      mission.pause();
    }
    // .catch ở trên: trình duyệt có thể chặn autoplay nếu chưa có tương tác
    // nào từ người dùng trong phiên — bỏ qua lỗi, nhạc sẽ tự phát được ở
    // lần bấm nút tiếp theo vì đó luôn là 1 user gesture thật.
  }, [stage]);

  // Mute toàn cục (icon 🔊/🔇 ở màn cinematic đầu game) áp dụng cho cả 2
  // track nhạc nền — sfx tự đọc cờ này riêng trong playSfx().
  useEffect(() => {
    if (mainMusicRef.current) mainMusicRef.current.muted = !soundEnabled;
    if (missionMusicRef.current) missionMusicRef.current.muted = !soundEnabled;
  }, [soundEnabled]);

  // Tiếng bấm nút áp dụng cho TOÀN APP — nghe mọi click vào <button> (kể cả
  // các nút CSS thường, map hotspot...) thay vì phải gắn riêng từng nơi.
  // Nút disabled không bắn sự kiện click nên tự động không phát tiếng.
  useEffect(() => {
    function handleClick(e) {
      if (e.target.closest('button')) playSfx('tap');
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function handleEnterChapter1() {
    // World Map -> Chapter 1: lần đầu (chưa có mission nào xong) thì xem
    // chapter-intro trước; các lần sau vào thẳng đảo số của chương.
    const hasStartedChapter = Object.keys(completedMissions).length > 0;
    setStage(hasStartedChapter ? 'chapter1-map' : 'chapter-intro');
  }

  function handleChapterIntroDone() {
    setStage('chapter1-map');
  }

  function handlePlayMission(missionId) {
    setActiveMissionId(missionId);
    setStage('mission');
  }

  function handleMissionComplete(missionId, reward) {
    completeMission(missionId, reward);
    // Quay lại đảo số của chương để người chơi tự chọn nhiệm vụ tiếp theo
    // (giờ đã hiện mở khoá), thay vì tự động nhảy sang mission kế tiếp.
    setStage('chapter1-map');
  }

  return (
    <div className="numeria-app">
      <audio ref={mainMusicRef} src="/assets/audio/music/music_main_loop.mp3" loop preload="auto" />
      <audio ref={missionMusicRef} src="/assets/audio/music/music_mission_loop.mp3" loop preload="auto" />

      {stage === 'boot-splash' && <SplashScreen onDone={() => setStage('role-select')} />}

      {stage === 'setup-splash' && <SplashScreen onDone={() => setStage('story-intro')} />}

      {stage === 'parent-signup' && <ParentSignupScreen onDone={() => setStage('create-parent-pin')} />}

      {stage === 'create-parent-pin' && (
        <CreateParentPinScreen onDone={() => setStage('create-student-pin')} />
      )}

      {stage === 'create-student-pin' && (
        <CreateStudentPinScreen onDone={() => setStage('setup-splash')} />
      )}

      {stage === 'role-select' && (
        <RoleSelectScreen
          onSelectStudent={() => setStage('student-pin-login')}
          onSelectParent={() => setStage('parent-pin-login')}
        />
      )}

      {stage === 'student-pin-login' && (
        <StudentPinLoginScreen
          // profile.name rỗng nghĩa là chưa từng hoàn thành avatar-select/
          // name-input thật (vd: vừa tạo PIN xong rồi reload dở chừng —
          // DEFAULT_AVATAR_ID trong gameStore chỉ để card Role Select không
          // vỡ ảnh, KHÔNG coi là "đã chọn nhân vật thật") — vẫn đưa qua đúng
          // luồng chọn nhân vật + đặt tên như học sinh mới, không nhảy tắt
          // vào main-menu.
          onSuccess={() => setStage(profile.name ? 'main-menu' : 'avatar-select')}
          onBack={() => setStage('role-select')}
        />
      )}

      {stage === 'parent-pin-login' && (
        <ParentPinLoginScreen
          onSuccess={() => setStage('parent-home')}
          onBack={() => setStage('role-select')}
          onForgotPin={() => setStage('parent-forgot-pin')}
        />
      )}

      {stage === 'parent-forgot-pin' && (
        <ParentForgotPinScreen
          onDone={() => setStage('parent-home')}
          onCancel={() => setStage('parent-pin-login')}
        />
      )}

      {stage === 'parent-home' && <ParentHomeScreen onBack={() => setStage('role-select')} />}

      {stage === 'story-intro' && (
        <VideoIntro
          onComplete={() => {
            markIntroSeen();
            setStage('avatar-select');
          }}
        />
      )}

      {stage === 'avatar-select' && (
        <AvatarSelect
          onSelect={(id) => {
            setAvatar(id);
            setStage('name-input');
          }}
        />
      )}

      {stage === 'name-input' && (
        <NameInput avatarId={profile.avatarId} onDone={() => setStage('main-menu')} />
      )}

      {stage === 'main-menu' && (
        <MainMenuScreen onContinue={() => setStage('map')} onExit={() => setStage('boot-splash')} />
      )}

      {stage === 'map' && (
        <MapScreen onEnterChapter1={handleEnterChapter1} onBackToMainMenu={() => setStage('main-menu')} />
      )}

      {stage === 'chapter-intro' && <ChapterIntroStory onDone={handleChapterIntroDone} />}

      {stage === 'chapter1-map' && (
        <ChapterMapScreen
          onPlayMission={handlePlayMission}
          onComingSoon={() => setStage('demo-end')}
          onBackToWorld={() => setStage('map')}
        />
      )}

      {stage === 'demo-end' && (
        <div className="safe-stage fade-in">
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <img src="/assets/lumi/happy.png" alt="Lumi" style={{ width: 130 }} className="float" />
            <div className="dialogue-box" style={{ textAlign: 'center', maxWidth: 420 }}>
              <span className="dialogue-name">Lumi</span>
              <p style={{ margin: 0 }}>
                Con đã hoàn thành 2 nhiệm vụ đầu tiên của bản demo rồi! 🎉
                <br />
                Mission 3, 4, 5 đang được xây dựng tiếp, con quay lại sau nhé!
              </p>
            </div>
            <button className="btn-primary" onClick={() => setStage('chapter1-map')}>Quay lại bản đồ</button>
          </div>
        </div>
      )}

      {stage === 'mission' && activeMissionId && (
        <MissionScreen
          mission={MISSIONS[activeMissionId]}
          onMissionComplete={handleMissionComplete}
          onBackToMap={() => setStage('chapter1-map')}
        />
      )}
    </div>
  );
}
