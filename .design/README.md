# Handoff: Japanese Practice — UI Redesign ("Soft Bubble")

## Overview
A redesign of the **Japanese Practice** web app (nihongo-practice), a tool for learners of
Japanese (English-speaking, beginner level) to drill **hiragana** and **katakana**. This
handoff covers two screens:

1. **Home** — pick a script (Hiragana / Katakana) and start a practice session.
2. **Practice** — a drag-and-drop game: place scattered kana tiles into their correct spot
   in the gojūon (五十音) chart.

The chosen visual direction is **"Soft Bubble"**: warm pastel palette, generous rounded
corners, soft shadows, a friendly bouncing mascot, and a rounded Japanese typeface. Target
"pop" level ≈ 7/10 — playful but not over-decorated. Primary device: desktop / PC.

## About the Design Files
The files in this bundle are **design references authored in HTML** — a prototype showing the
intended look and behavior, **not production code to copy directly**. The task is to
**recreate these designs in the app's existing codebase / framework**, using its established
component patterns, state management, and styling approach. If the project has no established
front-end environment yet, choose the most appropriate framework and implement the designs there.

The prototype was built as a "Design Component" (`.dc.html`) that relies on a small runtime
(`support.js`). You do **not** need to keep that runtime — treat the HTML/CSS as a visual spec.
Everything is inline-styled, so all colors, sizes, and spacing are readable directly from the markup.

> Tip: to view the prototype in a browser, open `Japanese Practice UI.dc.html` (it loads
> `support.js` from the same folder). Both screens are stacked vertically on one canvas.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and shadows are all
specified below and present in the markup. Recreate pixel-closely using the codebase's own
component library. The tile-scatter positions and the specific "mid-game" board state are
illustrative — see notes.

---

## Screens / Views

### 1. Home
**Purpose:** Choose Hiragana or Katakana and launch a session, either by random range or by
typing specific characters.

**Layout**
- Full-bleed page background: warm cream `#FBF6EE`.
- Optional browser-chrome frame in the mock (traffic-light dots + URL pill) — **presentation
  only, do not build**.
- Centered content column, max-width ≈ 880px, padding 40–44px.
- Header row (flex, `align-items:center`, `gap:18px`):
  - Mascot blob (left), title block (center-left), streak chip pushed right (`margin-left:auto`).
- Two equal cards in a flex row, `gap:24px`, each `flex:1`.

**Components**
- **Mascot** — a coral blob, 66×60px, `border-radius:52% 48% 50% 50% / 60% 60% 40% 40%`,
  background `#FF7A6B`, shadow `0 10px 22px rgba(255,122,107,.4)`. Two dark eyes
  (`#2E2A26`, 9×11px, 50% radius) and two pink cheeks (`#FFC7BF`, 12×6px). Gentle float
  animation (see Interactions).
- **Title** — "Japanese Practice", Fredoka 700, 34px, `#2E2A26`.
  Subtitle "Master hiragana & katakana, one character at a time", 16px, `#9C9184`.
- **Streak chip** — white pill, `padding:8px 14px`, `border-radius:999px`,
  shadow `0 6px 16px rgba(120,90,60,.10)`; amber dot `#FFC24B` (10px) + "Day 5"
  (Fredoka 600, 15px, `#2E2A26`).
- **Hiragana card** (accent = coral) / **Katakana card** (accent = teal):
  - Card: white, `border-radius:26px`, `padding:26px`, shadow `0 18px 38px rgba(120,90,60,.12)`.
  - Icon chip: 62×62px, `border-radius:20px`. Hiragana bg `#FFE7E2` / glyph `あ` `#FF7A6B`.
    Katakana bg `#D6F3EF` / glyph `ア` `#23B5A6`. Glyph is Zen Maru Gothic 900, 34px.
  - Card title (Fredoka 600, 21px, `#2E2A26`) + "46 basic characters" (14px, `#A89E90`).
  - Field group ×2: uppercase label (700, 13px, `#9C9184`, letter "RANDOM RANGE" / "SPECIFIC
    CHARACTERS"), then a row (`gap:10px`) of:
    - Input: `flex:1`, bg `#FBF6EE`, `border-radius:14px`, `padding:13px 16px`, 16px text.
      Random field shows `1 – 46`; specific field placeholder `e.g. あいうえお` / `アイウエオ`
      in `#C4BAAC`.
    - **Start** button, `border-radius:14px`, `padding:0 22px`, Fredoka 600, 16px.
      Primary (Random): solid accent (`#FF7A6B` / `#23B5A6`), white text, colored shadow.
      Secondary (Specific): tinted (`#FFE7E2` / `#D6F3EF`), accent-colored text, no shadow.

### 2. Practice — Fill the Chart (drag & drop)
**Purpose:** The learner drags scattered kana tiles from the tray into the correct
row×column position of the gojūon chart. Left = the chart to fill; right = the tile tray.

**Layout**
- Screen background: cream `#FBF6EE`.
- **Practice header** (flex, `gap:16px`, padding `22px 40px 4px`):
  - Back button: 40×40px white rounded-square (`border-radius:14px`), chevron `‹` `#9C9184`,
    shadow `0 4px 12px rgba(120,90,60,.10)`.
  - Center block: title "Fill the chart · Hiragana" (Fredoka 600, 19px, `#2E2A26`); below it a
    progress row — a 12px track (`#EFE7DC`, radius 999) with a coral fill (`#FF7A6B`) at ~66%,
    max-width 320px, and "16 to go" label (Fredoka 600, 14px, `#9C9184`).
  - Mascot (smaller, 52×48px) at right, same style as home.
- **Body** (flex): left **board** (auto width), right **tray** (`flex:1`), separated by a
  vertical dashed divider `1px dashed #E3D5C4` with 34px padding on each side.

**Board (gojūon grid)**
- CSS grid: `grid-template-columns: 24px repeat(5, 54px); gap: 9px;`.
- Column headers: `a i u e o` (Fredoka, 15px, `#C0B5A5`). Row headers down the left:
  `ø k s t n h m y r w` (Fredoka, 13px, `#C0B5A5`). `ø` = the vowel-only (no-consonant) row.
- Each cell is 54×54px, `border-radius:14px`, in one of four states:
  - **Placed** (already correct): white bg, Zen Maru Gothic 700, 26px, `#2E2A26`,
    shadow `0 4px 10px rgba(120,90,60,.10)`.
  - **Highlighted / just-placed**: bg `#FFE7E2`, text `#FF7A6B`, `2px solid #FF7A6B` border,
    pulsing ring animation (see Interactions). Used in the mock for `な` and `る`.
  - **Empty** (awaiting a tile / drop target): bg `rgba(255,122,107,.05)`,
    `2px dashed #E3D5C4`.
  - **None** (cell doesn't exist in the chart, e.g. yi/ye/wu/wi/we): rendered invisible to
    preserve grid alignment.
- **Standalone `ん`**: below the grid, separated by a `1px dashed #E3D5C4` top border — a row
  label `n`, one empty 54px slot, and helper text "the sole standalone kana" (`#B5AA9A`, 13px).

**Tray (scattered tiles)**
- A relative container ~430px tall; tiles absolutely positioned with slight rotations
  (−9° … +10°) and mild overlap to feel like loose, grabbable pieces.
- Section label "TILES" (700, 13px, `#9C9184`).
- Each tile: 58×58px, `border-radius:16px`, Zen Maru Gothic 700, 27px, text `#2E2A26`,
  shadow `0 8px 16px rgba(120,90,60,.14)`, `cursor:grab`.
- Tile background colors are a soft pastel set (assign per-tile, no strict mapping needed):
  `#E4F2C9` `#EFD9F0` `#F3D9F0` `#FBE3C9` `#D6E4FB` `#D6F3EF` `#F7D6E8` `#E7E0FB`
  `#CDEFD8` `#EDE4FB` `#FBD9D2`.
- Mock tray contents (16 tiles): ほ ね く た こ つ そ す と け ん を ひ う む か.

**Board state shown in the mock** (which cells are placed vs empty) — illustrative only; in
the real app this is driven by session progress. For reference, the empty (to-be-filled)
cells match the tray tiles: う / か く け こ / す そ / た つ と / ね / ひ ほ / む / を / ん.

---

## Interactions & Behavior
- **Mascot float**: `@keyframes floaty { 0%,100% translateY(0); 50% translateY(-7px) }`,
  3.4s ease-in-out infinite.
- **Highlighted cell pulse**:
  `@keyframes pulseRing { 0%,100% box-shadow 0 0 0 0 rgba(255,122,107,.35); 50% box-shadow 0 0 0 6px rgba(255,122,107,0) }`,
  1.6s ease-in-out infinite. Apply briefly on a correct placement, then settle to the plain
  "placed" (white) style.
- **Drag & drop** (core mechanic, to be implemented):
  - Tiles are draggable from the tray; drop targets are the empty chart cells (and the `ん` slot).
  - On correct drop: tile snaps into the cell, cell → highlighted-then-placed, progress
    increments, "N to go" decrements.
  - On incorrect drop: reject and return the tile to the tray (suggest a short shake + subtle
    error tint; not in the static mock — designer to confirm exact treatment).
  - `cursor:grab` on idle tiles, `grabbing` while dragging.
- **Start buttons** (home): launch a session for that script — Random uses the range field;
  Specific uses the typed characters.
- **Back button** (practice): return to Home.
- **Hover states** (not in static mock; recommended): buttons darken accent ~6–8% and lift
  1–2px; tiles lift slightly and increase shadow on hover.

## State Management
- **Home**: `randomRange` (e.g. "1–46") and `specificChars` string per script; selected script
  (hiragana | katakana) on Start.
- **Practice session**:
  - `script`, `targetSet` (which kana are in play).
  - `placed` — map of position → kana already correct.
  - `trayTiles` — remaining kana (with a scatter position/rotation each, generated once).
  - `remainingCount` (drives "N to go" and the progress bar %).
  - `lastPlaced` — the cell to show the highlight/pulse on.
  - Win state when `remainingCount === 0`.

## Design Tokens
**Colors**
- Background / surfaces: cream `#FBF6EE`, desk `#F3EEE6`, white `#FFFFFF`, field `#FBF6EE`.
- Ink / text: primary `#2E2A26`, muted `#9C9184`, faint `#A89E90` / `#B5AA9A` / `#C0B5A5`,
  placeholder `#C4BAAC`.
- Hiragana accent (coral): `#FF7A6B`, tint `#FFE7E2`, hover `#E85F4F`.
- Katakana accent (teal): `#23B5A6`, tint `#D6F3EF`.
- Amber (streak): `#FFC24B`. Cheeks: `#FFC7BF`.
- Track: `#EFE7DC`. Dashed borders: `#E3D5C4`.
- Tile pastels: `#E4F2C9 #EFD9F0 #F3D9F0 #FBE3C9 #D6E4FB #D6F3EF #F7D6E8 #E7E0FB #CDEFD8 #EDE4FB #FBD9D2`.

**Typography**
- Display / UI: **Fredoka** (Google Fonts), weights 400–700.
- Japanese kana glyphs: **Zen Maru Gothic** (Google Fonts), weights 500/700/900 (rounded).
- Body / labels: **Nunito Sans**. Small section eyebrows: **Baloo 2**.
- Sizes used: card title 21 / screen title 19–34px; kana glyph 26–34px; labels 13px uppercase;
  body 14–16px.

**Radius**: cards 26px · icon chips 20px · buttons/inputs 14px · tiles 16px · pills 999px.

**Shadows**
- Card: `0 18px 38px rgba(120,90,60,.12)`.
- Frame: `0 30px 60px rgba(120,90,80,.20)`.
- Small: `0 4px 10–12px rgba(120,90,60,.10)`.
- Tile: `0 8px 16px rgba(120,90,60,.14)`.
- Primary button (coral): `0 8px 16px rgba(255,122,107,.35)`; teal: `0 8px 16px rgba(35,181,166,.32)`.

**Spacing**: page padding 40–44px · card padding 26px · common gap 10 / 18 / 24px · grid gap 9px.

## Assets
- **No image assets.** The mascot is pure CSS (rounded div + small child divs). Kana are text.
- **Fonts** are loaded from Google Fonts (Fredoka, Zen Maru Gothic, Nunito Sans, Baloo 2) — swap
  for the codebase's font-loading approach.
- Reference screenshots of the **current** app are included:
  `reference_current_home.jpg`, `reference_current_practice.jpg`.

## Files
- `Japanese Practice UI.dc.html` — the design prototype (both screens). Inline styles = the spec.
- `support.js` — runtime needed only to view the prototype; not part of the deliverable.
- `reference_current_home.jpg` / `reference_current_practice.jpg` — the existing UI, for context.
