---
name: web-deck
description: "Build CoinFund-branded web presentations as self-contained HTML files. Supports static (print/PDF) and dynamic (keyboard nav, transitions) modes. Outputs a single versionable HTML file with optional PDF export via Puppeteer. Trigger on: 'web deck', 'web slides', 'html presentation', 'web presentation', or any request for a browser-based slide deck."
---

# Web Deck — CoinFund Web Presentation Builder

Build minimalist, CoinFund-branded slide decks as self-contained HTML files. Each deck is a single `.html` file — no build step, no dependencies, trivially versionable in Git.

## When to Use

Any time the user wants a **web-based** slide deck (HTML/CSS/JS). For `.pptx` output, use the `jake-deck` skill instead. This skill is for browser-native presentations that can also export to PDF.

The user specifies:
1. **Mode**: `static` (print-optimized, no JS) or `dynamic` (keyboard navigation, slide transitions). Default: `dynamic`.
2. **Content**: Slide titles and content, as an outline or bullet points.

## Design System

### Color Palette (CSS Custom Properties)

```css
:root {
  --bg:      #F7F3EE;  /* Warm cream — all slide backgrounds        */
  --text:    #1A1A1A;  /* Near-black — headings, primary body text   */
  --gray:    #7A7A7A;  /* Secondary text, labels                     */
  --ltgray:  #C8C2BA;  /* Divider rules, subtle borders              */
  --white:   #FFFFFF;  /* Title slide background, table headers      */
  --red:     #C0392B;  /* Warnings, risks, negative indicators       */
  --green:   #27AE60;  /* Positive indicators, "ready" status        */
  --blue:    #2C3E50;  /* Section headers, callout boxes             */
}
```

### Typography

All text uses **Nunito** (loaded from Google Fonts, with system-font fallback for offline use).

| Element          | Size   | Weight | Color      |
|------------------|--------|--------|------------|
| Slide title      | 28px   | 700    | `--blue`   |
| Section header   | 16px   | 700    | `--text`   |
| Body text        | 13px   | 400    | `--text`   |
| Labels/secondary | 11px   | 400    | `--gray`   |
| Footnotes        | 10-11px| 400    | `--red` or `--gray` |

### Layout

Slides are **16:9** aspect ratio (960px x 540px base, scaled to fill viewport).

```
┌──────────────────────────────────────────────┐
│  padding-left: 76px (~0.8" equivalent)       │
│  ┌─ Title zone: top 50px ──────────────────┐ │
│  │                                          │ │
│  ├─ Content zone: top 110px ───────────────┤ │
│  │  width: 808px (~8.4" equivalent)        │ │
│  │                                          │ │
│  ├─ Footnote zone: bottom 30px ────────────┤ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## Required Slides

### Title Slide (always first)

- Background: `--white` (#FFFFFF), not cream
- CoinFund logo: the PNG logo image (base64-embedded), 240px wide, centered
- Thin divider line below logo: 240px wide, `--text`, centered
- Deck title: 28px Nunito bold, color `--blue`, centered below divider (sentence case)
- Subtitle/date: 14px Nunito, color `--gray`, centered

```html
<section class="slide slide--title">
  <img class="slide__logo" src="data:image/png;base64,..." alt="CoinFund">
  <hr class="slide__divider slide__divider--title">
  <h1 class="slide__deck-title">Deck title here</h1>
  <p class="slide__subtitle">March 2026</p>
</section>
```

### End Slide (always last)

- Background: `--bg` (cream)
- CoinFund logo image, 180px wide, centered
- Gray divider rule centered
- "coinfund.io" in 13px Nunito, color `--gray`, centered

```html
<section class="slide slide--end">
  <img class="slide__logo slide__logo--end" src="data:image/png;base64,..." alt="CoinFund">
  <hr class="slide__divider slide__divider--end">
  <p class="slide__end-url">coinfund.io</p>
</section>
```

## Content Slide Patterns

Every content slide follows this HTML structure:

```html
<section class="slide">
  <h2 class="slide__title">Slide title</h2>
  <hr class="slide__accent">
  <div class="slide__body">
    <!-- Content using one of the patterns below -->
  </div>
  <!-- Optional: corner logo for branding -->
  <img class="slide__corner-logo" src="data:image/png;base64,..." alt="CoinFund">
  <!-- Optional footnote -->
  <footer class="slide__footnote">Footnote text</footer>
</section>
```

### Pattern 1: Header + Body Blocks (default, most common)

For slides with 3-5 topics, each with bold header and description.

```html
<div class="block">
  <div class="block__header">Bold header text</div>
  <div class="block__body">Gray body description text.</div>
</div>
<!-- Repeat for each block. Max 4-5 per slide. -->
```

### Pattern 2: Label-Value Grid

Two-column layout: gray labels left, text values right.

```html
<div class="kv-grid">
  <div class="kv-grid__row">
    <span class="kv-grid__label">Label</span>
    <span class="kv-grid__value">Value text here</span>
  </div>
  <!-- Max 6 rows per slide -->
</div>
```

### Pattern 3: Table

Blue header row with white text, alternating cream/white body rows.

```html
<table class="deck-table">
  <thead>
    <tr><th>Column A</th><th>Column B</th><th>Column C</th></tr>
  </thead>
  <tbody>
    <tr><td>Data</td><td>Data</td><td>Data</td></tr>
    <tr><td>Data</td><td>Data</td><td>Data</td></tr>
  </tbody>
</table>
```

### Pattern 4: Numbered List

Blue number + bold label + body inline.

```html
<ol class="numbered-list">
  <li>
    <span class="numbered-list__label">Item name</span>
    <span class="numbered-list__desc">Description text explaining the item.</span>
  </li>
</ol>
```

### Pattern 5: Callout Box

Light blue-gray fill with left border accent.

```html
<div class="callout">
  <p>Key insight or important note goes here.</p>
</div>
```

## Entrance Animations

In dynamic mode, add `class="reveal"` to any element that should animate in when its slide becomes active. Elements fade up with staggered timing based on their position among siblings.

```html
<section class="slide">
  <h2 class="slide__title reveal">Title animates first</h2>
  <!-- Corner logo on content slides -->
  <img class="slide__corner-logo" src="data:image/png;base64,..." alt="CoinFund">
  <hr class="slide__accent reveal">
  <div class="slide__body">
    <div class="block reveal">This block animates third</div>
    <div class="block reveal">This one fourth (0.08s delay)</div>
  </div>
</section>
```

In static mode, `reveal` has no effect — elements render normally.

## Static vs. Dynamic Mode

### Static Mode (`data-mode="static"`)

- No JavaScript whatsoever
- All slides visible in sequence, separated by CSS page breaks
- Optimized for `Cmd+P` / `Ctrl+P` browser print or Puppeteer PDF export
- Each `<section class="slide">` gets `page-break-after: always`

### Dynamic Mode (`data-mode="dynamic"`)

- Keyboard navigation: Arrow keys, Space, Page Up/Down
- Touch/swipe navigation on mobile and tablet
- Current slide indicator (e.g., "3 / 12") in bottom-right
- Blue progress bar at top of viewport
- Subtle fade transitions between slides (CSS `opacity` + `transition`)
- Staggered entrance animations on `.reveal` elements
- URL hash updates per slide (`#slide-3`) for deep linking
- Press `F` for fullscreen, `Esc` to exit
- Press `P` to toggle overview mode (shows all slides, click to jump)
- `prefers-reduced-motion` automatically disables animations

## HTML Boilerplate

Every generated deck starts with this structure. Fill in the mode, title, and slides.

```html
<!DOCTYPE html>
<html lang="en" data-mode="dynamic">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DECK_TITLE_HERE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── CoinFund Design Tokens ── */
:root {
  --bg:      #F7F3EE;
  --text:    #1A1A1A;
  --gray:    #7A7A7A;
  --ltgray:  #C8C2BA;
  --white:   #FFFFFF;
  --red:     #C0392B;
  --green:   #27AE60;
  --blue:    #2C3E50;
  --font:    'Nunito', 'Segoe UI', system-ui, sans-serif;
  --slide-w: 960px;
  --slide-h: 540px;
}

body {
  font-family: var(--font);
  background: #E8E4DF;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

/* ── Slide Shell ── */
.slide {
  width: var(--slide-w);
  height: var(--slide-h);
  background: var(--bg);
  position: relative;
  padding: 50px 76px 30px;
  overflow: hidden;
}

/* ── Title Slide ── */
.slide--title {
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 76px;
}
.slide__logo {
  width: 240px;
  height: auto;
}
.slide__logo--end {
  width: 180px;
}
/* Content slide corner logo */
.slide__corner-logo {
  position: absolute;
  bottom: 20px;
  right: 30px;
  width: 80px;
  height: auto;
  opacity: 0.5;
}
.slide__divider--title {
  border: none;
  border-top: 1.5px solid var(--text);
  width: 240px;
  margin: 18px auto;
}
.slide__deck-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 8px;
}
.slide__subtitle {
  font-size: 14px;
  color: var(--gray);
}

/* ── End Slide ── */
.slide--end {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 76px;
}
/* End slide logo uses .slide__logo--end for sizing */
.slide__divider--end {
  border: none;
  border-top: 1px solid var(--ltgray);
  width: 180px;
  margin: 14px auto;
}
.slide__end-url {
  font-size: 13px;
  color: var(--gray);
}

/* ── Content Slide Elements ── */
.slide__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--blue);
  line-height: 1.2;
  margin: 0;
}
.slide__accent {
  border: none;
  border-top: 1px solid var(--ltgray);
  width: 144px;
  margin: 10px 0 16px;
}
.slide__body {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text);
}
.slide__footnote {
  position: absolute;
  bottom: 20px;
  left: 76px;
  right: 76px;
  font-size: 10px;
  color: var(--gray);
}
.slide__footnote--warning { color: var(--red); }

/* ── Pattern 1: Header + Body Blocks ── */
.block + .block { margin-top: 14px; }
.block__header { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.block__body   { font-size: 13px; color: var(--gray); }

/* ── Pattern 2: Label-Value Grid ── */
.kv-grid__row { display: flex; gap: 20px; padding: 6px 0; border-bottom: 1px solid var(--ltgray); }
.kv-grid__row:last-child { border-bottom: none; }
.kv-grid__label { flex: 0 0 200px; font-size: 12px; font-weight: 700; color: var(--gray); }
.kv-grid__value { flex: 1; font-size: 12px; color: var(--text); }

/* ── Pattern 3: Table ── */
.deck-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.deck-table th {
  background: var(--blue); color: var(--white); font-weight: 700;
  padding: 8px 10px; text-align: left;
}
.deck-table td { padding: 7px 10px; border-bottom: 1px solid var(--ltgray); }
.deck-table tbody tr:nth-child(odd) { background: #EDEBE7; }
.deck-table tbody tr:nth-child(even) { background: var(--bg); }

/* ── Pattern 4: Numbered List ── */
.numbered-list { list-style: none; counter-reset: item; }
.numbered-list li { counter-increment: item; display: flex; gap: 10px; padding: 6px 0; align-items: baseline; }
.numbered-list li::before {
  content: counter(item) ".";
  font-size: 14px; font-weight: 700; color: var(--blue); flex-shrink: 0; min-width: 24px;
}
.numbered-list__label { font-size: 13px; font-weight: 700; color: var(--text); }
.numbered-list__desc  { font-size: 12px; color: var(--gray); }

/* ── Pattern 5: Callout Box ── */
.callout {
  background: #E8EDF2;
  border-left: 4px solid var(--blue);
  padding: 14px 18px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 2px;
}

/* ── Semantic Colors ── */
.text-red   { color: var(--red); }
.text-green { color: var(--green); }
.text-blue  { color: var(--blue); }
.text-gray  { color: var(--gray); }

/* ── Entrance Animations (dynamic mode) ── */
[data-mode="dynamic"] .reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-mode="dynamic"] .slide.active .reveal {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger children for sequential reveal */
[data-mode="dynamic"] .slide.active .reveal:nth-child(2) { transition-delay: 0.08s; }
[data-mode="dynamic"] .slide.active .reveal:nth-child(3) { transition-delay: 0.16s; }
[data-mode="dynamic"] .slide.active .reveal:nth-child(4) { transition-delay: 0.24s; }
[data-mode="dynamic"] .slide.active .reveal:nth-child(5) { transition-delay: 0.32s; }
[data-mode="dynamic"] .slide.active .reveal:nth-child(6) { transition-delay: 0.40s; }

/* ── Progress Bar ── */
.deck-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: var(--blue);
  transition: width 0.3s ease;
  z-index: 101;
}

/* ── Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.15s !important;
  }
}

/* ══════════════════════════════════════════════
   STATIC MODE — all slides visible, print-ready
   ══════════════════════════════════════════════ */
[data-mode="static"] .slide {
  margin: 20px auto;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
[data-mode="static"] .deck-nav { display: none; }

@media print {
  body { background: white; }
  .slide {
    margin: 0; box-shadow: none;
    page-break-after: always;
    page-break-inside: avoid;
  }
  .slide:last-child { page-break-after: avoid; }
  .deck-nav { display: none !important; }
}

/* ══════════════════════════════════════════════
   DYNAMIC MODE — one slide at a time
   ══════════════════════════════════════════════ */
[data-mode="dynamic"] body,
[data-mode="dynamic"] { overflow: hidden; }

[data-mode="dynamic"] .slide {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(var(--scale, 1));
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
}
[data-mode="dynamic"] .slide.active {
  opacity: 1;
  pointer-events: auto;
}

/* Overview mode (press P) */
[data-mode="dynamic"].overview .slide {
  position: relative !important;
  transform: none !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  margin: 20px auto;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
[data-mode="dynamic"].overview .slide:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}

.deck-nav {
  position: fixed;
  bottom: 16px; right: 24px;
  font-family: var(--font);
  font-size: 12px;
  color: var(--gray);
  z-index: 100;
  user-select: none;
}
</style>
</head>
<body>

<div class="deck-progress" id="deck-progress"></div>

<!-- ═══════════ TITLE SLIDE ═══════════ -->
<section class="slide slide--title">
  <img class="slide__logo reveal" src="data:image/png;base64,..." alt="CoinFund">
  <hr class="slide__divider slide__divider--title reveal">
  <h1 class="slide__deck-title reveal">DECK_TITLE_HERE</h1>
  <p class="slide__subtitle reveal">MONTH YEAR</p>
</section>

<!-- ═══════════ CONTENT SLIDES ═══════════ -->
<!-- Add slides here. Use class="reveal" on elements for entrance animations. -->
<!-- Include <img class="slide__corner-logo" src="data:image/png;base64,..." alt="CoinFund"> in content slides for subtle branding -->

<!-- ═══════════ END SLIDE ═══════════ -->
<section class="slide slide--end">
  <img class="slide__logo slide__logo--end reveal" src="data:image/png;base64,..." alt="CoinFund">
  <hr class="slide__divider slide__divider--end reveal">
  <p class="slide__end-url reveal">coinfund.io</p>
</section>

<div class="deck-nav"><span id="nav-current"></span> / <span id="nav-total"></span></div>

<script>
(function() {
  const html = document.documentElement;
  if (html.dataset.mode !== 'dynamic') return;

  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;
  let overview = false;

  const navCurrent = document.getElementById('nav-current');
  const navTotal = document.getElementById('nav-total');
  const progressBar = document.getElementById('deck-progress');
  navTotal.textContent = total;

  function scaleSlides() {
    const sw = 960, sh = 540;
    const scale = Math.min(window.innerWidth / sw, window.innerHeight / sh);
    html.style.setProperty('--scale', scale);
  }

  function resetReveals(slide) {
    slide.querySelectorAll('.reveal').forEach(el => {
      el.style.transitionDelay = '';
    });
  }

  function go(n) {
    if (overview) return;
    const prev = current;
    current = Math.max(0, Math.min(total - 1, n));
    slides.forEach((s, i) => {
      const wasActive = s.classList.contains('active');
      s.classList.toggle('active', i === current);
      if (wasActive && i !== current) resetReveals(s);
    });
    navCurrent.textContent = current + 1;
    progressBar.style.width = ((current + 1) / total * 100) + '%';
    history.replaceState(null, '', '#slide-' + (current + 1));
  }

  function toggleOverview() {
    overview = !overview;
    html.classList.toggle('overview', overview);
    document.querySelector('.deck-nav').style.display = overview ? 'none' : '';
    progressBar.style.display = overview ? 'none' : '';
    if (!overview) go(current);
  }

  // Keyboard navigation
  window.addEventListener('keydown', e => {
    if (overview && e.key !== 'p' && e.key !== 'P' && e.key !== 'Escape') {
      return;
    }
    switch(e.key) {
      case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
        e.preventDefault(); go(current + 1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); go(current - 1); break;
      case 'Home': go(0); break;
      case 'End': go(total - 1); break;
      case 'f': case 'F':
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
        break;
      case 'p': case 'P': toggleOverview(); break;
      case 'Escape':
        if (overview) toggleOverview();
        break;
    }
  });

  // Touch/swipe navigation
  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? go(current + 1) : go(current - 1);
    } else {
      dy < 0 ? go(current + 1) : go(current - 1);
    }
  }, { passive: true });

  // Click navigation in overview
  document.addEventListener('click', e => {
    if (!overview) return;
    const slide = e.target.closest('.slide');
    if (slide) {
      current = slides.indexOf(slide);
      toggleOverview();
    }
  });

  // Hash-based deep linking
  const hash = parseInt(location.hash.replace('#slide-', ''), 10);
  scaleSlides();
  window.addEventListener('resize', scaleSlides);
  go(isNaN(hash) ? 0 : hash - 1);
})();
</script>
</body>
</html>
```

**Important:** The boilerplate above is a complete, working HTML file. Copy it exactly as the starting point for every deck, then add content slides between the title and end slides.

## Live Development Server

The skill includes a bundled dev server at `serve-deck.mjs` (in the same directory as this SKILL.md). It provides live reload, an overlay menu, and PDF export — zero npm dependencies (Puppeteer only needed for PDF).

### Starting the server

The server takes a port and the directory containing the deck HTML file:

```bash
node /path/to/skills/web-deck/serve-deck.mjs 3333 /path/to/deck/directory
```

Then open the browser:
```bash
open http://localhost:3333/deck.html
```

For PDF export support, install Puppeteer once in the deck directory:
```bash
npm install puppeteer
```

### What the server provides

1. **Live reload** — SSE-based, auto-reloads the browser on every file save
2. **Overlay menu** — subtle hamburger icon (top-right, fades in on hover) with:
   - **Download as PDF** — renders via Puppeteer server-side, streams as a download
   - **Cmd+P hint** — reminder that browser print also works
3. **Static file serving** — serves the deck and any local assets (images, fonts)

The overlay menu and reload client are injected at serve time — they do not exist in the `deck.html` file itself. The deck stays clean and self-contained.

### Workflow

1. User provides outline (slide titles + content bullets) and mode preference (static/dynamic)
2. Start from the HTML boilerplate above
3. Choose the right content pattern for each slide
4. Write the complete HTML file as `deck.html` (or user-specified name)
5. **Start the server** (background, one time): `node <skill-dir>/serve-deck.mjs 3333 .`
6. **Open in browser** (one time): `open http://localhost:3333/deck.html`
7. **Iterate** — use the Edit tool to modify slides. Changes appear in the browser instantly.
8. Download PDF from the overlay menu when ready.

### Important: keep the server running

- Start the server with `run_in_background: true` so it persists across edits
- The second argument is the directory to serve (defaults to `.`)
- When the session ends or user is done, kill the server: `pkill -f serve-deck` or let it die naturally

## Style Principles

The CoinFund deck style is defined by restraint:

1. **No gradients, drop shadows, or decorative elements.** The CSS `box-shadow` on slides is only for the browser viewport framing, not part of the slide content itself.
2. **Color is semantic.** Blue for structure, red for risk/warnings, green for readiness/positive. Never decorative.
3. **Whitespace does the heavy lifting.** Generous padding, clear spacing between blocks. If it feels crowded, split into two slides.
4. **Max 4-5 content blocks per slide.** Prevents overflow and keeps slides scannable.
5. **Footnotes sit below main content** with a clear gap. Use `slide__footnote` positioned at the bottom.
6. **One accent line per slide.** The short `slide__accent` `<hr>` separates title from content. That's the only decoration.
7. **Terse over verbose.** Bullets should be 1-2 sentences max. The deck is a conversation starter, not a whitepaper.
8. **Sentence case for all titles.** Slide titles, section headers, and the deck title itself use sentence case (capitalize only the first word and proper nouns). Example: "Key market dynamics" not "Key Market Dynamics".
9. **Use the CoinFund logo image where possible.** Instead of text-only wordmarks, embed the CoinFund logo as an `<img>` using the base64 data URI below. Use it on the title slide, end slide, and as a subtle branding element on content slides (e.g., small logo in a corner). The logo is transparent-background black text, so it works on both white and cream backgrounds.

### CoinFund Logo (base64 PNG, 400px wide, transparent background)

Embed this in any `<img>` tag. The file is also available at `coinfund-logo.png` in the skill directory for reference.

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADvCAYAAADcvIJsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAGQoAMABAAAAAEAAADvAAAAAKvvy3cAAAHNaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj40NzcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjI4NjA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KZWGhCwAALQxJREFUeAHtnQmcXWV99zOZZMhk35fJnkwQkkAIRKBqSFKJa1ErthUVl9pa2lKr1Vppa8X3xVqX17fWVi0fF5BFQUF7UZBFbEVbQbFoIBAEDAQasksgZM9A9knS+e58J73HOeeec+feuedOfs/n89xz7rM/32f5P9s5p1cvKxMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMoJtBQbGQTEzABEzCBWhAYM2bMVOKdHjfukydPrt29e3dbXPeVdten0gE6PBMwARMwgfIInDp1amFjY+Pvcy0ZQO/evXvh9gs4/M+Sjqvk4GwTIL2R8M2HDx/udw6KQmoUVwriZFNT07Hjx4937Nq16whGJ6vE28GagAmYQCiBhoaGSadPn34V11A3nRa40+1tnf9rce3RAqSlpaX/iRMnxiEoJgB3HIUyCugj+vXrN4T7/kjvzvwzEzx5BLP9CJg9uN3J/xew37Jjxw5NDztqUThpilMsEbC9zwIB2xvu0mlSGo6WHpKmKcVOS1kE6IMyg9escIgMA7eyr2m96OxAIxNaZ5b9xo4dOx0BMBPhcR5pn4EgmMh1LIUynOtAwDdxbeR/rphXwR1DH8J8L37auG5BoKzDbDV6FcJkE9eM2Od6NqiGUaNGXURG58JyEtw0g9vF/zV9+/Z9dNu2bZqt9Sg1fPjwy5mcXhZnCaE7Mq5lCtivQHA/1B3xOQ4TSEKgxwiQYcOGDaHTv5hO7lIa/vkIgMnAGBgTiJazmvHTTBgjuT9X/vi/n8vz6FUjR458mLAf2bt3769khe7JqnH06NFvgcW7yeRFcBghAcL9Qe7XMRu5C2HydYTqoZ4EgTq0kDL+i7TkKSvI/pX0WICkpVCcjjME6l6AaGnl6NGjl/fp0+fVdGxaO7yA3A07k0NuMM/9W/K+wL2Wuy7G7GI6l0Xox+hYf8wMZ8mePXu2lwysTh2MGzfuleTxEyR/TmcWslwkYEdzP53ObSd23+m07yHX/uRjREEdqFnWYK24B9QsAY7YBCII1LUAYQQ8m5HwVXTqryOP82hs/avR8HPCnEQ80vNYwrkMQXLHzp07H4ngW69WTSybXM8sbk5O3s/kRWawbsH+esrgRz1sFpJstHGGSvVuYF3Tde7q5cwh1zuBuhQgEyZMaEZwvIaO7F10Yr9JIQwP6ugqXTidcdCgpzH6/kPCn4EQ+SpC5B7uj1c6vlqFx6xuLLOPKzvzG5SOrF1mbwR7LelZmYAJnGUE6k6AsEE+CuHxDjqw99CRz43q5KpVltk4+xL/Yu5HMQofxizou21tbYerFWd3hgvf4eRtaIw4mxHgI2K4sxMTMIEeSKCuBAgnZCbSYf8JWsJjXLYjL1ksuDuO+51oHcnVuv0BZhBH5REzCQJttGvjXGGO49qMLqkUP361wXwDI/bBjNxvR4jsLukx/Q60Ma6jy5EcyPcJ3vXRpjAfwwg00vSoTfT0F41TaALpIVA3AkTCg32Hv6TTkvAYrM67lMLdDtysRK/hfi1aAmQXo+YD3B9Fn2atvy9hDdJImmsL+lzutREvwaD9jkiFGwmRVhx9lJF7O9db0aUTFRtrba7JfRsCdgX5elVUSrDfSJlsiXJjOxMwgZ5LoC4EyKBBg0bSUelo5fvptOJslEtILGNW8ADun+SE1rPMDPSAYMmOHUE1mLha8TsX96/G/ysQEpOjqgD2CncDbiVA6l5pU5xlua+SkXPJ2uigDJHXDoTMt7Zv374vyN5mJmACPZ9APQiQfv379/8AHdnv02mVEh6ncPMoxXYXnduSWbNmrV26dKmWWWIrnvE4gOMn0U+NHz9eQuiVhPlbxD8fPSogoJcwuxs3X2dzfxkb6iWFVEAYqTMi33cjhCeQr3eSbz2Q2ZRNpBhvw+weHrj7NmY+IZS60nOCTKB7CKRegPAk9FV0VtfTaZVattIG9n/g9hYEzrJNmzZ10Jl3heJpRtfPEsB6RuNPcL2SNLyB8C/nPvNwIv83I6juZIZz2wsvvPArRu5diS9VfnnD50FmY18jb+tJ2GXkdTzX3uR/L1fN6n7Gk+g99jmYNBUGzHPfmJCmpDktZzmBVAsQhMcMRsEfo4wiN8zp3PbTyL5Jp3YzS1XPVLhMTyEYVrW2tj67f//+x4nrNdLEoZnGt3gJ410IGi0P9TiVnY39YNKkSQ8cOXJkBHntzT7PfnhIMveImVZXC416t5/6oGPcVeOh/aiuptP+TaAaBNIsQPqSYZ24uiQq4zReLSF9jeWUf9q6das2qaui1q9fr1NbD0+bNm0Vb/N9lCWe03SsS1asWNFjnv8IA7dlyxbtc3ivIwAQ9W8HdfRTXKuylIfwaKBu94i9tQB8NqpzAqkVIDygdyls30HDbKCBhmE+gd3t6H9EeLwY5qiS5hs2bNC7se5VmLzgrpJBO6z6JHCceqB3pVVFgNQnEqf6bCHQO6UZ1YbtdcgOvXMpKokPYPkFGnC3CI+ohNjurCaQ1nZ0VheKM999Qqms+LzI7wKEx+tBH4DempEp6NZwhL0D3DzGJ3n83x3I/Q47pQpU/p1dHRMw/1l6Lfi55quRftIio9OaSL6BvYdVid9HoAwq65Im4TGt7jez8b/Ju4zw/DCiOF4L0s8SxCm78DuWvSAQjf6TziqU7+Hvg0trj1NdYcASd2Qm7qsB0k1K9UUTJ16uR27Zo8X4j9KgPRmvPY+3E1XG+qCUv07mk2zVhCauxBWarxGddipSaQSgvA4QYexL1WJSpYYnUn/YyqQlmzC1GHc3ImljqHGWq7Th7Nwvxb9DO8QexpGmwnj3cSjGUqeUgPAThuBf4bFh9Gp6VRJ12Ok71MzZ868v9QbBphBvUTal7W0tGxm4KFO9A/QRZ1pNr/zmPWNh+dG3FglJxAoxJMH03Uf1JHN6CfoCzZStnsJUQJES5VT0ZdjNilJLPiVc80uQhWDlelYvj3UQbSFlpzXkC6tILSR7v0412tNtAc6Gj2F/3qCvYVrXaq6ESDAPs5oPHQknnb6TJW1mf1OKkum1gakV497a6T82TI7u1N8FXEF0+0dcNII7TriCpuJ/B4N4zt0xA8HpKNbjUinlmq2cb2JfN/H0crY8fOeoy3k4wssa+nwxYWEE+R3KEJ1NhYWIEF0SpvVXIBk68hDdMC3UtbLjx49up2Pux1W0jmu3Q+zFmYJWs78U9zOCakHgTnF/eRAi6whgy3N6ickCVNeCXc5fu5B/5L79SzP7+FEnQZ7p6mzTeRlMOmeTPhzuNeytp7fqrtZSd0IEJUJgMM6X6xTragrvd9HCscEpZIKJuOl5O/zZQqPM8FyymobQuSLNCg9xa7Kf8au8wYzPQX7/oULFz5WarTf6adaV9IidQfHKX9aThwIwec4IXMHfi9AB9WPBtifW07Y9lN7Amob1I9VXD/F4GIpKcoTaHTK2gDXyP5ZZpp6lYoOiah+x1Xjwhwy6BvE4ONt2fYZ5qzQXA3upwiFL3Ndlp0t57nBTDN/zaLb0MuJZzmCZDP36iMCl2MxT6UqmvanMpUkikrUh+WKohF1WtObmy6WWjSCuQqda5x7v5s/n6OBPJ9rWO49QmQrFf9z+NdGfGAwmL9x9erV0wItu9dwJ1y+RZSlNoxDU0XjuxtLNcgwFdpJhHmoE/PQClUn6S+ZTOqGZub/wsDqfq55wqPA80nc/Afu7wur8wXuM39xL2ET2A8y8LgArdlrLJWN9xHa3o0IiXuDhEdAQCfZxH+SZ34+i3+dCIvKY4D32hoFgqttkoJjpyD70FEkGVkEB1QDUwTfFaR/QlDUqnRU4nup/A8G2Zdrxib544T7/TD/xKvXYF8ZZt8d5tkG9zAN6LmuxMfS3QbC2pwNLyiogUGGPcCsrjqbpLxVntThTbzf7K6YfjUbuQs/sbjgTktNg2fNmhW4EoPdIsJLMmjdi5/P0vaWx0zvGWdaOUDwfB4DzbbOmKf9JjUChPfoa33wYAQwuEavV0b4rakVFVUddVitOIqA0d6HRlqVVNqsuw2t6X2YWoxFrevA/aQhVoMPywTm6ji2hNnDILCDCHNfL+a0h7JnbQnyWNP6QR6X87kCzdBjKdw/hcPM/kgcD9SN/sz8mwLc9mYZ6pUB5oFGxKuDPj9jIHhfoIMYhjpOTDi3kKautocYsVXGSU0rR24W1q1bp0J/SgURoWJPJyPC6FarKRyzJU96L1VRvMor5puw+GWRZQUMmELrdNbqIKZKD+Zz2IQsOq1VgahjBUEaTpCGFbEcl3BEWO0lnFTL+iR50LdZKqpJrMI7EZVo8nw2CJBfRTEotOPbHLvgphNacdU5bHDrWG2eYl9CL1/Ue7PyzMP+qCxw/13sNZgpW7Eq8EPC2VN2AN3sMU0jMxXAg+T/rUEMVJDYz2Pjt0+tN36D0hdmxqvFR2pDO8yefP13FV8vosr8GDpwJEXc4/ggkY4QRs1SwpJeCXM9GBk6c0gYQWRnmzCsWM6pjxoAPM/IM+4SS6xw5YiORCNajaajVNXzTB4boxJQbTvqR/xjeSSGgWgHhyqi9sPykkz++tAG+nKqK8+c5XK92HB0nmHEH8LZy+uCEi9dFQbJcuw2TmmtofwXEn+hder+p0mA6CNFj9HZqtMLfDAIoLOffvrpcdhvTR3JkARREXTyKnQNnopX1arriX91WEUk7n50UuNJX6JRXkhWyzHWF+cqNXOImvZXbaYNw+dg+JlyMh/lh46zF1/n1Bf+Ip1FWRbaUQ/K4VCOn8Koy/5PRx5bGGQjUT3QzFbCvWS8uOnL1z6D+sFReO5fMgAcZOPavnXr1kTCLiRsDaTXYbcwxD5VxkHgapZAGuI6tL7UFTh1BOxInnGYTwL1sF1dKCroEBIaOoorDfls1MwJPHRUMVdgPC7WsokW20WnPSwOGLivCCxUg2FWtE6T8jiMEo/buys4b4Ub6Je5MRxnpKMeSzji0HuY4y7slDj0Am2fWnX8YVB5JGJ+kRpKZWW+EdVE/SL71lHqSFzlq2SxJvKHZov/TycRQ+zRZVK1hlZNJznTvp8y0jBWogKqveV19ySWXFK1ZBnpIgSGVIXA21Zk02vShzvtqXOEV2QDhXcuHl3RwIrTjryCPavaA1Qw7EgFll3QPJGl7VwcatMEcma5KWRK3lvKSDjD0ydgkXLRZXsSFuJP2MUnijEREerqjTUSmIa5lEbi4HqvljsLX05uhJ5KwX8BUMfL1A9VKWznhlqrMjLCqWgbUxciGQPoqMmoqhw1+Ktboyoy/rr1FtZPCjFHOWmpJJAzYb2ykA29WR14rVYYA0dJVkg5YAqRoZqZ44+Y7606HUSrSlglPqxZ1oSqS4UrmlDPfjxCejrOFBatnQa5Fpy7tQQkmH3o6NrRCY6/8VE2x5Bf6iUxVfKbvVVl+iZMh4q+l8IqTxFS7oe7oiebYCt56b1RsxX5jfzrXmnZm5LGcQUZoewvIfKAAYWCndhs7btI5nhNggwPCT2pEUA3TknqqlfvUdcKcWtqL9P9BGBB1egD+XV5bMDPMTZrMSa92QbVUE6ZawywqYY6AmBERzkkOLbwYYV9VK8oxSUOvalrqMXD4RdWroCzpQEdsxfKqPgFQ1QFOqcRQf2N34jlhJfGjZbqiGQgnqrQhHvt5EtyOxk+X+6RJkyZJyOsFiznZSe9t6gRIFtX3APgilTeQHHaT0B9EiKT+vTGM4FQRA/OiSoKwnFvFPR19M/vlgRB/bdjODGV7hH21rZI09Gqnpe7Cp24l6eB0LHh6kkxSN8+n/tRyjyxJcnPdJul99br2IgECK51gCGy3uRHl3Guv8y3o4E4rx2HUIS+KnA/zCVFu0mSXSgHCi/WeAdIPo0AB+W10wFfjpksFFhVHlB2vP4i1nsxJmpdI6+qwsMjD7M2bN08Ps++KOQ9DjSXueRJUhQpzGa1nPyn6qE+hx8r+9wykCzzp4GMfwMjWgVlEV9RZhiUBPwuwq0n7CktTFcw1AynqB3miXMI5tN0WpiPL9618Z73s/dlp06YNIZz3o2P1LYVpqMX/InC1SERAnCcZGd8MSL3mO8A683LFYdj9JQW2MNBBFQ31fWQEw5/w/Y1LYkRDNk4/GOaOPIxgBPTbYfZdMWcJ4g3410OCYephLBKto4cFZPPuJ8AoOf/ptxJJoK7N4iG1aSWcZazHjx+vpavF1N04zuvZTaAAIUP61siyhBmbxorbR9U/JPTXSwNSXtlyLXG+OqnfWrpPqwDptX379lVU3lvQoaNU7LRW+Ekaxfzugsind7UpfT3x3UAD/iTLaG/CrNQ0fwnpDGzsmGtp4VrCmVrJPDD7GEfYGs2EjTiPko97Kxmnw+peApTfviQx4n4ks5b3tba2Rh4t19seeL3HNbh/WZLwe5pb2uVS2k+SBxn16YDfgduHESLT4/KYMmXKUN7H9U78fpj4Ur8sn5uv1AoQEnmSVxx/ncLQB1ly05x3D/AFgL+Rmcjrq7iXkIkTQTWWhiXhoS8LjkZfRdpuZN3yAwgRPdEdqKgcz+D2F2H5wFxrzX/Ka9/7BwaQ0FCjGWYf78db4AxJ6SA9K8nLEwmDtvMUEaAM96BjTxFwqtH2ezio8l4NMIKyonq8Zs2aa2lTH8Rt3SylBOWlq2Y8oa6l9FLv58uLBmYD0X+M4ScQIm+hTU8M6ZcaNMtjFeOKQ4cOfQTef4O/WLPDvAhr/KfoCcwapycv+vb29s2MzD8L2K/S6WlEnWff+Qfz3+R+AN8On0DDuIflpRc67Sp1pTJcSBreS3jvJj5N7zOKUcpcCn8cwq4VIfZt9m/UKRcm9CjLVN/E7SLsimYrhCdB/m6mv+sYHX57/fr1SR+eyqRFPxo9rl259ne4/SN04DMgxKfjs7fqwU2uVnVKgGXeXdSZ45Rnko6+hXr8cershdTXJ/C7G63ZqGYloxlUzMNOS1exR9B1iq9ksulPjjBo/B4O9S45tdG4Ssd5tRw1h35hBeGsoR/TaUftWelBx2b6guHYncu9vlR6KbwHxg08Te5SLUAEis2sn9J5f43bv0KHjtApgMsoiLGMvGdTWHdTOMsr8ZJCwtK3i6+gwK8hjtcFpQHzsZj/IXoqjfIrCBEtDeUJkY6Ojp/T4JcS1utxj3W+wmwUdh9jHbSBUeD3qXR6NUIixZt1hyA83qxwCC/wJAd2CnMF+Qk9Kp0o0vpwXAy8PtIdmUrKchflrDe3Bs4mwjzjZwr6j9C/hRu9vVYPzfXjXi8P1EAtbNkzLMhqmocvP1Qz1mzYCOgfMfj7IIzOhUuSGPXWDAmHi7iqjKR1oEafWWjmOpw2OBKzwEFekohq6Tb1AgQ4Gh19DejqEN+LDgWOm8nYX4f7Syj0+5kePoJAWUVnrBlJ6F4KdoWqkalnC5VnLhYLCXcx19mFjgr+awSnkdt9XItqmkb7CKMvYj+H9LVwLfCOp9OnW7G7gSWxKbj9EQJnpUZBRQ4LDFhD7YeAuoAK+Qb867vrMwqcZP5ip+s+3H2Rl/TV7PmPoLRV04x8Jyn7aialomGzT7ifEfIzmgEH1aeoyGDSiJ9JuJFOrSKNSUb+Fc+Hvu7JoPAbtJlPE3i5/aVWLDKrFrnllG2PFU9zdwZYLpDuTKNmITtpKJ+jofSnAH6XyEOFCHZNuNGU8yIKfTFCYCUzmJWY6SWN+urXHswPDR48+NiAAQNOsf7Y+6WXXupLYQ5A2IzAToJqOjOYi/k/l/8SHHGWCLSU8G+4/ynuAxX5eJC03Izlx9Ea8RUpwphCWv4MPZc0PEjlXUm6N+JwN2k/glA5hbme7+iP+Qjupx4+fPgC/l+Bm/n41/Q5UGF3An0r/n4c6KCHGlImPVKAUFwnKMslXLU02iMVA8GazkAElafSb6cv0OrDItpPj+RcbqbqQoAoc4yY1w8fPvzvedpTU8C3YdRcojAHYH857rS0tQO9Cb2dBreLyrAXwUG/e/gYbvSpXLkdhtYy0kSu6sTH0O+UrLy4U/I0S/o3OvPP8DnLZ2UQoiRk/hW7qeh3osP4DyRuVVil/1kExwb+Kw/7mZ0c4yqBNhTz0eRnKnbn8n8YOkqp5v8nef0SS2yxnx+ICrACdjUdXVYg/TUPgvp0D4n4EHViJPc1T08aEgAHvRK9YklhT7WNgd9nCHAC4c4w5/9FG9aB/a+LFN0xnVzLJvlNFKK+Pfx29JgYhamTJ2PJxtisWy6n1QlLeKiiaSqvGc05XBPVOvyKzj78fY9RypcQHs/IIEpp6WjEiBH/wMhKAvC3cRs1mxqKm0txI62ntiWoNJpuRGg0Ke3c98qmQ7dhSvn8CX4+jfDYFOaoBuZpWmuvQfa7HiUn/NbSuX2fkK7remhFIUgiafm3pcim+wzKkYpJ/Oh5j5Lu4Xw/y8qfI9ufwL3ehFEVAoStAzQvEf6ZgzpViahCgdbdCJDRwLPAVUFKr0CrAiTBIcfarxiEP713ZhBay0nJAiFO0vEcYXwpO/MoKTyII6OyguYm/tyBPhAn/bhRZ6tDBAPR2oQr2flmw9XG3XeZrXwK4fUUfq16FoHjDF7+mbr4ZLa8K5K7bFgPc/1eJcNNmjjqbdVfd0P+4ixxnmT2fieDsM9n233SrES6F2P0YcK+Ff1QLZlHJrTAsu4EiNKvKSVLWV+lbt3I39sBnnlivTugZwtaIwSdtPo/bF5/iQ3yLdwnUuyH6EHJTxPel7muy4abKIwwx51hZcP9Mpz+L8wkbK16IAFm5mvI1qfRa1T2XVUKg7rzC7UvOsyfcd/VINPsX5mLlcG2trbD7EF+k2Xjm2CyDH8VWSrLltlOwruZ+3/guhJdF6qulrByiWZPJ92jUygU5sMU6muAr6WeidkGkOu8y/fZQu4goKfRP+P/3QiBx7mPM3oJjF/7OkOGDPl/fJN5DXnQt+BfSbiZI5nlNNrOfONXAvUR9A95Pf59esNxYAJKG2Z6I4VbqIgj7uAj4y4oDMxKzqIK4w37r7DELCge/CSJJzS9QXETZyraEEssP2J5t4l2oIfYXgGHPuKRRIkdfg6gl3D/FWbK93MY8RUJJgElWRB2o+KRjqNwH89hTmCEnSnvmHGovGPHISGC+ztYztrO9e3oV6OnKi7Sym18lfWjGdZT+P0uwvpOBnovsCSpOOIyitsO4ycsgcuSBZ4grJo4VSdMxBsp0Eep6JfRgHQCaxaFM51COfMtjHIKVxmSP8LS6GAt98vRS1myepSHHNtl31W1f//+fejv8AzHKp58XUD48wnzQvRk4tWSVUmFH7lRw9/EdRX+HiKND2vPSBblKsLRFyJXUbHzgoCxuOzKMwz5g/92tARkngvM9AqXzXmGXfhD+BKagWklHjX2uGpnUDhBnsUBt5uC7GpgdoLO59/ZX9vJUosOmcwnba1ctTybUbllgF2ncafdfuxX8efn6B8yONJAqRcPFu4mn6pTJTsq/O8l7vzKokByFOG0oZ8srFM5TvJuCTPxgQ/8tJHm52PGcYpZhfYdkqiT8FnC9z/W4zczeMXzXPI1lWsgbwWOvS6d6gjp1BK4+q27WVF5ICucesFwA3aPozvdBl4VHnncHWjZTYZ5OeqmOKsZTQOFOokN6tlUoPMBfD6FoBmJnrvQQzva79D+R2YUlJuQzsLC7THMD/F/D/dbud+IXkkhP02nvFIdfq6/Ct/3oQOYQdp1LHc2ejrha0aSSTtpUtpVZhq16PkQffRGFegF3D6HvYTcKoTqBswiGzL2JRWn3ibCUrO6wprcAI81cQ4NUB6TaWQKo0iR1p10eg8WWZRhwOj7ErhNwWtRWmlkG4nnyTjBkueZ5Pn8gHCCvKss2hj9PxpkWSszWLTA4jeIX9zPpW5MgPVw7vtzr0EjfzNf/XyJez1IuJnravRyynU5rA5yn1HM8Adi/xrcN3aahV1xcwS//4X98TA31O/z4dtKPGFO8swRYL9IOoNmBL+YQMbkBRT+5zRx/LgLA8IGGElQXwzzuTCYkeWtE516rUnmEQDuxUTCcBdmW/mvlZMn2L/SA8/bcpNHHZyAQJmDXa5x0T0cJeCfxr/6qZooNYCeqpooiDFA1rHc8RTYKDKqp8rVkHRs9xzu1Zg0stLR4OP87+CqmYVmHG10PHpuZCN7HG38jy5NHFRSqeGSFp1+GUfF1BFNNWSNbvQFteOYdfBfs45d3L9APnfEeeiwkml0WOkmgPAeSkc0mfoygTqiUz2qQ325Um0yry/RAESvQ9kycOBALZs2bdWSrVWZBPQmCHhPgvdEghgF8yHcN3NVP9vBfTvcNaPbwmB0c094lVBPFiCF1aA3y1w6vdSfZyma6XDPoUC1ToxRwykK9QT/j9CYDjEa0UghdBRVGHA3/1eZFY6yuzkJjq5OCajudC5FxZsC1GlGU5Jszdo6Z27ibeYpKRgnwwRMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMwARMoLoE/gegBctRZGw0HwAAAABJRU5ErkJggg==
```

Example usage on the title slide:

```html
<img class="slide__logo" src="data:image/png;base64,..." alt="CoinFund" style="width: 240px; height: auto;">
```

Use it to replace the text wordmark on title and end slides. On content slides, consider placing a small version (e.g., 80px wide) in the bottom-right corner as a subtle brand mark.

## Incremental Editing

The live server makes editing feel like a REPL — edit the file, see the result immediately.

Because the deck is a single HTML file:

- **Git-friendly**: each slide is a `<section>` block, so diffs are clean and meaningful
- **Add slides**: insert new `<section class="slide">` blocks between existing ones
- **Reorder**: cut/paste `<section>` blocks
- **Edit content**: modify text within existing sections
- **Style tweaks**: adjust CSS custom properties in `:root` for global changes

When the user asks to edit specific slides, use the Edit tool to modify just the relevant `<section>` blocks. Do not regenerate the entire file for small changes. The live server will auto-reload on every save.

## Overflow Prevention

- **5 blocks max** per slide (Pattern 1)
- **6 rows max** per label-value grid (Pattern 2)
- **7 table rows max** (including header)
- **Footnotes** anchored to `bottom: 20px` via absolute positioning
- If content won't fit, **split into two slides** — never shrink fonts below 10px
