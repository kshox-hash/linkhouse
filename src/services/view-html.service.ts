import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeSuccessMessage = escapeHtml(
    record.config.successMessage || "Solicitud enviada correctamente."
  );

  const configJson = JSON.stringify(record.config);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Cotizador online</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500&family=Google+Sans+Display:wght@400;500&display=swap" rel="stylesheet" />

<style>
:root {
  /* Google Material You — dark scheme */
  --bg:           #1a1c1e;
  --surface-1:    #21242a;
  --surface-2:    #272b32;
  --surface-3:    #2d3139;

  --on-bg:        #e2e2e6;
  --on-surface:   #e2e2e6;
  --on-surface-v: #c5c6cb;
  --outline:      rgba(255,255,255,0.08);
  --outline-v:    rgba(255,255,255,0.05);

  --primary:      #aac7ff;
  --primary-c:    #002e6a;
  --primary-bg:   #1b2d45;

  --secondary:    #bfc8db;
  --secondary-bg: #232c3b;

  --muted:        #8d9199;
  --muted-2:      #5f6368;

  --green:        #6dd58c;
  --green-bg:     #0a3818;
  --red:          #ffb4ab;
  --red-bg:       #690005;

  --radius-s:  12px;
  --radius-m:  16px;
  --radius-l:  20px;
  --radius-xl: 28px;

  --page-max: 840px;
  --safe-b: env(safe-area-inset-bottom, 0px);

  /* elevation via box-shadow (Material 3) */
  --elev-1: 0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15);
  --elev-2: 0 1px 2px rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15);
  --elev-3: 0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.3);
}

*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin: 0; padding: 0;
}

html, body { min-height: 100vh; }

body {
  background: var(--bg);
  color: var(--on-bg);
  font-family: "Google Sans", system-ui, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

button, input, textarea { font: inherit; color: inherit; }
button { touch-action: manipulation; cursor: pointer; }

/* ─── PAGE ─── */

.page {
  min-height: 100vh;
  padding: 0 0 calc(32px + var(--safe-b));
}

.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 16px;
}

/* ─── TOPBAR ─── */

.topbar {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-logo svg {
  width: 18px;
  height: 18px;
  fill: var(--primary);
}

.topbar-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface-v);
  letter-spacing: 0.01em;
}

.topbar-chip {
  margin-left: auto;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--primary-bg);
  color: var(--primary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* ─── HERO ─── */

.hero {
  padding: 24px 0 36px;
}

.hero-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.hero-title {
  font-family: "Google Sans Display", "Google Sans", sans-serif;
  font-size: clamp(28px, 6vw, 40px);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.12;
  color: var(--on-surface);
  max-width: 560px;
}

.hero-sub {
  margin-top: 12px;
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
  max-width: 460px;
}

/* ─── CONTENT ─── */

.content-flow {
  display: grid;
  gap: 12px;
}

/* ─── CARD SHELL ─── */

.card {
  background: var(--surface-1);
  border-radius: var(--radius-xl);
  box-shadow: var(--elev-1);
  overflow: hidden;
}

/* ─── SECTION HEADER ─── */

.section-header {
  padding: 20px 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.section-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.section-title {
  font-size: 17px;
  font-weight: 500;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.badge {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--primary-bg);
  color: var(--primary);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  margin-top: 2px;
}

/* ─── SEARCH ─── */

.search-wrap {
  padding: 0 12px 12px;
}

.search-inner {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 0;
  border-radius: 999px;
  background: var(--surface-2);
  padding: 0 6px 0 16px;
}

.search-icon {
  width: 20px;
  flex-shrink: 0;
  color: var(--muted);
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.search-icon svg { width: 18px; height: 18px; display: block; }

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 14px;
}

.search-input::placeholder { color: var(--muted-2); }

/* ─── PRODUCT LIST ─── */

.products-body {
  padding: 0 8px 8px;
}

.products-body.scrollable {
  max-height: min(52vh, 600px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
}

.products-body.scrollable::-webkit-scrollbar { width: 4px; }
.products-body.scrollable::-webkit-scrollbar-track { background: transparent; }
.products-body.scrollable::-webkit-scrollbar-thumb {
  background: var(--surface-3);
  border-radius: 999px;
}

.product-list { display: grid; gap: 2px; }

/* ─── PRODUCT ITEM ─── */

.product-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 12px 12px 12px 14px;
  border-radius: var(--radius-m);
  transition: background 120ms ease;
}

.product-item:hover { background: var(--surface-2); }

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  margin-bottom: 2px;
}

.product-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--primary);
  white-space: nowrap;
  margin-top: 3px;
}

/* ─── STEPPER ─── */

.stepper {
  display: flex;
  align-items: center;
  height: 36px;
  border-radius: 999px;
  background: var(--surface-3);
  overflow: hidden;
}

.step-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--on-surface-v);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 100ms ease, color 100ms ease;
}

.step-btn:hover { background: rgba(255,255,255,0.06); color: var(--on-surface); }
.step-btn:active { background: rgba(255,255,255,0.1); }

.step-val {
  width: 32px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--on-surface);
  user-select: none;
}

.qty-hidden { display: none; }

/* ─── TOTAL ─── */

.total-bar {
  margin: 8px 8px 8px;
  padding: 16px 18px;
  border-radius: var(--radius-l);
  background: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.total-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.total-amount {
  font-family: "Google Sans Display", "Google Sans", sans-serif;
  font-size: clamp(22px, 6vw, 28px);
  font-weight: 400;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

/* ─── FORM CARD ─── */

.form-card {
  background: var(--surface-1);
  border-radius: var(--radius-xl);
  box-shadow: var(--elev-1);
  overflow: hidden;
}

.form-head {
  padding: 20px 20px 20px;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  align-items: center;
}

.form-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--secondary-bg);
  color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-avatar svg { width: 22px; height: 22px; }

.form-head-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.form-head-sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.form-divider {
  height: 1px;
  background: var(--outline);
  margin: 0 20px 20px;
}

.form-body {
  padding: 0 20px 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.full { grid-column: 1 / -1; }

.label {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

input, textarea {
  width: 100%;
  border: none;
  outline: none;
  background: var(--surface-2);
  color: var(--on-surface);
  border-radius: var(--radius-m);
  padding: 14px 15px;
  font-size: 14px;
  transition: background 120ms ease;
}

input::placeholder, textarea::placeholder { color: var(--muted-2); }
input:focus, textarea:focus { background: var(--surface-3); }

textarea {
  min-height: 92px;
  resize: vertical;
}

/* ─── TEXT BLOCK ─── */

.text-block {
  background: var(--surface-1);
  border-radius: var(--radius-xl);
  padding: 18px 20px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.6;
  box-shadow: var(--elev-1);
}

/* ─── SUBMIT ─── */

.submit-wrap {
  position: sticky;
  bottom: calc(12px + var(--safe-b));
  z-index: 10;
}

.submit-btn {
  width: 100%;
  min-height: 56px;
  border: none;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-c);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
  box-shadow: var(--elev-3);
  transition: filter 120ms ease, transform 80ms ease;
}

.submit-btn:hover { filter: brightness(1.06); }
.submit-btn:active { transform: scale(0.985); filter: brightness(0.95); }
.submit-btn:disabled { opacity: 0.38; cursor: not-allowed; filter: none; transform: none; }

/* ─── MESSAGE ─── */

.message {
  display: none;
  padding: 16px 18px;
  border-radius: var(--radius-l);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
}

.message.success { display: block; background: var(--green-bg); color: var(--green); }
.message.error   { display: block; background: var(--red-bg);   color: var(--red); }

/* ─── EXPIRES ─── */

.expires {
  margin-top: 20px;
  text-align: center;
  color: var(--muted-2);
  font-size: 11px;
  line-height: 1.5;
}

/* ─── RESPONSIVE ─── */

@media (min-width: 640px) {
  .shell { padding: 0 24px; }
  .topbar { height: 72px; }
  .hero { padding: 28px 0 44px; }
  .content-flow { gap: 14px; }
}

@media (max-width: 520px) {
  .form-grid { grid-template-columns: 1fr; }
  .products-body.scrollable { max-height: 48vh; }
}

@media (max-width: 380px) {
  .hero-title { font-size: 26px; }

  .section-header { flex-direction: column; }

  .product-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .stepper { justify-self: start; }

  .total-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .total-amount { font-size: 24px; }

  .form-head { grid-template-columns: 1fr; }
  .form-avatar { display: none; }
}
</style>
</head>

<body>
<main class="page">
  <div class="shell">

    <header class="topbar">
      <div class="topbar-logo">
        <svg viewBox="0 0 24 24"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95M11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5V2.05Z"/></svg>
      </div>
      <span class="topbar-name">Amaru Electric</span>
      <span class="topbar-chip">Cotizador</span>
    </header>

    <section class="hero">
      <div class="hero-label">Cotizador online</div>
      <h1 class="hero-title">Solicita tu cotización</h1>
      <p class="hero-sub">Selecciona los productos que necesitas y envía tu solicitud en segundos.</p>
    </section>

    <div id="content" class="content-flow"></div>
    <div id="message" class="message" style="margin-top:12px"></div>

    <p class="expires">
      Este enlace expira el <span id="expiresAt"></span>
    </p>

  </div>
</main>

<script>
const token = ${JSON.stringify(record.token)};
const config = ${configJson};
const successMessage = ${JSON.stringify(safeSuccessMessage)};
const expiresAt = ${JSON.stringify(
    new Date(record.expiresAt).toLocaleString("es-CL")
  )};

const contentEl = document.getElementById("content");
const messageEl = document.getElementById("message");

document.getElementById("expiresAt").textContent = expiresAt;

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function showMessage(type, text) {
  messageEl.className = "message " + type;
  messageEl.textContent = text;
  messageEl.style.display = "block";
  messageEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateSelectedCount() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
  let selected = 0;
  inputs.forEach((inp) => { if (Number(inp.value || 0) > 0) selected++; });
  const badge = document.getElementById("productsSelected");
  if (badge) badge.textContent = selected === 1 ? "1 seleccionado" : selected + " seleccionados";
}

function updateTotal() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
  let total = 0;
  inputs.forEach((inp) => { total += Number(inp.value || 0) * Number(inp.dataset.productPrice || 0); });
  const el = document.getElementById("totalValue");
  if (el) el.textContent = formatCurrency(total);
  updateSelectedCount();
}

/* ── RENDER TEXT ── */
function renderText(c) {
  const d = document.createElement("div");
  d.className = "text-block";
  d.textContent = c.value || "";
  return d;
}

/* ── RENDER PRODUCTS ── */
function renderProducts(c) {
  const wrap = document.createElement("div");
  wrap.className = "card";

  /* header */
  const hdr = document.createElement("div");
  hdr.className = "section-header";
  hdr.innerHTML = \`
    <div>
      <div class="section-label">Catálogo</div>
      <div class="section-title">Productos</div>
    </div>
    <div class="badge" id="productsSelected">0 seleccionados</div>
  \`;
  wrap.appendChild(hdr);

  /* search */
  const sw = document.createElement("div");
  sw.className = "search-wrap";
  sw.innerHTML = \`
    <div class="search-inner">
      <div class="search-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input class="search-input" id="productsSearch" type="text" placeholder="Buscar productos" autocomplete="off" />
    </div>
  \`;
  wrap.appendChild(sw);

  /* list */
  const body = document.createElement("div");
  body.className = "products-body" + (Array.isArray(c.items) && c.items.length >= 20 ? " scrollable" : "");
  const list = document.createElement("div");
  list.className = "product-list";
  list.id = "productsList";

  if (!Array.isArray(c.items) || c.items.length === 0) {
    list.innerHTML = "<div style='padding:16px;color:var(--muted);font-size:13px;text-align:center'>No hay productos disponibles.</div>";
    body.appendChild(list);
    wrap.appendChild(body);
    return wrap;
  }

  c.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-item";
    card.dataset.search = String((item.name || "") + " " + (item.description || "")).toLowerCase();

    const info = document.createElement("div");
    info.innerHTML = \`
      <div class="product-name">\${item.name || "Producto"}</div>
      \${item.description ? \`<div class="product-desc">\${item.description}</div>\` : ""}
      <div class="product-price">\${formatCurrency(item.price || 0)}</div>
    \`;

    const stepper = document.createElement("div");
    stepper.className = "stepper";

    const minus = document.createElement("button");
    minus.className = "step-btn";
    minus.type = "button";
    minus.setAttribute("aria-label", "Disminuir");
    minus.innerHTML = "<svg width='16' height='16' viewBox='0 0 24 24'><path d='M5 12h14' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>";

    const valEl = document.createElement("div");
    valEl.className = "step-val";
    valEl.textContent = "0";

    const plus = document.createElement("button");
    plus.className = "step-btn";
    plus.type = "button";
    plus.setAttribute("aria-label", "Aumentar");
    plus.innerHTML = "<svg width='16' height='16' viewBox='0 0 24 24'><path d='M12 5v14M5 12h14' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>";

    const hidden = document.createElement("input");
    hidden.type = "number";
    hidden.min = "0";
    hidden.value = "0";
    hidden.className = "qty-hidden";
    hidden.dataset.productId = item.id;
    hidden.dataset.productPrice = String(item.price || 0);
    hidden.dataset.kind = "product-quantity";

    function sync(v) {
      const s = Math.max(0, Number(v) || 0);
      hidden.value = String(s);
      valEl.textContent = String(s);
      updateTotal();
    }

    minus.addEventListener("click", () => sync(Number(hidden.value) - 1));
    plus.addEventListener("click", () => sync(Number(hidden.value) + 1));

    stepper.appendChild(minus);
    stepper.appendChild(valEl);
    stepper.appendChild(plus);
    stepper.appendChild(hidden);

    card.appendChild(info);
    card.appendChild(stepper);
    list.appendChild(card);
  });

  body.appendChild(list);
  wrap.appendChild(body);

  /* total */
  const totalRow = document.createElement("div");
  totalRow.className = "total-bar";
  totalRow.innerHTML = \`
    <div class="total-label">Total estimado</div>
    <div class="total-amount" id="totalValue">\${formatCurrency(0)}</div>
  \`;
  wrap.appendChild(totalRow);

  /* search filter */
  sw.querySelector("#productsSearch").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    list.querySelectorAll(".product-item").forEach((el) => {
      el.style.display = el.dataset.search.includes(q) ? "grid" : "none";
    });
  });

  return wrap;
}

/* ── RENDER FORM ── */
function renderForm(c) {
  const wrap = document.createElement("div");
  wrap.className = "form-card";

  const head = document.createElement("div");
  head.className = "form-head";
  head.innerHTML = \`
    <div class="form-avatar">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5Z"/>
      </svg>
    </div>
    <div>
      <div class="form-head-title">Mis datos</div>
      <div class="form-head-sub">Completa tu información de contacto</div>
    </div>
  \`;
  wrap.appendChild(head);

  const div = document.createElement("div");
  div.className = "form-divider";
  wrap.appendChild(div);

  const body = document.createElement("div");
  body.className = "form-body";

  const grid = document.createElement("div");
  grid.className = "form-grid";

  c.fields.forEach((field) => {
    const fw = document.createElement("div");
    fw.className = "field" + (field.inputType === "textarea" ? " full" : "");

    const lbl = document.createElement("label");
    lbl.className = "label";
    lbl.textContent = field.label + (field.required ? " *" : "");

    const inp = field.inputType === "textarea"
      ? document.createElement("textarea")
      : document.createElement("input");

    if (field.inputType !== "textarea") inp.type = field.inputType || "text";
    inp.name = field.name;
    inp.dataset.kind = "form-field";
    inp.placeholder = field.placeholder || "";
    if (field.required) inp.required = true;

    fw.appendChild(lbl);
    fw.appendChild(inp);
    grid.appendChild(fw);
  });

  body.appendChild(grid);
  wrap.appendChild(body);
  return wrap;
}

/* ── RENDER BUTTON ── */
function renderButton(c) {
  const wrap = document.createElement("div");
  wrap.className = "submit-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "submit-btn";
  btn.textContent = c.label || "Enviar cotización";
  btn.addEventListener("click", () => onSubmit(btn, c.label || "Enviar cotización"));

  wrap.appendChild(btn);
  return wrap;
}

function renderComponent(c) {
  switch (c.type) {
    case "text":     return renderText(c);
    case "products": return renderProducts(c);
    case "form":     return renderForm(c);
    case "button":   return renderButton(c);
    default:         return document.createElement("div");
  }
}

function getPriority(c) {
  return { form: 1, products: 2, text: 3, button: 4 }[c.type] ?? 9;
}

/* ── SUBMIT ── */
async function onSubmit(btn, originalLabel) {
  const selectedItems = [];
  document.querySelectorAll('[data-kind="product-quantity"]').forEach((inp) => {
    const qty = Number(inp.value || 0);
    if (qty > 0 && inp.dataset.productId) selectedItems.push({ productId: inp.dataset.productId, quantity: qty });
  });

  if (selectedItems.length === 0) {
    showMessage("error", "Selecciona al menos un producto.");
    return;
  }

  const customer = {};
  for (const field of document.querySelectorAll('[data-kind="form-field"]')) {
    const val = String(field.value || "").trim();
    if (field.required && !val) {
      field.focus();
      showMessage("error", "Completa los campos obligatorios.");
      return;
    }
    customer[field.name] = val;
  }

  try {
    btn.disabled = true;
    btn.textContent = "Enviando…";

    const res = await fetch("/api/runtime-links/" + token + "/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, items: selectedItems, raw: { submittedAtClient: new Date().toISOString() } })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage("error", data.message || "No se pudo enviar la solicitud.");
      btn.disabled = false;
      btn.textContent = originalLabel;
      return;
    }

    showMessage("success", data.message || successMessage);
  } catch (_) {
    showMessage("error", "Ocurrió un error al enviar la solicitud.");
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
}

[...config.components]
  .sort((a, b) => getPriority(a) - getPriority(b))
  .forEach((c) => contentEl.appendChild(renderComponent(c)));

updateTotal();
</script>

</body>
</html>`;
}