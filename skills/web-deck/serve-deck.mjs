// serve-deck.mjs — live-reload server with PDF export for web-deck
import { createServer } from 'http';
import { readFile, watch } from 'fs';
import { extname, join, resolve, basename } from 'path';

const PORT = parseInt(process.argv[2] || '3333', 10);
const DIR = resolve(process.argv[3] || '.');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};

// SSE clients for live reload
const clients = new Set();

// Auto-shutdown when all browser tabs disconnect
const SHUTDOWN_DELAY = 5000; // 5s grace period for reconnects / tab refresh
let shutdownTimer = null;
function scheduleShutdown() {
  if (clients.size > 0) return;
  shutdownTimer = setTimeout(() => {
    console.log('All clients disconnected — shutting down.');
    process.exit(0);
  }, SHUTDOWN_DELAY);
}
function cancelShutdown() {
  if (shutdownTimer) { clearTimeout(shutdownTimer); shutdownTimer = null; }
}

// Overlay menu — minimal CoinFund-styled toolbar injected into served HTML
const INJECTED_SNIPPET = `
<style>
  .deck-menu-toggle {
    position: fixed; top: 12px; right: 12px; z-index: 9999;
    width: 32px; height: 32px; border-radius: 4px;
    background: rgba(247,243,238,0.85); border: 1px solid #C8C2BA;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: #2C3E50; opacity: 0; transition: opacity 0.2s;
    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  }
  .deck-menu-toggle:hover, .deck-menu-toggle.show { opacity: 1; }
  body:hover .deck-menu-toggle { opacity: 0.5; }
  .deck-menu {
    position: fixed; top: 50px; right: 12px; z-index: 9999;
    background: #F7F3EE; border: 1px solid #C8C2BA; border-radius: 6px;
    padding: 6px 0; min-width: 180px; display: none;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    font-family: 'Nunito', system-ui, sans-serif; font-size: 13px;
  }
  .deck-menu.open { display: block; }
  .deck-menu button {
    display: block; width: 100%; padding: 8px 16px;
    background: none; border: none; text-align: left;
    cursor: pointer; color: #1A1A1A; font: inherit;
  }
  .deck-menu button:hover { background: rgba(44,62,80,0.06); }
  .deck-menu button.loading { color: #7A7A7A; pointer-events: none; }
  .deck-menu hr { border: none; border-top: 1px solid #C8C2BA; margin: 4px 0; }
  .deck-menu .hint { padding: 4px 16px; color: #7A7A7A; font-size: 11px; }
</style>
<button class="deck-menu-toggle" id="deckMenuToggle" title="Deck menu">&#9776;</button>
<div class="deck-menu" id="deckMenu">
  <button id="deckExportPdf">Download as PDF</button>
  <hr>
  <div class="hint">&#8984;P also prints</div>
</div>
<script>
(function(){
  // Live reload via SSE (EventSource auto-reconnects on error)
  const es = new EventSource('/__reload');
  es.onmessage = (e) => { if (e.data === 'reload') location.reload(); };

  // Overlay menu
  const toggle = document.getElementById('deckMenuToggle');
  const menu = document.getElementById('deckMenu');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('show');
    menu.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.classList.remove('show');
  });

  // PDF export
  document.getElementById('deckExportPdf').addEventListener('click', async (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.textContent = 'Generating PDF...';
    btn.classList.add('loading');
    try {
      const file = location.pathname.split('/').pop() || 'deck.html';
      const resp = await fetch('/__export-pdf?file=' + encodeURIComponent(file));
      if (!resp.ok) {
        const msg = await resp.text();
        alert('PDF export failed: ' + msg);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.replace('.html', '.pdf');
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('PDF export error: ' + err.message);
    } finally {
      btn.textContent = 'Download as PDF';
      btn.classList.remove('loading');
      menu.classList.remove('open');
      toggle.classList.remove('show');
    }
  });
})();
</script>`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // SSE endpoint for live reload
  if (url.pathname === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('data: connected\n\n');
    clients.add(res);
    req.on('close', () => {
      clients.delete(res);
      scheduleShutdown();
    });
    cancelShutdown();
    return;
  }

  // PDF export endpoint
  if (url.pathname === '/__export-pdf') {
    const file = url.searchParams.get('file') || 'deck.html';
    const filePath = join(DIR, basename(file));
    let puppeteer;
    try {
      puppeteer = await import('puppeteer');
    } catch {
      // Auto-install puppeteer on first use
      const { execSync } = await import('child_process');
      const { dirname } = await import('path');
      const { fileURLToPath } = await import('url');
      const scriptDir = dirname(fileURLToPath(import.meta.url));
      try {
        console.log('Installing puppeteer (first-time setup)...');
        execSync('npm install puppeteer', { cwd: scriptDir, stdio: 'inherit' });
        puppeteer = await import('puppeteer');
      } catch (installErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to install puppeteer: ' + installErr.message);
        return;
      }
    }
    try {
      const browser = await puppeteer.default.launch();
      const page = await browser.newPage();
      await page.goto('file://' + filePath, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        document.documentElement.dataset.mode = 'static';
        document.querySelectorAll('.slide').forEach(s => {
          s.classList.remove('active');
          s.style.opacity = '1';
          s.style.position = 'relative';
          s.style.transform = 'none';
          s.style.margin = '0 auto';
          s.style.pointerEvents = 'auto';
        });
        // Hide server-injected UI and deck chrome
        document.querySelectorAll(
          '.deck-nav, .deck-progress, .deck-menu-toggle, .deck-menu'
        ).forEach(el => el.style.display = 'none');
      });
      const pdf = await page.pdf({
        width: '960px',
        height: '540px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await browser.close();
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${basename(file, '.html')}.pdf"`,
      });
      res.end(pdf);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('PDF generation failed: ' + err.message);
    }
    return;
  }

  // Static file serving
  let filePath = join(DIR, url.pathname === '/' ? 'deck.html' : url.pathname);
  const ext = extname(filePath);

  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const contentType = MIME[ext] || 'application/octet-stream';
    // Inject overlay menu + reload snippet into HTML responses
    if (ext === '.html') {
      data = Buffer.from(
        data.toString().replace('</body>', INJECTED_SNIPPET + '\n</body>')
      );
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Watch for file changes and notify all connected browsers
let debounce = null;
watch(DIR, { recursive: false }, (event, filename) => {
  if (!filename || !filename.endsWith('.html')) return;
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    for (const client of clients) {
      client.write('data: reload\n\n');
    }
  }, 100);
});

server.listen(PORT, () => {
  console.log(`Deck server running at http://localhost:${PORT}/`);
  console.log(`Serving files from ${DIR}`);
  console.log('PDF export available (puppeteer auto-installs on first use)');
});
