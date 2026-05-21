import { RuntimeLinkRecord } from "../../types/runtime";
import { escapeHtml } from "../../utils/html";

export function renderMenuHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Menú de servicios");
  const safeBrand = escapeHtml(record.config.brand || "Automatiza Fácil");
  const safeSubtitle = escapeHtml(
    record.config.subtitle || "Selecciona el módulo que quieres utilizar."
  );

  const modules = record.config.modules || [];
  const activeModules = modules.filter((module) => module.enabled);

  const cardsHtml = activeModules
    .map((module, index) => {
      const title = escapeHtml(module.title);
      const description = escapeHtml(module.description);
      const icon = escapeHtml(module.icon || "✦");
      const url = escapeHtml(module.url || "#");

      return `
        <a
          class="module-card"
          href="${url}"
          style="--delay: ${index * 80}ms;"
          data-loading-link="true"
        >
          <div class="module-icon">
            <span>${icon}</span>
          </div>

          <div class="module-main">
            <div class="module-topline">
              <span class="module-status">Activo</span>
            </div>
            <div class="module-title">${title}</div>
            <div class="module-description">${description}</div>
          </div>

          <div class="module-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </a>
      `;
    })
    .join("");

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

  <style>
    :root {
      --bg:            #07090f;
      --surface:       rgba(255, 255, 255, 0.04);
      --surface-hover: rgba(255, 255, 255, 0.07);
      --border:        rgba(255, 255, 255, 0.07);
      --border-lit:    rgba(160, 130, 255, 0.28);
      --text:          #edeaff;
      --muted:         rgba(220, 215, 255, 0.48);
      --faint:         rgba(220, 215, 255, 0.22);
      --accent:        #8b5cf6;
      --accent-soft:   rgba(139, 92, 246, 0.18);
      --accent-glow:   rgba(139, 92, 246, 0.35);
      --teal:          #2dd4bf;
      --green:         #34d399;
      --green-glow:    rgba(52, 211, 153, 0.75);
      --radius-xl:     24px;
      --radius-lg:     16px;
      --radius-md:     10px;
      --radius-sm:     8px;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family: 'DM Sans', Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* ── Ambient background ── */
    .bg-orb-1 {
      position: fixed;
      top: -260px; left: -180px;
      width: 640px; height: 640px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 68%);
      pointer-events: none;
      z-index: 0;
    }

    .bg-orb-2 {
      position: fixed;
      bottom: -180px; right: -160px;
      width: 520px; height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 68%);
      pointer-events: none;
      z-index: 0;
    }

    .bg-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
    }

    /* ── Loader ── */
    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(7, 9, 15, 0.7);
      backdrop-filter: blur(16px);
      transition: opacity 180ms ease, visibility 180ms ease;
    }

    .app-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .spinner {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 2.5px solid rgba(139, 92, 246, 0.15);
      border-top-color: var(--accent);
      animation: spin 700ms linear infinite;
    }

    /* ── Page layout ── */
    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 28px 16px 48px;
    }

    .shell {
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      animation: fadeIn 400ms ease both;
    }

    /* ── Topbar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 56px;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 7px 14px 7px 8px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      backdrop-filter: blur(20px);
    }

    .brand-mark {
      width: 32px; height: 32px;
      border-radius: 10px;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 30% 25%, rgba(255,255,255,0.75), transparent 24%),
        linear-gradient(135deg, #a78bfa, #6d28d9 55%, #1e1b4b);
      box-shadow: 0 8px 24px rgba(109, 40, 217, 0.4);
    }

    .brand-text-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.01em;
      line-height: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
    }

    .brand-sub {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      color: var(--muted);
      font-weight: 400;
      line-height: 1;
    }

    .status-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green-glow);
      flex-shrink: 0;
    }

    .online-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 13px;
      border-radius: 999px;
      border: 1px solid rgba(52,211,153,0.18);
      background: rgba(52,211,153,0.06);
      font-size: 11px;
      font-weight: 500;
      color: var(--green);
      white-space: nowrap;
      backdrop-filter: blur(20px);
    }

    /* ── Hero ── */
    .hero {
      margin-bottom: 32px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--accent-soft);
      border: 1px solid rgba(167,139,250,0.2);
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #c4b5fd;
    }

    .eyebrow-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent-glow);
    }

    h1 {
      margin: 0 0 14px;
      font-family: 'Syne', sans-serif;
      font-size: 46px;
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -0.04em;
      color: var(--text);
    }

    .subtitle {
      margin: 0;
      max-width: 480px;
      font-size: 15px;
      font-weight: 300;
      line-height: 1.6;
      color: var(--muted);
    }

    /* ── Panel ── */
    .panel-wrap {
      position: relative;
    }

    .panel-glow {
      position: absolute;
      inset: 20px;
      border-radius: var(--radius-xl);
      background: rgba(100, 80, 220, 0.16);
      filter: blur(48px);
      z-index: -1;
      pointer-events: none;
    }

    .panel {
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-xl);
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.035);
      backdrop-filter: blur(28px);
      box-shadow:
        0 32px 80px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.06);
      padding: 10px;
      animation: fadeUp 460ms ease both;
    }

    .panel::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 28%),
        radial-gradient(circle at 50% 0%, rgba(139,92,246,0.1), transparent 48%);
    }

    .panel-header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 8px 14px;
    }

    .panel-label {
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #a78bfa;
    }

    .panel-count {
      font-size: 11px;
      color: var(--muted);
      font-weight: 400;
    }

    /* ── Module cards ── */
    .modules {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 8px;
    }

    .module-card {
      position: relative;
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr) 36px;
      align-items: center;
      gap: 14px;
      min-height: 90px;
      padding: 14px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background: rgba(15, 10, 30, 0.5);
      color: inherit;
      text-decoration: none;
      opacity: 0;
      transform: translateY(8px);
      animation: cardIn 380ms ease both;
      animation-delay: var(--delay);
      box-shadow:
        0 12px 40px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.04);
      transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }

    .module-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(180deg, rgba(255,255,255,0.035) 0%, transparent 40%);
      pointer-events: none;
    }

    .module-card:hover {
      transform: translateY(-2px) scale(1.005);
      border-color: var(--border-lit);
      background: rgba(30, 20, 55, 0.65);
      box-shadow:
        0 20px 60px rgba(80, 50, 180, 0.18),
        inset 0 1px 0 rgba(255,255,255,0.06);
    }

    .module-card:hover .module-arrow {
      transform: translateX(3px);
      color: var(--accent);
      border-color: rgba(167,139,250,0.3);
      background: rgba(139,92,246,0.12);
    }

    .module-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 34% 22%, rgba(255,255,255,0.14), transparent 30%),
        rgba(139,92,246,0.1);
      border: 1px solid rgba(167,139,250,0.16);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    }

    .module-icon span {
      font-size: 24px;
      line-height: 1;
      filter: drop-shadow(0 0 10px rgba(167,139,250,0.5));
    }

    .module-main {
      min-width: 0;
    }

    .module-topline {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
    }

    .module-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(52,211,153,0.07);
      border: 1px solid rgba(52,211,153,0.15);
      font-size: 9.5px;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #6ee7b7;
    }

    .module-status::before {
      content: '';
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 7px var(--green-glow);
    }

    .module-title {
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .module-description {
      font-size: 12.5px;
      font-weight: 300;
      line-height: 1.4;
      color: var(--muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .module-arrow {
      width: 34px; height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--muted);
      background: var(--surface);
      border: 1px solid var(--border);
      transition: transform 160ms ease, color 160ms ease, border-color 160ms ease, background 160ms ease;
    }

    /* ── Empty state ── */
    .empty {
      position: relative;
      z-index: 1;
      padding: 36px 20px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      font-weight: 300;
      line-height: 1.5;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 20px;
      text-align: center;
      animation: fadeUp 600ms ease both;
    }

    .secure-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      backdrop-filter: blur(20px);
      font-size: 11.5px;
      color: var(--muted);
    }

    .secure-icon {
      font-size: 12px;
      line-height: 1;
    }

    .powered {
      margin-top: 10px;
      font-size: 11px;
      font-weight: 300;
      color: var(--faint);
    }

    .powered strong {
      color: #a78bfa;
      font-weight: 500;
    }

    /* ── Animations ── */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    /* ── Responsive ── */
    @media (max-width: 540px) {
      .page { padding: 20px 12px 36px; }

      h1 { font-size: 34px; }

      .topbar { margin-bottom: 40px; }

      .brand-name { max-width: 160px; }

      .online-badge { display: none; }

      .panel { border-radius: 20px; }

      .panel-header { flex-direction: column; align-items: flex-start; }

      .module-card {
        grid-template-columns: 46px minmax(0, 1fr) 32px;
        gap: 12px;
        padding: 12px;
        min-height: 84px;
      }

      .module-icon {
        width: 46px; height: 46px;
        border-radius: 12px;
      }

      .module-icon span { font-size: 20px; }

      .module-arrow {
        width: 30px; height: 30px;
      }
    }
  </style>
</head>

<body>
  <div class="bg-orb-1"></div>
  <div class="bg-orb-2"></div>
  <div class="bg-grid"></div>

  <div id="appLoader" class="app-loader hidden">
    <div class="spinner"></div>
  </div>

  <main class="page">
    <div class="shell">

      <header class="topbar">
        <div class="brand-pill">
          <div class="brand-mark"></div>
          <div class="brand-text-group">
            <span class="brand-name">${safeBrand}</span>
            <span class="brand-sub">
              <span class="status-dot"></span>
              Portal operativo
            </span>
          </div>
        </div>

        <div class="online-badge">
          <span class="status-dot"></span>
          Sistema online
        </div>
      </header>

      <section class="hero">
        <div class="eyebrow">
          <span class="eyebrow-dot"></span>
          Centro digital
        </div>
        <h1>${safeTitle}</h1>
        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <div class="panel-wrap">
        <div class="panel-glow"></div>

        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">Módulos disponibles</span>
            <span class="panel-count">${activeModules.length} activos</span>
          </div>

          <div class="modules">
            ${
              cardsHtml ||
              `<div class="empty">No hay módulos disponibles por el momento.</div>`
            }
          </div>
        </section>
      </div>

      <div class="footer">
        <div class="secure-badge">
          <span class="secure-icon">🔒</span>
          <span>Acceso seguro generado para tu atención</span>
        </div>
        <p class="powered">
          Desarrollado por <strong>Automatiza Fácil</strong>
        </p>
      </div>

    </div>
  </main>

  <script>
    window.AppLoader = {
      show() {
        const el = document.getElementById("appLoader");
        if (el) el.classList.remove("hidden");
      },
      hide() {
        const el = document.getElementById("appLoader");
        if (el) el.classList.add("hidden");
      }
    };

    document.addEventListener("DOMContentLoaded", () => {
      window.AppLoader.hide();

      document.querySelectorAll("[data-loading-link]").forEach((link) => {
        link.addEventListener("click", () => window.AppLoader.show());
      });
    });

    window.addEventListener("pageshow", () => window.AppLoader.hide());

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") window.AppLoader.hide();
    });
  </script>
</body>
</html>`;
}