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
- CoinFund logo: text wordmark "CoinFund" in 52px Arial bold, color `--text`, centered
- Thin divider line below wordmark: 240px wide, `--text`, centered
- Deck title: 28px Nunito bold, color `--blue`, centered below divider
- Subtitle/date: 14px Nunito, color `--gray`, centered

```html
<section class="slide slide--title">
  <div class="slide__wordmark">CoinFund</div>
  <hr class="slide__divider slide__divider--title">
  <h1 class="slide__deck-title">Deck Title Here</h1>
  <p class="slide__subtitle">March 2026</p>
</section>
```

### End Slide (always last)

- Background: `--bg` (cream)
- "CoinFund" in 36px Nunito bold, color `--blue`, centered
- Gray divider rule centered
- "coinfund.io" in 13px Nunito, color `--gray`, centered

```html
<section class="slide slide--end">
  <div class="slide__end-wordmark">CoinFund</div>
  <hr class="slide__divider slide__divider--end">
  <p class="slide__end-url">coinfund.io</p>
</section>
```

## Content Slide Patterns

Every content slide follows this HTML structure:

```html
<section class="slide">
  <h2 class="slide__title">Slide Title</h2>
  <hr class="slide__accent">
  <div class="slide__body">
    <!-- Content using one of the patterns below -->
  </div>
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
.slide__wordmark {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 52px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 1px;
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
.slide__end-wordmark {
  font-size: 36px;
  font-weight: 700;
  color: var(--blue);
}
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
  <div class="slide__wordmark reveal">CoinFund</div>
  <hr class="slide__divider slide__divider--title reveal">
  <h1 class="slide__deck-title reveal">DECK_TITLE_HERE</h1>
  <p class="slide__subtitle reveal">MONTH YEAR</p>
</section>

<!-- ═══════════ CONTENT SLIDES ═══════════ -->
<!-- Add slides here. Use class="reveal" on elements for entrance animations. -->

<!-- ═══════════ END SLIDE ═══════════ -->
<section class="slide slide--end">
  <div class="slide__end-wordmark reveal">CoinFund</div>
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
