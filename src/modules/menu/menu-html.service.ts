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
          style="--delay: ${index * 70}ms;"
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

          <div class="module-arrow">›</div>
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

  <style>
    :root {
      --bg: #020617;
      --bg-2: #04111f;

      --glass: rgba(15, 23, 42, 0.58);
      --glass-2: rgba(15, 23, 42, 0.74);
      --glass-hover: rgba(30, 41, 59, 0.72);

      --border: rgba(255, 255, 255, 0.09);
      --border-strong: rgba(170, 190, 255, 0.22);

      --text: #f8fafc;
      --muted: #94a3b8;
      --muted-soft: #64748b;

      --blue: #7c8cff;
      --blue-soft: #c6d0ff;
      --cyan: #67e8f9;
      --green: #22c55e;
      --danger: #fb7185;

      --radius-xl: 30px;
      --radius-lg: 18px;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html,
    body {
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family: Inter, Arial, Helvetica, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 50% 92%, rgba(92, 120, 255, 0.36), transparent 18%),
        radial-gradient(circle at 50% 110%, rgba(120, 140, 255, 0.22), transparent 36%),
        radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.18), transparent 34%),
        linear-gradient(180deg, #020617 0%, #03101f 48%, #020617 100%);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: radial-gradient(circle at center, black, transparent 78%);
      opacity: 0.45;
    }

    .background-ring {
      position: fixed;
      left: 50%;
      bottom: -520px;
      transform: translateX(-50%);
      width: 980px;
      height: 980px;
      border-radius: 50%;
      pointer-events: none;
      border: 2px solid rgba(166, 184, 255, 0.72);
      box-shadow:
        0 0 22px rgba(124, 140, 255, 0.75),
        0 0 80px rgba(91, 120, 255, 0.56),
        inset 0 0 55px rgba(124, 140, 255, 0.28);
      filter: blur(0.2px);
    }

    .background-ring::before {
      content: "";
      position: absolute;
      inset: -22px;
      border-radius: inherit;
      border: 1px solid rgba(124, 140, 255, 0.22);
      filter: blur(14px);
    }

    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(2, 6, 23, 0.74);
      backdrop-filter: blur(14px);
      transition: opacity 160ms ease, visibility 160ms ease;
    }

    .app-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .app-spinner {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 3px solid rgba(124, 140, 255, 0.18);
      border-top-color: var(--blue-soft);
      animation: spin 760ms linear infinite;
    }

    .page {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      padding: 22px 14px 38px;
    }

    .shell {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      animation: pageIn 420ms ease both;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 72px;
    }

    .brand-lockup {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding: 8px 10px 8px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.035);
      border: 1px solid rgba(255,255,255,0.075);
      backdrop-filter: blur(18px);
    }

    .brand-mark {
      width: 34px;
      height: 34px;
      border-radius: 13px;
      background:
        radial-gradient(circle at 32% 26%, rgba(255,255,255,0.85), transparent 20%),
        linear-gradient(135deg, #8ea0ff, #3346d3 58%, #0f172a);
      box-shadow:
        0 12px 28px rgba(79, 70, 229, 0.34),
        inset 0 1px 0 rgba(255,255,255,0.35);
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 13px;
      font-weight: 850;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
      letter-spacing: -0.02em;
    }

    .brand-sub {
      margin-top: 3px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10.5px;
      color: var(--muted-soft);
      font-weight: 750;
    }

    .brand-sub::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 14px rgba(34, 197, 94, 0.78);
    }

    .system-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 11px;
      border-radius: 999px;
      border: 1px solid rgba(198, 208, 255, 0.14);
      color: var(--blue-soft);
      font-size: 11px;
      font-weight: 850;
      background: rgba(255,255,255,0.035);
      backdrop-filter: blur(18px);
      white-space: nowrap;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }

    .system-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 14px rgba(34, 197, 94, 0.78);
    }

    .hero {
      margin-bottom: 34px;
      text-align: left;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      width: max-content;
      max-width: 100%;
      margin-bottom: 15px;
      padding: 7px 10px;
      border-radius: 999px;
      color: var(--blue-soft);
      font-size: 10.5px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(124, 140, 255, 0.09);
      border: 1px solid rgba(198, 208, 255, 0.13);
      backdrop-filter: blur(14px);
    }

    h1 {
      margin: 0;
      max-width: 620px;
      font-size: 56px;
      line-height: 0.92;
      letter-spacing: -0.08em;
      font-weight: 950;
      color: var(--text);
      text-wrap: balance;
    }

    .subtitle {
      margin: 18px 0 0;
      max-width: 510px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.55;
      text-wrap: balance;
    }

    .panel-wrap {
      position: relative;
    }

    .panel-glow {
      position: absolute;
      inset: 16px;
      border-radius: var(--radius-xl);
      background: rgba(91, 120, 255, 0.18);
      filter: blur(42px);
      z-index: -1;
      pointer-events: none;
    }

    .panel {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      background: var(--glass);
      backdrop-filter: blur(24px);
      box-shadow:
        0 30px 90px rgba(0, 0, 0, 0.52),
        inset 0 1px 0 rgba(255,255,255,0.045);
      padding: 10px;
      animation: fadeUp 480ms ease both;
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.055), transparent 32%),
        radial-gradient(circle at 50% 0%, rgba(124, 140, 255, 0.12), transparent 45%);
    }

    .panel-header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 10px 15px;
    }

    .panel-title {
      font-size: 11.5px;
      font-weight: 900;
      color: var(--blue-soft);
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }

    .panel-helper {
      font-size: 11.5px;
      color: var(--muted-soft);
      text-align: right;
      font-weight: 750;
    }

    .modules {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 9px;
    }

    .module-card {
      position: relative;
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) 34px;
      gap: 13px;
      align-items: center;
      min-height: 92px;
      padding: 13px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.54);
      color: inherit;
      text-decoration: none;
      opacity: 0;
      transform: translateY(10px);
      animation: cardIn 420ms ease both;
      animation-delay: var(--delay);
      box-shadow:
        0 14px 42px rgba(0,0,0,0.28),
        inset 0 1px 0 rgba(255,255,255,0.035);
      transition:
        transform 170ms ease,
        border-color 170ms ease,
        background 170ms ease,
        box-shadow 170ms ease;
    }

    .module-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04), transparent 38%);
      pointer-events: none;
    }

    .module-card:hover {
      transform: translateY(-2px) scale(1.01);
      border-color: var(--border-strong);
      background: rgba(30, 41, 59, 0.66);
      box-shadow:
        0 20px 64px rgba(30, 64, 175, 0.18),
        inset 0 1px 0 rgba(255,255,255,0.055);
    }

    .module-icon {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 35% 20%, rgba(255,255,255,0.16), transparent 32%),
        rgba(124, 140, 255, 0.09);
      border: 1px solid rgba(198, 208, 255, 0.13);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.045);
      overflow: hidden;
    }

    .module-icon span {
      font-size: 22px;
      line-height: 1;
      filter: drop-shadow(0 0 12px rgba(124, 140, 255, 0.42));
    }

    .module-main {
      min-width: 0;
    }

    .module-topline {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }

    .module-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 7px;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.08);
      border: 1px solid rgba(34, 197, 94, 0.13);
      color: #bbf7d0;
      font-size: 9.5px;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.035em;
    }

    .module-status::before {
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.72);
    }

    .module-title {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: var(--text);
      margin-bottom: 5px;
    }

    .module-description {
      font-size: 13px;
      line-height: 1.38;
      color: var(--muted);
    }

    .module-arrow {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue-soft);
      font-size: 26px;
      font-weight: 500;
      background: rgba(124, 140, 255, 0.08);
      border: 1px solid rgba(198, 208, 255, 0.12);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
      transition: transform 160ms ease, background 160ms ease;
    }

    .module-card:hover .module-arrow {
      transform: translateX(2px);
      background: rgba(124, 140, 255, 0.13);
    }

    .empty {
      position: relative;
      z-index: 1;
      padding: 28px 18px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }

    .footer {
      margin-top: 18px;
      text-align: center;
      font-size: 12px;
      color: var(--muted-soft);
      animation: fadeUp 620ms ease both;
    }

    .secure-row {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 8px 11px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.035);
      backdrop-filter: blur(14px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
    }

    .secure-lock {
      font-size: 12px;
      line-height: 1;
    }

    .powered-by {
      margin-top: 10px;
      font-size: 11px;
      color: rgba(148, 163, 184, 0.78);
    }

    .powered-by strong {
      color: var(--blue-soft);
      font-weight: 850;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pageIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes cardIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 680px) {
      .topbar {
        margin-bottom: 58px;
      }

      h1 {
        font-size: 43px;
      }

      .background-ring {
        width: 760px;
        height: 760px;
        bottom: -410px;
      }
    }

    @media (max-width: 520px) {
      .page {
        padding: 20px 10px 30px;
      }

      .brand-name {
        max-width: 175px;
      }

      .system-pill {
        display: none;
      }

      .topbar {
        margin-bottom: 50px;
      }

      h1 {
        font-size: 36px;
      }

      .subtitle {
        font-size: 14px;
      }

      .panel {
        border-radius: 24px;
        padding: 8px;
      }

      .panel-header {
        align-items: flex-start;
        flex-direction: column;
        padding: 8px 8px 13px;
      }

      .panel-helper {
        text-align: left;
      }

      .module-card {
        grid-template-columns: 46px minmax(0, 1fr) 30px;
        min-height: 94px;
        padding: 12px;
        gap: 12px;
      }

      .module-icon {
        width: 46px;
        height: 46px;
        border-radius: 15px;
      }

      .module-title {
        font-size: 15.5px;
      }

      .module-description {
        font-size: 12.5px;
      }

      .module-arrow {
        width: 30px;
        height: 30px;
      }
    }
  </style>
</head>

<body>
  <div class="background-ring"></div>

  <div id="appLoader" class="app-loader hidden">
    <div class="app-spinner"></div>
  </div>

  <main class="page">
    <div class="shell">
      <header class="topbar">
        <div class="brand-lockup">
          <div class="brand-mark"></div>
          <div class="brand-text">
            <div class="brand-name">${safeBrand}</div>
            <div class="brand-sub">Portal operativo</div>
          </div>
        </div>

        <div class="system-pill">
          <span class="system-dot"></span>
          <span>Online</span>
        </div>
      </header>

      <section class="hero">
        <div class="eyebrow">Centro digital</div>
        <h1>${safeTitle}</h1>
        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <div class="panel-wrap">
        <div class="panel-glow"></div>

        <section class="panel">
          <div class="panel-header">
            <div class="panel-title">Módulos disponibles</div>
            <div class="panel-helper">${activeModules.length} activos</div>
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
        <div class="secure-row">
          <span class="secure-lock">🔒</span>
          <span>Acceso seguro generado para tu atención</span>
        </div>

        <div class="powered-by">
          Desarrollado por <strong>Automatiza Fácil</strong>
        </div>
      </div>
    </div>
  </main>

  <script>
    window.AppLoader = {
      show() {
        const loader = document.getElementById("appLoader");
        if (loader) loader.classList.remove("hidden");
      },

      hide() {
        const loader = document.getElementById("appLoader");
        if (loader) loader.classList.add("hidden");
      }
    };

    function bindLoadingLinks() {
      document.querySelectorAll("[data-loading-link]").forEach((link) => {
        link.addEventListener("click", () => {
          window.AppLoader.show();
        });
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      window.AppLoader.hide();
      bindLoadingLinks();
    });

    window.addEventListener("pageshow", () => {
      window.AppLoader.hide();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        window.AppLoader.hide();
      }
    });
  </script>
</body>
</html>`;
}