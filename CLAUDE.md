# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Numeria — a React 19 + Vite + Zustand educational game for Vietnamese grade-2 students (number sense: recognizing numbers to 100, tens/ones composition). Currently a proof-of-concept demo covering Chapter 1, Missions 1–2 only.

## Commands

```bash
npm run dev       # start Vite dev server (HMR) — default http://localhost:5173
npm run build     # production build
npm run preview   # preview the production build
npm run lint       # oxlint (rules: react/rules-of-hooks=error, react/only-export-components=warn)
```

No test suite/framework is configured in this repo.

## Architecture

**Flow control lives in one place: [src/App.jsx](src/App.jsx).** It is a single `useState('splash')` state machine. Screens are pure props-in/callback-out components with no routing library — every transition happens by `setStage(...)` in App.jsx.

Current stage graph:
```
splash → story-intro → avatar-select → name-input → main-menu → map (World Map)
  → chapter-intro (first time only) ┐
  → chapter1-map (Chapter Map) ←────┘
       → mission:<id> → back to chapter1-map (not auto-chain, not World Map)
```
- `name-input`'s confirmed screen ("Lumi + chosen character" greeting) leads to **`main-menu`**, not directly to the World Map.
- `main-menu`'s "Chơi tiếp" button leads to `map` (World Map). `map` has its own "← Màn hình chính" back button (`onBackToMainMenu`) returning to `main-menu`.
- `onBackToMap` from `MissionScreen`, the "Quay lại bản đồ" button on `demo-end`, and `ChapterIntroStory`'s "← Bản đồ" skip button all target **`chapter1-map`** — that's the real hub once a chapter is entered, not the World Map. `handleMissionComplete` does not auto-chain into the next mission; it always returns to `chapter1-map` so the player explicitly picks the next unlocked number themselves.

**Content is data, not code.** [src/content/](src/content/) holds mission/chapter definitions as JSON (`chapter1.json`, `mission1.json`, `mission2.json`). [src/screens/MissionScreen.jsx](src/screens/MissionScreen.jsx) picks the gameplay component via `TEMPLATES = { match: MatchTemplate, build: BuildNumberTemplate }` keyed off each mission's `type` field.

**Two reusable gameplay templates** in [src/templates/](src/templates/): `MatchTemplate` (m1) and `BuildNumberTemplate` (m2). 3 more (Compare/Sort/Deduction) are planned, not built — their map slots (numbers 3/4/5) already exist and render permanently grayed/non-interactive until then (see Map system).

**Hint escalation** centralized in [src/systems/useHintEscalation.js](src/systems/useHintEscalation.js): wrong×1 = silent retry, wrong×2 = text hint, wrong×3+ = visual highlight. Both templates also fire `playSfx('hint')` via a `useEffect` watching `hintLevel` (see Sound system) — don't duplicate that call inside `handlePick`/pick handlers, it's centralized on the level-change itself so it only fires once per escalation step.

**Persistence**: [src/store/gameStore.js](src/store/gameStore.js) — Zustand store mirrored to `localStorage` (key `numeria_save_v1`). `stage` itself in App.jsx is **not** persisted — every page reload restarts at `splash` regardless of saved progress (Splash/Video/Avatar/Name always replay). This is a known, not-yet-questioned quirk. Energy/stars/badges only awarded on a mission's *first* completion. `profile.name` is capitalized word-by-word (`capitalizeWords()` in `NameInput.jsx`) before being saved, so it's already display-ready anywhere it's read (Main Menu, Lumi's greeting).

## Map system (World Map + Chapter Map, two tiers)

Two separate screens, not one:
- **[src/screens/MapScreen.jsx](src/screens/MapScreen.jsx)** — "World Map". Background `public/assets/map/map_world1_bg.png`. Shows the World-1 castle+islands scene; only the **bottom-left island** (garden path/bridge) is unlocked and clickable (→ enters Chapter 1). The other 5 spots (4 side islands + center castle) always render a gray + `map_lock_badge.png` overlay via `<LockBadge/>`, no dark blob behind it (that was tried and explicitly rejected — keep it plain). No title/label text is drawn under the entry hotspot (explicitly removed).
- **[src/screens/ChapterMapScreen.jsx](src/screens/ChapterMapScreen.jsx)** — "Chapter Map" for Chapter 1 specifically. Background `public/assets/map/map_daosochuong1.png` ("Đảo Số Rực Rỡ") — a single island with 5 numbered mascots (1–5), each already labeled with its mission name on a wooden sign baked into the art (1="Đưa bạn về nhà"=m1, 2="Xây lại ngôi nhà số"=m2, 3/4/5 = future missions). Locked/not-yet-built numbers get **both** `grayscale(1) brightness(0.75)` **and** a `map_lock_badge.png` overlay now (this flip-flopped once — an earlier iteration deliberately had no lock icon here, that decision was reversed). "Unlocked but not yet completed" numbers get **no** extra decoration (no glow ring) — only the lock badge (locked) or the gold completed-badge (`map_node_completed.png`, done) distinguish state now; a `glow-pulse` ring was tried on unlocked spots across Main Menu/World Map/Chapter Map and explicitly removed everywhere as redundant.
- **Per-number hotspot sizing is NOT uniform.** `MISSION_SPOTS` in `ChapterMapScreen.jsx` carries separate `w`/`h` percentages per number (a tall/narrow "1" needs a different box than a short/wide "2") instead of one circular `size` — measured by cropping each digit with a fine pixel grid and reading its bounding box, then padding ~1.3×. Re-measure per-number if the art changes; don't revert to a single shared `size`.

**Both map images are currently 1672×941 (16:9)**, redrawn from an original 1536×1024 (3:2). If either image gets redrawn again, update the `IMG_AR` constant at the top of the corresponding screen file and re-derive hotspot coordinates — don't assume old percentages still line up.

**Hotspot positioning — `useSmartCoverFit`**: [src/systems/useTopCoverFit.js](src/systems/useTopCoverFit.js) (filename predates a rename, exports are `useSmartCoverFit`/`toSmartCoverPoint`). Both map screens use `object-fit: cover`-style full-bleed backgrounds, protected on **both axes**:
1. Measures the actual rendering container via `ResizeObserver` (not `window.innerWidth/Height`).
2. Takes `criticalYRange` **and** `criticalXRange` (currently `[1,97]`/`[10,82]`-ish per screen — tune per screen) and computes an offset that centers the crop on that range on whichever axis cover would crop, so nothing critical (logo, outermost numbers/islands) is ever cropped as long as there's room.
3. **If plain cover still can't fit the critical range on that axis**, it falls back to manually shrinking the image below 100%-cover scale on that axis (`fit.imgStyle` becomes explicit `width`/`height`/`top`-or-`left` percentages instead of `objectFit:'cover'`) — trading a thin background-color margin on the *other* pair of edges for guaranteed critical-content visibility. This is why a sky-blue gradient backdrop div sits behind the image on both screens — it's what shows through in that fallback case, don't remove it.
4. **The X-axis protection is not optional decoration** — it was added after a real bug: on portrait/mobile viewports, `containerAR < imgAspect` crops horizontally so hard (~60% of width gone) that `toSmartCoverPoint`'s `clampSafe` had to yank hotspots far from their visual position (a "completed" badge rendered next to a house instead of on its number) to keep them clickable. If you ever see a badge/icon floating away from its target art on a narrow window, suspect a missing or too-narrow `criticalXRange` before touching anything else.
5. `toSmartCoverPoint(x, y, fit, clampSafe)` converts a raw image-percent coordinate into on-screen percent; `clampSafe=true` additionally forces the point into the 10–90%/12–88% safe zone as a last-resort net — with correct `criticalXRange`/`criticalYRange` it should rarely have to actually clamp.

Hotspot coordinates are hand-measured from the current art via a Python+PIL percent-grid overlay (not derivable from code) — re-measure with the same technique after any art swap:
```python
from PIL import Image, ImageDraw
im = Image.open('map.png').convert('RGB'); w,h = im.size
d = ImageDraw.Draw(im)
for i in range(1,20):
    x=int(w*i/20); d.line([(x,0),(x,h)],fill=(255,0,0),width=1)
    y=int(h*i/20); d.line([(0,y),(w,y)],fill=(255,0,0),width=1)
    if i%2==0: d.text((x+2,2), f'{i*5}%', fill=(255,0,0)); d.text((2,y+2), f'{i*5}%', fill=(255,0,0))
im.save('/tmp/grid.png')
```
For tight per-element bounding boxes (e.g. one digit), crop a small region first and grid *that*, rather than eyeballing off the full-image grid.

## DialogueBox

[src/systems/DialogueBox.jsx](src/systems/DialogueBox.jsx) is shared by every speaker (Lumi, Zero, `number`, generic `Creature`).

- **Lumi sizing**: rendered **dynamically at 2× the dialogue box's own rendered height** (measured live via `ResizeObserver` on the box) — `lumiScale` prop (default `1`) multiplies that further; `NameInput.jsx`'s confirmed screen passes `lumiScale={2/3}`. `LumiArt` (`src/art/LumiArt.jsx`) sizes by **height**, not width — sizing by width against a height-derived value was a real bug (squeezed the box narrow/tall). Lumi's computed size is also **capped at 40% of the row's `maxWidth`** to stop a feedback loop (tall box → bigger Lumi → narrower box → text wraps → box gets taller → Lumi grows more). If Lumi looks oversized/squeezed on a new screen, check the cap and `maxWidth` prop first.
- **`speaker === 'number'` renders `<NumberArt state={expression} .../>`** — it used to hardcode `state="confused"` regardless of what was passed in; that was a bug (the "Tớ không nhớ nhà mình ở đâu nữa!" beat needed `wrong`, not `confused`). Always pass the intended `expression` explicitly from the caller now — don't rely on a default.
- **`NEXT_LABEL_TO_IMG_BTN`** auto-picks an `ImgButton` when `nextLabel` matches a known baked-in-image label (`Tiếp tục`, `Bắt đầu`, `Vào Numeria`, `Vòng tiếp theo`, `Hoàn thành`); anything else falls back to plain CSS `.btn-primary`. Extend this map (and `ImgButton.jsx`'s `FILES`) together when a new labeled button image arrives.
- The ornate `lumi_khunghoithoai.png` frame image (tried as a stretched dialogue-box background) was reverted — a fixed-aspect decorative frame can't flex to arbitrarily long/short text. The PNG stays in the repo unused.

## Sound system

Three pieces, all new this session — nothing here existed before:

- **[src/systems/sound.js](src/systems/sound.js)** — `playSfx(name)` for one-shot SFX (`tap`, `correct`, `wrong`, `hint`, `roundComplete`, `missionComplete`), each a `new Audio(...).play()` call. Reads `useGameStore.getState().soundEnabled` directly (not the hook — this is called from plain event handlers, not components) and no-ops if muted.
- **Background music — two independent `<audio loop>` elements live in [src/App.jsx](src/App.jsx)**, not per-screen: `mainMusicRef` (`music_main_loop.mp3`) plays whenever `stage` is in `{main-menu, map, chapter1-map, demo-end}`; `missionMusicRef` (`music_mission_loop.mp3`) plays whenever `stage === 'mission'`. Switching between the two calls `.pause()` (not unmount/remount), so `currentTime` is preserved — going Chapter Map → Mission → back to Chapter Map resumes the main track from where it left off rather than restarting. Both tracks' `.muted` are kept in sync with `soundEnabled` in a separate effect.
- **Global button-tap SFX**: a single `document.addEventListener('click', ...)` in `App.jsx` checks `e.target.closest('button')` and calls `playSfx('tap')` — this is *the* mechanism for "every button in the app makes a tap sound," not something wired per-component. Disabled `<button>`s don't dispatch click events natively, so they're silent automatically; no special-casing needed.
- **Global mute**: `soundEnabled` (bool, default `true`) lives in `gameStore.js`, persisted, toggled via `toggleSound()`. `[src/systems/SoundToggle.jsx](src/systems/SoundToggle.jsx)` is the 🔊/🔇 icon button — currently placed on `SplashScreen` and `VideoIntro` only (top-right, except VideoIntro moves it to top-left to avoid the "Bỏ qua" skip button). `VideoIntro`'s `<video>` gets `muted={!soundEnabled}` directly since the cinematic's own audio track isn't routed through `playSfx`/the BGM refs.

## Asset staging

External folder `../Assets/` (sibling of this project dir) mirrors `public/assets/` subfolders 1:1, plus `map/`, `avatar-cards/`, `audio/{music,sfx}/`, `root/`. User drops raw files there; copy into `public/assets/` on request. See `Assets/README.md`.

- `avatar-cards/`: `card_nha<id>.png` (finished character-select cards, full-bleed in `AvatarSelect.jsx`) and `nhanvat_nha<id>.png` (standalone character cutouts, used on `NameInput.jsx`'s confirmed screen **and** on `MainMenuScreen.jsx`, both the circular portrait and the full-body figure next to Lumi) — id mapping: `dandduong`/`truytim`/`kientao`/`giaima`.
- `ui/`: button PNGs consumed via `ImgButton.jsx`'s `FILES` map (`kind` → path) — labels must match text baked into the PNG. Current kinds: `batdau`, `tieptuc`, `chon`, `vaonumberia`, `vongtieptheo`, `xacnhan`, `hoanthanh`.
- `map/`: `map_world1_bg.png`, `map_daosochuong1.png`, `map_lock_badge.png`, `map_node_completed.png`.
- `numbers/`: `base.png`/`happy.png`/`confused.png`/`wrong.png` consumed by `NumberArt.jsx` — real character art now (a blue blob mascot), not placeholders.
- `houses/`: `house_blank_01..05.png` consumed by `MatchTemplate.jsx` (mission 1's house-picking game) — real art now. `house_01..05.png` and `house_glow_overlay.png` also exist in `public/assets/houses/` but only `house_blank_*` is actually referenced in code; don't assume the non-blank ones are wired to anything.
- `audio/music/`: `music_main_loop.mp3`, `music_mission_loop.mp3`. `audio/sfx/`: `sfx_button_tap.mp3`, `sfx_correct.mp3`, `sfx_wrong.mp3`, `sfx_hint.mp3`, `sfx_round_complete.mp3`, `sfx_mission_complete.mp3`.
- `video/intro_cinematic.mp4`: the `story-intro` stage's cinematic, now with real embedded voice/audio (grew from a ~2MB silent placeholder to ~140MB) — this is a real page-weight concern for slow connections, flagged but not yet addressed (no compression tooling installed; `ffmpeg` is not on this machine).

## Known in-flight state (as of this session)

- **Missions 3–5 have no content** — `chapter1.json`'s missions array only has m1/m2; the Chapter Map's numbers 3/4/5 are permanently locked and, when clicked, show the same `demo-end` stage message ("đang được xây dựng").
- `src/screens/StoryIntro.jsx` — unused (replaced by `VideoIntro.jsx` in the `story-intro` stage) but kept in the repo in case its dialogue is reused.
- `MainMenuScreen.jsx`'s "mảnh pha lê" (crystal shard) counter reads `stars` from the store, styled as `stars/8` per the game's lore (Trái Tim Toán Học shattered into 8 pieces) — but nothing in `mission1.json`/`mission2.json`'s `reward` objects actually grants `stars` yet, so it always shows `0/8`. It's a real display wired to real state, just state that's never incremented — not a fake placeholder, but don't assume it reflects real progress until a mission reward adds `stars`.
- `MainMenuScreen.jsx`'s "Câu chuyện" and "Cài đặt" sign buttons currently just show a 2s "Tính năng đang được xây dựng" toast — no real screens behind them yet.
- If a map image gets redrawn again: update `IMG_AR`, re-measure hotspot coordinates with the grid-overlay technique above, and re-check both `criticalXRange` and `criticalYRange` for the new composition.
- The video's large file size (~140MB) has no mitigation in place yet — worth revisiting (compression, or lazy/progressive loading) before this goes anywhere beyond local dev.
