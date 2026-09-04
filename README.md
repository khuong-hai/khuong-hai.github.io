# Numeria — Demo Grade 2 / Chapter 1 (Proof of Concept)

Flow đã code: Splash → Video Intro (cinematic .mp4) → Chọn Avatar → Nhập tên → Map (World 1) → Chapter 1 Intro Story → Mission 1 (Đưa bạn về nhà) → Mission 2 (Xây lại ngôi nhà số) → quay lại Map.

## Chạy thử
```bash
npm install
npm run dev
```
Mở link hiện ra (thường là http://localhost:5173).

## Asset hiện tại
Nhân vật/bối cảnh trong gameplay đang là **placeholder SVG** (xem `src/art/Creature.jsx` và `src/art/Scene.jsx`).
Khi có asset thật (PNG theo danh sách đã thống nhất), chỉ cần thay các component này bằng thẻ `<img>`, không cần đổi logic game.
Riêng màn mở đầu (`src/screens/VideoIntro.jsx`) đã dùng video thật (`public/assets/video/intro_cinematic.mp4`), không phải placeholder.

## Cấu trúc quan trọng
- `src/content/` — dữ liệu Mission dạng JSON (data-driven, không hard-code trong component)
- `src/templates/` — 2 template gameplay dùng lại được: MatchTemplate (M1), BuildNumberTemplate (M2)
- `src/systems/` — DialogueBox, EnergyBar, useHintEscalation (đúng luật sai 1/2/3 lần theo SRS)
- `src/store/gameStore.js` — lưu tiến trình local (localStorage cho demo), thiết kế sẵn để cắm Firebase sync sau
- `src/App.jsx` — điều hướng toàn bộ flow (state machine)
- `src/screens/VideoIntro.jsx` — phát video cinematic mở đầu, thay cho `StoryIntro.jsx` (còn giữ trong repo nhưng không dùng nữa, phòng khi cần tái dùng kịch bản/lời thoại)

## Nạp asset mới
Thư mục staging `../Assets/` (ngoài project, cùng cấp `numeria_demo (5)/`) có cấu trúc
1:1 với `public/assets/`. Thả file vào đúng folder tương ứng ở đó rồi báo lại —
sẽ được copy thẳng vào `public/assets/` theo đúng đường dẫn, không cần đoán vị trí.

## Bước tiếp theo
1. Thay placeholder bằng asset thật khi có.
2. Viết thêm mission3.json, mission4.json, mission5.json (tái dùng CompareTemplate, SortTemplate, DeductionTemplate — chưa code trong bản này).
3. Setup Capacitor để build APK (`npm install @capacitor/core @capacitor/cli @capacitor/android`).
4. Deploy bản web lên Firebase Hosting/Vercel cho bản online.
