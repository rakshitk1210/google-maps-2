# Google Maps UI Design Spec

**Read this before building any iteration.** Every measurement below was taken directly from the reference screenshots in `Google Maps screenshots/` (iPhone captures at 3x, converted to CSS px for our 402×872 phone frame). Previous iterations failed because spacing was cramped, radii were wrong, colors were off, and hierarchy was flat. Follow this spec literally — do not eyeball values.

---

## 0. Non-negotiable rules (why past iterations looked wrong)

1. **Everything interactive is a pill or a circle.** Buttons, chips, search bar, segmented controls, "Exit", "Start", "See all" — all use `border-radius: 999px`. Never use 4/6/8px radius on a button.
2. **One dark-teal filled CTA per view, maximum.** All secondary actions are *tonal* (light cyan) or gray pills. If two filled teal buttons appear on screen, one is wrong.
3. **Floating elements never touch each other or screen edges.** 16px minimum gutter to screen edge, 12px minimum gap between stacked floating controls.
4. **No borders on floating cards/chips.** The single exception is the "Ask Maps" AI chip (blue outline) and outlined text fields.
5. **Circular icon buttons in sheet headers are 48px light-gray (`#F1F3F4`) circles** with 24px near-black icons. Never a bare icon floating in whitespace.
6. **Hairline dividers are 1px `#E8EAED`**, usually inset to align with text, never full-black, never 2px.
7. **Secondary text is always `#5F6368`.** Never mid-gray borders around list rows; rows are separated by whitespace or hairlines only.
8. **Generous vertical rhythm.** Sheets breathe: 20–24px between modules, 16px row padding. If a screen feels dense, it's wrong — Google Maps is airy.
9. **Use Google Sans Flex** (already in `Google_Sans_Flex/`). Titles slightly tight tracking (−0.2px); never bold body text; weight 500 reads as "medium" and is the workhorse.
10. **Shadows are reserved for elements on the map surface** — location puck, gem/place pins, and the car marker. All floating UI chrome (search bar, chips, bottom sheets, nav banners, FABs, cards, toasts) is flat with **no shadow**; separate it with whitespace, the sheet surface, or a scrim instead. Map-pin shadows stay soft — never harsh `0 4px 12px rgba(0,0,0,0.4)`.

---

## 1. Reference viewport

- Phone frame: **402 × 872px**, radius 28 (already in `App.css`).
- Screenshot conversion: iPhone shots are 1179px wide @3x → divide by 3 ≈ our CSS px.
- Status bar zone: top ~54px is transparent overlay territory (time/battery). Map and sheets render underneath it; the search bar starts below it.
- Home indicator zone: bottom ~24px, part of the bottom nav / sheet surface.

---

## 2. Color tokens

Sampled from screenshots; approximate but consistent. Define once (CSS variables or `theme.ts`) and reuse — never inline-hex ad hoc.

### Ink & surfaces
| Token | Value | Use |
|---|---|---|
| `--ink` | `#202124` | Primary text, icons |
| `--ink-secondary` | `#5F6368` | Secondary text, inactive icons |
| `--surface` | `#FFFFFF` | Sheets, cards, search bar, FABs |
| `--surface-dim` | `#F1F3F4` | Gray chips, circular icon buttons, "See all" pill, disabled CTA |
| `--surface-nav` | `#EEF2F6` | Bottom navigation bar background (cool light blue-gray) |
| `--hairline` | `#E8EAED` | 1px dividers |
| `--section-gap` | `#F1F3F4` | 8px-tall gray band separating sheet sections |

### Brand & accents
| Token | Value | Use |
|---|---|---|
| `--teal` | `#0D5C63` | THE primary action color: Start button, directions FAB, selected segment, switches ON, nav banner (see `--teal-banner`) |
| `--teal-banner` | `#0B5156` | Navigation instruction banner (slightly darker) |
| `--cyan-container` | `#C2E7EB` | Tonal buttons/chips: Add stops, Saved, active bottom-nav pill, saved-bookmark circle, "+ Add" |
| `--cyan-container-soft` | `#D3EDF2` | Lighter tonal fills (Invite collaborators, Add places, AI route card) |
| `--on-cyan` | `#073B41` | Text/icons on cyan containers |
| `--blue` | `#1A73E8` | Links, "Your location", Ask Maps chip text/border, blue-dot |
| `--blue-dot` | `#4285F4` | Location puck (with white ring + light-blue cone) |
| `--red` | `#D93025` | Heavy-traffic ETA text, mute icon, traffic segments |
| `--red-container` | `#F9DEDC` | Exit button background (`--red` text on it) |
| `--green` | `#188038` | Normal-traffic ETA, eco leaf, "2 hr 9 min" in AI card |
| `--amber` | `#FBBC04` | Star ratings, report/warning triangle |
| `--route` | `#3A36D9` | Active navigation polyline (vivid indigo-blue) |
| `--route-preview` | `#1A50C9` | Selected route in overview + selected ETA bubble |
| `--route-alt` | `#AEBBF2` | Unselected alternate routes |

### Map canvas (if drawing a fake map)
Land `#F2F3F5` · water `#8ED4F2` · parks/green `#BDE5C8` + campus green paths `#9CCFA9` · roads white with `#D8DBDF` casing · commercial strips `#F6EDD1` · institutional pink `#FADCD9` · map labels `#5B6B79` (streets) / `#7A8A98` (areas, letterspaced uppercase for districts).

---

## 3. Typography (Google Sans Flex)

| Style | Size/weight | Notes |
|---|---|---|
| Sheet title ("You", "Drive", "New list", "Navigation") | 26px / 500 | `--ink`, tracking −0.2 |
| Section heading ("Your recent places", "Getting There & Driving Routes") | 22px / 500 | 4px gap to its subtitle |
| Section subtitle ("From your Maps history and saves") | 16px / 400 | `--ink-secondary` |
| List-detail hero title ("List for roadtrip") | 30px / 500 | |
| Row title ("Langley, WA 98260", "Whidbey Island") | 18px / 500 | `--ink` |
| Row secondary ("Locality", "Recently viewed", "4.8 ★ (930) · Island") | 15px / 400 | `--ink-secondary` |
| Menu row ("Add a report", "Share trip progress") | 20px / 400 | large touch rows |
| Chip / button label | 16px / 500 | |
| Big CTA label ("Start", "Create", "Exit") | 17px / 500 | |
| Bottom nav label | 13px / 500 (active 600) | |
| Overline ("LIST TYPE") | 12px / 500 | uppercase, +0.8 tracking, `--ink-secondary` |
| ETA duration ("2 hr 47 min") | 26px / 600 | `--red` or `--green`, followed by 16px leaf |
| ETA meta ("98 mi · 5:55 PM") | 16px / 400 | `--ink-secondary` |
| Route summary duration ("3h 14m", stacked) | 24px / 500 | two lines, colored by traffic |
| Nav banner road name ("11th Ave NE") | 30px / 500 | white |
| Nav banner "toward" | 20px / 400 | `rgba(255,255,255,0.85)` |
| Search placeholder ("Search here") | 19px / 400 | `#5F6368` |
| Body / AI answer text | 18px / 400, line-height 1.45 | |

Search bar placeholder is noticeably large (19px) — a common mistake is making it 14px.

---

## 4. Shape & elevation

| Token | Value |
|---|---|
| Pill (all buttons/chips/search) | `border-radius: 999px` |
| Sheet top corners | 28px |
| Floating cards (top directions card, nav banner) | 24px |
| Directions FAB (rounded square) | 20px |
| Thumbnails 64px | 16px; thumbnails 56px → 12px |
| Segmented control track | 16px outer / selected segment 14px |
| Outlined text fields | 16px |
| Route ETA bubbles | 12px |

Shadows (see rule 0.10 — **map pins only**; floating UI chrome is flat):
```css
--shadow-pin: 0 1px 2px rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15); /* map markers/pins only */
/* Floating UI chrome (search bar, chips, sheets, banners, FABs, cards, toasts) uses no shadow. */
```

Icons: Material Symbols Rounded, 24px default (22px inside chips), weight ~500, `--ink` unless stated. Active/selected states use the *filled* variant.

---

## 5. Global layout anatomy

Every screen is three layers:
1. **Map canvas** — full-bleed, edge to edge, under the status bar.
2. **Floating layer** — search bar, chips, FABs. 16px side gutters. Individual white elements with `--shadow-float`; never grouped in a container.
3. **Sheet layer** — white bottom sheet, radius 28 top corners, drag handle, snap points (peek ≈ 45%, full ≈ 94% leaving a strip of map visible at top).

**Drag handle:** 40 × 4px, `#C4C7C5`, radius 2, centered, 8px from sheet top, 8px below it before content.

---

## 6. Component specs

### 6.1 Search bar (home)
- Position: 16px side margins, top ≈ 62px (just under status bar).
- White pill, **height 56px**, `--shadow-float`.
- Content: 16px left padding → multicolor Google Maps pin (26px) → 14px gap → placeholder 19px → right cluster: mic (24px), camera/Lens (24px) with 22px gap between icons → avatar 36px circle → 10px right padding.

### 6.2 Chip row (below search)
- 12px below search bar, horizontally scrolling, 16px leading inset, **8px gap** between chips.
- Chip: white pill, **height 44px**, padding 16px sides, icon 22px + 8px gap + label 16px/500, `--shadow-float`.
- **Ask Maps chip** (always first): white fill, **1.5px `--blue` border**, blue sparkle icon, blue label.

### 6.3 Map FABs (right edge, home)
- All 16px from right edge.
- Layers: 48px white circle, below chip row (12px gap).
- Locate/compass: **56px** white circle, sits above the directions FAB.
- Directions FAB: **64px rounded square (radius 20)**, `--teal` fill, white directions icon 26px. 12px gap above bottom nav / above locate button.
- Google Maps wordmark bottom-left of the map, 16px inset.

### 6.4 Bottom navigation
- Height **84px** (60px content + 24px home-indicator zone), background `--surface-nav`, no top border (subtle contrast is enough).
- 3 tabs equally spread: Explore (pin), You (bookmark), Contribute (⊕).
- Active tab: **64×32px pill** in `--cyan-container` behind a 24px filled `--teal` icon; label below 4px gap, 13px/600 `--ink`.
- Inactive: 24px outlined `--ink` icon (no pill), label 13px/500 `--ink-secondary`.

### 6.5 Bottom sheet header pattern
- Content gutter inside sheets: **20px** both sides.
- Title row: title left, circular buttons right. Circular buttons: **44–48px `#F1F3F4` circles**, 24px `--ink` icons, **8px gap** between multiple (e.g. list detail: `…`, share, `✕`).
- Title row top padding: 12px below drag handle.

### 6.6 List rows (places — You sheet, suggestions)
```
[thumb 64×64 r16] –16px– [title 18/500
                          subtitle 15 gray
                          meta line 15 gray]  …spacer… [44px cyan circle w/ bookmark] –12px– [24px ⋯]
```
- Row vertical padding **14px**; rows separated by whitespace (recent places) or inset hairlines starting at text edge (suggested places).
- Ratings line: value 15px, 2px gap, 14px amber star, `(count)` and `· Category` in gray.
- Suggested-places variant: 56×56 r12 thumb, trailing **"+ Add" pill**: `--cyan-container`, height 44px, padding 20px, label 16/500 `--on-cyan`.

### 6.7 Buttons
| Kind | Spec |
|---|---|
| Filled (Start, Create enabled) | `--teal` bg, white 17/500 label, **height 48px** (56px for full-width Create), padding 24px, optional 20px leading icon |
| Tonal (Add stops, Saved, Invite collaborators, + Add places, New list) | `--cyan-container(-soft)` bg, `--on-cyan` label, height 44–48px, padding 20px, leading icon 20px |
| Gray (See all) | `--surface-dim` bg, `--ink` 17/500, full-width, height 52px, centered label + chevron |
| Destructive tonal (Exit) | `--red-container` bg, `--red` 17/500, height 52px, padding 24px |
| Disabled | `#E4E6E8` bg, `#9AA0A6` label |

### 6.8 Full-screen form (New list)
- White full screen. Title 26px at 20px gutter; 48px close circle right.
- Icon picker centered: 96px rounded-square (r24) map illustration + 64px white circle overlay w/ teal icon; "Choose icon" 18px below, 12px gap.
- Text fields: outlined **1px `#DADCE0`**, radius 16, **height 56px**, placeholder 18px gray, 20px side margins. Field groups separated by full-width hairlines with ~24px padding above/below.
- Radio group: overline "LIST TYPE" → option rows: title 20px (`--teal` when selected), description 16px gray (wraps), trailing 24px teal check. ~20px vertical padding per option, hairline between.
- Bottom CTA pinned: full-width pill, 20px margins, 16px above home indicator.

### 6.9 Directions card (route overview, top of screen)
- White card, radius 24, 12px side margins, top ≈ 58px, `--shadow-float`, internal padding 16px.
- Rows height 52px: leading icon column 28px wide (blue dot ⌾ / red pin), 16px gap, field text 19px (origin = `--blue`, destination = `--ink`), trailing `⋯` (row 1) / swap ↕ (last row) 24px gray.
- Between rows: vertical 3-dot rail under the icon column + **hairline starting after icon column** (inset ~44px).

### 6.10 Travel-mode tabs (Drive sheet)
- Row height 52px under sheet title, full-width hairline below.
- Each tab: 22px mode icon + 6px + time label 16/500. Active: `--teal` icon+label, **3px teal underline bar (radius 3, width of content)**. Inactive gray, time "—" if unavailable.

### 6.11 Route summary block (Drive sheet)
- Applied filter chip row ("✓ Avoid tolls"): gray `#E9ECEF` rounded-rect (radius 10), height 38px, 16px check + 15/500 label.
- Summary row (16px top): left column duration stacked ("3h" / "14m") 24/500 colored by traffic (green normal, red heavy); right column: "Arrive 8:41 PM · Fastest route…" 17px `--ink` (wraps 2 lines), meta line: "125 mi (2 stops)" 17px + icon glyphs (toll ⓘ, green leaf "Saves 12% gas", blue HOV diamond) 15px gray.
- CTA row 16px below: `[▲ Start]` filled + `[Add stops]` tonal + `[Saved]` tonal, 12px gaps, left-aligned.

### 6.12 Route polylines & bubbles (overview map)
- Selected route: 8px `--route-preview` stroke with 2px darker casing; traffic segments recolor the stroke (red/orange). Alternates: `--route-alt`.
- ETA bubble (selected): `--route-preview` fill, white 17/600 text + leaf, radius 12, pointer nub toward route.
- ETA bubble (alt): white, `--ink` text, radius 12, `--shadow-card`.
- Traffic incident callouts: white pill, 24px red circular badge + 16/500 label.
- Origin: blue dot puck. Destination: red pin (28px) + small ⌾ ring at exact point.

### 6.13 Active navigation
- **Instruction banner:** `--teal-banner`, radius 24, 12px side margins, top 58px. Padding 20px. Left: 40px white maneuver arrow. Right: "toward" 20px dim white + road name 30px white, baseline-aligned on one line (wraps if long).
- **"Then" chip:** attached below banner's left corner (overlapping −4px), darker teal `#093F44`, radius 20 (square top-left corner where it meets banner), height 56px, padding 16px: "Then" 18px white + 24px white arrow icon.
- **Right rail** (floating, 16px from edge, 12px gaps, starting ~40% down): 56px white circles — compass (red/white needle), search, mute (red icon when muted), route-overview, report (amber triangle). All `--shadow-float`.
- **Re-center pill** bottom-left above bottom bar: white pill height 48px, `--teal` arrow icon + "Re-center" 17/500 `--teal`.
- **Bottom bar:** white sheet (radius 28 top) with drag handle; content row 20px padding: left 56px circle (white, hairline border, blue Gemini spark 26px) · center: ETA 26/600 colored + leaf, under it "98 mi · 5:55 PM" 16px gray, both centered · right: Exit pill (spec 6.7).
- Nav route: `--route` 10px stroke, white chevron car marker. Map tilts (perspective), but for our clone a top-down map with slightly lighter/desaturated colors is fine.

### 6.14 Nav overflow menu (swipe up on bottom bar)
- Same sheet continues: ETA row (Gemini circle · ETA · Exit) then menu rows.
- Menu row: **height 76px**, 20px gutter: 24px `--ink` icon → 20px gap → 20px/400 label. Hairline dividers **inset to label start (~64px)**.
- Rows: Add a report, Share trip progress, Search along route, Preview route, Directions, Driving avatar, Settings.

### 6.15 Settings screen (full white)
- Title 26px + close circle. Section headings 22/500 with 28px top spacing.
- Sub-labels ("Color scheme", "Guidance volume") 19/400, 12px below heading.
- **Segmented control:** full-width, height 52px, track `#EBECED` radius 16; selected segment `--teal` white 18/500 label radius 14; unselected labels 18/400 `--ink`; 1px `#D5D7D9` vertical separators between unselected neighbors.
- **Switch (M3):** track 52×32 r16 — ON: `--teal` track, white 24px thumb right; OFF: `#E1E3E5` track w/ 1px gray border, gray-white 16px thumb left.
- Toggle rows: label 19/400 left (wraps), switch right, ~20px vertical padding.
- Full-width hairlines between sections, 24px breathing room each side.

### 6.16 Ask Maps (AI) sheet
- Sheet header: blue sparkle 26px + "Ask Maps" 24/500 + right circles (history, new-chat, ✕).
- User message: right-aligned bubble `#EDF2F4` (cool light gray), radius 24, padding 16×20, 18px text, max-width ~75%. Timestamp 14px gray right-aligned below.
- AI answer: plain 18px/1.45 text, no bubble, full gutter width. Inline place links: dotted underline + leading pin icon. Bold section headings 24/600 with 20px top margin.
- **Route card inside answer:** `--cyan-container-soft`… actually pale blue-gray `#E9F1F2`, radius 16, padding 16: car icon + "2 hr 9 min" 20/500 `--green`; below: origin→destination 17px `--ink`; "via …" 17px gray; trailing 40px `--cyan-container` circle with `--teal` directions icon.
- Input bar pinned bottom: gray `#F1F3F4` pill, height 56px, "Ask a question" 18px gray, mic 24px right, 16px margins.

---

## 7. Screen blueprints (assemble from components above)

**Home/Explore:** map full-bleed → search bar (6.1) → chips (6.2) → layers FAB → [content] → locate + directions FABs bottom-right stacked above bottom nav (6.4).

**You sheet over map:** sheet at ~45% or full → header "You" + bell circle → section "Your recent places" + subtitle → filter chips row (search icon 24px + gray dropdown chips h44, 8px gaps) → 3 place rows (6.6) → "See all" gray pill → "Your lists" heading + "+ New list" tonal pill on same row → list rows (emoji 40px circle bg `#F8F9FA`, title 18, "Private list · 2 places" 15 gray, `⋯`) with hairlines.

**Route overview:** directions card top (6.9) → map with routes/bubbles (6.12) → layers + locate FABs right → Drive sheet: title row (tune/share/✕ circles) → mode tabs (6.10) → filter chip → summary (6.11) → CTAs.

**Active nav:** banner + Then chip (6.13) → right rail → re-center → bottom bar. Swipe up → menu (6.14).

---

## 8. Motion

- Sheet transitions: 300ms `cubic-bezier(0.2, 0, 0, 1)` (M3 emphasized). Snap between peek/full; content scrolls only at full.
- Button/chip press: opacity ripple or scale 0.97, 120ms.
- Sheet open pushes nothing — it overlays; bottom nav stays fixed and above the sheet on Explore/You tabs.
- Screens like New list and Settings are full-screen slide-up modals (240ms), not sheets.

---

## 9. Pre-ship checklist

- [ ] Only one `--teal` filled button visible per screen
- [ ] All pills actually pill-shaped (radius 999), sheets radius 28
- [ ] 16px map gutters, 20px sheet gutters, nothing touching edges
- [ ] Search bar 56px tall with 19px placeholder and 36px avatar
- [ ] Bottom nav 84px, active tab has cyan pill behind filled icon
- [ ] Hairlines 1px `#E8EAED`, inset where the spec says
- [ ] Secondary text `#5F6368`, primary `#202124` — no pure black, no `#999`
- [ ] Shadows only on map pins (soft); all floating UI chrome is flat
- [ ] Google Sans Flex loaded and applied, tracking tight on titles
- [ ] Icon buttons in headers are gray circles, not bare glyphs
- [ ] Compare side-by-side against the screenshot for that screen before calling it done
