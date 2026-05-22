import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Cotización Inteligente");

  const safeSubtitle = escapeHtml(
    record.config.subtitle || "Selecciona productos y envía tu solicitud."
  );

  const safeSuccessMessage = escapeHtml(
    record.config.successMessage || "Solicitud enviada correctamente."
  );

  const configJson = JSON.stringify(record.config);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${safeTitle}</title>

<style>
:root {
  --bg: #202124;

  --surface: #0d0e13;
  --surface-2: #151720;
  --surface-3: #1b1e29;
  --surface-soft: #242734;
  --surface-block: #12131a;

  --text: #d8dbe2;
  --text-strong: #e8eaed;
  --text-soft: #c4c8d4;

  --muted: #a6abb7;
  --muted-soft: #808693;
  --muted-2: #646b78;

  --link: #bfc7ff;
  --link-soft: #252941;

  --green: #81c995;
  --green-soft: #1d3428;

  --red: #f28b82;
  --red-soft: #34201f;

  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-xl: 30px;

  --page-max: 720px;
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
  background: var(--bg);
  color: var(--text);
  font-family:
    "Google Sans",
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea {
  font: inherit;
}

button {
  color: inherit;
}

.page {
  min-height: 100vh;
  padding: 18px 12px 28px;
  background: var(--bg);
}

.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
}

/* HEADER */

.topbar {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.brand {
  color: var(--text-strong);
  font-size: 19px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.045em;
  opacity: 0.94;
}

.hero {
  text-align: center;
  padding: 4px 10px 26px;
}

.hero-kicker {
  width: max-content;
  max-width: 100%;
  margin: 0 auto 14px;
  padding: 7px 13px;
  border-radius: 999px;
  background: var(--link-soft);
  color: var(--link);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

h1 {
  margin: 0 auto;
  max-width: 620px;
  color: var(--text-strong);
  font-size: clamp(31px, 5.2vw, 42px);
  line-height: 1.08;
  letter-spacing: -0.055em;
  font-weight: 500;
  text-wrap: balance;
}

.subtitle {
  margin: 15px auto 0;
  max-width: 520px;
  color: var(--muted);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
}

/* PANEL */

.panel {
  background: transparent;
  border-radius: var(--radius-xl);
  padding: 0;
}

.content-flow {
  display: grid;
  gap: 18px;
}

/* PRODUCTS WRAPPER */

.products-section {
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: var(--radius-xl);
  background: var(--surface-block);
}

.products-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 14px;
}

.products-title {
  color: var(--text-strong);
  font-size: 22px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.045em;
}

.products-subtitle {
  margin-top: 5px;
  color: var(--muted-soft);
  font-size: 13px;
  font-weight: 400;
}

.products-selected {
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--link-soft);
  color: var(--link);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* SEARCH */

.search-shell {
  height: 54px;
  display: grid;
  grid-template-columns: 1fr 44px;
  align-items: center;
  border-radius: 999px;
  background: var(--surface);
  padding: 0 6px 0 18px;
}

.search-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  padding: 0;
  font-size: 15px;
  font-weight: 400;
}

.search-input::placeholder {
  color: var(--muted-soft);
}

.search-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-3);
  color: var(--muted);
  font-size: 17px;
}

/* SCROLL AREA */

.products-scroll {
  border-radius: var(--radius-lg);
  background: var(--surface);
  overflow: hidden;
}

.products-list {
  display: grid;
  gap: 10px;
  max-height: 520px;
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: #3c4155 transparent;
}

.products-list::-webkit-scrollbar {
  width: 6px;
}

.products-list::-webkit-scrollbar-track {
  background: transparent;
}

.products-list::-webkit-scrollbar-thumb {
  background: #3c4155;
  border-radius: 999px;
}

/* PRODUCT CARD */

.product-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 78px;
  padding: 15px 16px;
  border-radius: 20px;
  background: var(--surface-2);
  border: none;
  transition:
    background 140ms ease,
    transform 140ms ease;
}

.product-card:hover {
  background: var(--surface-3);
  transform: translateY(-1px);
}

.product-main {
  min-width: 0;
}

.product-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 5px;
}

.product-name {
  margin: 0;
  color: var(--text-strong);
  font-size: 14.5px;
  line-height: 1.24;
  font-weight: 500;
  letter-spacing: -0.025em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: var(--link);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.product-description {
  margin: 0;
  color: var(--muted-soft);
  font-size: 12px;
  line-height: 1.35;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* QTY */

.qty-box {
  display: grid;
  grid-template-columns: 32px 36px 32px;
  height: 36px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--surface);
  border: none;
}

.qty-btn {
  border: none;
  background: transparent;
  color: var(--text-soft);
  font-size: 17px;
  font-weight: 400;
  cursor: pointer;
}

.qty-btn:hover {
  background: var(--surface-3);
}

.qty-value {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-strong);
  font-size: 13px;
  font-weight: 500;
}

.qty-hidden {
  display: none;
}

/* TOTAL */

.total-card {
  min-height: 76px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: var(--link-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.total-title {
  color: var(--muted);
  font-size: 13px;
  font-weight: 400;
}

.total-value {
  color: var(--link);
  font-size: clamp(24px, 4vw, 30px);
  font-weight: 520;
  letter-spacing: -0.05em;
}

/* FORM */

.form-collapse {
  border-radius: var(--radius-xl);
  background: var(--surface);
  border: none;
  overflow: hidden;
}

.form-toggle {
  width: 100%;
  min-height: 72px;
  border: none;
  background: transparent;
  color: var(--text);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.form-toggle-left {
  display: flex;
  align-items: center;
  gap: 13px;
}

.form-icon {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background: var(--link-soft);
  color: var(--link);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-title {
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.form-subtitle {
  margin-top: 4px;
  color: var(--muted-soft);
  font-size: 12px;
  font-weight: 400;
}

.form-arrow {
  font-size: 22px;
  color: var(--muted);
  font-weight: 400;
  transition: transform 160ms ease;
}

.form-collapse.open .form-arrow {
  transform: rotate(180deg);
}

.form-content {
  display: none;
  padding: 0 16px 16px;
}

.form-collapse.open .form-content {
  display: block;
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

.field.full {
  grid-column: 1 / -1;
}

.label {
  color: var(--muted);
  font-size: 12px;
  font-weight: 400;
}

input,
textarea {
  width: 100%;
  border: none;
  outline: none;
  background: var(--surface-2);
  color: var(--text);
  border-radius: 14px;
  padding: 13px;
  font-size: 14px;
  font-weight: 400;
}

input::placeholder,
textarea::placeholder {
  color: var(--muted-soft);
}

input:focus,
textarea:focus {
  background: var(--surface-3);
}

textarea {
  min-height: 90px;
  resize: vertical;
}

/* BUTTON */

.submit-wrap {
  display: grid;
  gap: 8px;
}

.submit-btn {
  width: 100%;
  min-height: 56px;
  border: none;
  border-radius: 22px;
  background: #40518e;
  color: #e7eaff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    background 140ms ease;
}

.submit-btn:hover {
  background: #485b9d;
}

.submit-btn:active {
  transform: scale(0.99);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MESSAGE */

.message {
  display: none;
  padding: 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.45;
  white-space: pre-wrap;
}

.message.success {
  display: block;
  background: var(--green-soft);
  color: var(--green);
}

.message.error {
  display: block;
  background: var(--red-soft);
  color: var(--red);
}

.expires {
  margin-top: 12px;
  text-align: center;
  color: var(--muted-soft);
  font-size: 10px;
}

/* MOBILE */

@media (max-width: 640px) {
  .page {
    padding: 14px 10px 18px;
  }

  .topbar {
    min-height: 46px;
    margin-bottom: 12px;
  }

  .brand {
    font-size: 19px;
  }

  .hero {
    padding: 4px 4px 22px;
  }

  .hero-kicker {
    margin-bottom: 13px;
  }

  h1 {
    font-size: 34px;
    line-height: 1.08;
  }

  .subtitle {
    font-size: 14px;
  }

  .products-section {
    padding: 14px;
    gap: 14px;
  }

  .products-title {
    font-size: 20px;
  }

  .products-list {
    max-height: 480px;
    padding: 10px;
  }

  .product-card {
    min-height: 74px;
    padding: 13px;
  }

  .product-name {
    font-size: 14px;
  }

  .product-description {
    font-size: 11.5px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    min-height: 54px;
  }
}

@media (max-width: 390px) {
  h1 {
    font-size: 31px;
  }

  .products-top {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .products-selected {
    width: max-content;
  }

  .product-card {
    grid-template-columns: 1fr;
  }

  .qty-box {
    justify-self: end;
  }
}
</style>
</head>

<body>
<main class="page">
  <div class="shell">

    <header class="topbar">
      <div class="brand">Amaru Electric</div>
    </header>

    <section class="hero">
      <div class="hero-kicker">Cotizador online</div>
      <h1>${safeTitle}</h1>
      <p class="subtitle">${safeSubtitle}</p>
    </section>

    <section class="panel">
      <div id="content" class="content-flow"></div>
      <div id="message" class="message"></div>

      <div class="expires">
        Este enlace expira el <span id="expiresAt"></span>
      </div>
    </section>

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
}

function updateSelectedCount() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
  let selected = 0;

  inputs.forEach((input) => {
    if (Number(input.value || 0) > 0) selected++;
  });

  const badge = document.getElementById("productsSelected");

  if (badge) {
    badge.textContent =
      selected === 1 ? "1 seleccionado" : selected + " seleccionados";
  }
}

function updateTotal() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
  let total = 0;

  inputs.forEach((input) => {
    total += Number(input.value || 0) * Number(input.dataset.productPrice || 0);
  });

  const totalValue = document.getElementById("totalValue");

  if (totalValue) totalValue.textContent = formatCurrency(total);

  updateSelectedCount();
}

function renderText(component) {
  const box = document.createElement("div");
  box.style.padding = "14px";
  box.style.borderRadius = "18px";
  box.style.background = "#0d0e13";
  box.style.color = "#a6abb7";
  box.style.fontSize = "14px";
  box.style.lineHeight = "1.5";
  box.textContent = component.value || "";
  return box;
}

function renderProducts(component) {
  const section = document.createElement("section");
  section.className = "products-section";

  section.innerHTML = \`
    <div class="products-top">
      <div>
        <div class="products-title">Productos</div>
        <div class="products-subtitle">Busca y selecciona productos</div>
      </div>

      <div class="products-selected" id="productsSelected">
        0 seleccionados
      </div>
    </div>

    <div class="search-shell">
      <input
        class="search-input"
        id="productsSearch"
        type="text"
        placeholder="Buscar productos"
      />

      <div class="search-icon">⌕</div>
    </div>

    <div class="products-scroll">
      <div class="products-list" id="productsList"></div>
    </div>

    <div class="total-card">
      <div class="total-title">Total estimado</div>
      <div class="total-value" id="totalValue">\${formatCurrency(0)}</div>
    </div>
  \`;

  const list = section.querySelector("#productsList");

  if (!Array.isArray(component.items) || component.items.length === 0) {
    list.innerHTML =
      "<div style='padding:16px;color:#a6abb7;font-size:13px'>No hay productos disponibles.</div>";
    return section;
  }

  component.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.search =
      String((item.name || "") + " " + (item.description || "")).toLowerCase();

    const main = document.createElement("div");
    main.className = "product-main";

    const top = document.createElement("div");
    top.className = "product-top";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = item.name || "Producto";

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatCurrency(item.price || 0);

    top.appendChild(name);
    top.appendChild(price);

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = item.description || "Selecciona cantidad.";

    main.appendChild(top);
    main.appendChild(description);

    const qtyBox = document.createElement("div");
    qtyBox.className = "qty-box";

    const minusBtn = document.createElement("button");
    minusBtn.className = "qty-btn";
    minusBtn.type = "button";
    minusBtn.textContent = "−";

    const valueEl = document.createElement("div");
    valueEl.className = "qty-value";
    valueEl.textContent = "0";

    const plusBtn = document.createElement("button");
    plusBtn.className = "qty-btn";
    plusBtn.type = "button";
    plusBtn.textContent = "+";

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "number";
    hiddenInput.min = "0";
    hiddenInput.value = "0";
    hiddenInput.className = "qty-hidden";
    hiddenInput.dataset.productId = item.id;
    hiddenInput.dataset.productPrice = String(item.price || 0);
    hiddenInput.dataset.kind = "product-quantity";

    function syncQty(value) {
      const safe = Math.max(0, Number(value) || 0);
      hiddenInput.value = String(safe);
      valueEl.textContent = String(safe);
      updateTotal();
    }

    minusBtn.addEventListener("click", () => {
      syncQty(Number(hiddenInput.value) - 1);
    });

    plusBtn.addEventListener("click", () => {
      syncQty(Number(hiddenInput.value) + 1);
    });

    qtyBox.appendChild(minusBtn);
    qtyBox.appendChild(valueEl);
    qtyBox.appendChild(plusBtn);
    qtyBox.appendChild(hiddenInput);

    card.appendChild(main);
    card.appendChild(qtyBox);

    list.appendChild(card);
  });

  const searchInput = section.querySelector("#productsSearch");

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();

    list.querySelectorAll(".product-card").forEach((card) => {
      const match = card.dataset.search.includes(value);
      card.style.display = match ? "grid" : "none";
    });
  });

  return section;
}

function renderForm(component) {
  const wrap = document.createElement("div");
  wrap.className = "form-collapse";

  wrap.innerHTML = \`
    <button class="form-toggle" type="button">
      <div class="form-toggle-left">
        <div class="form-icon">👤</div>

        <div>
          <div class="form-title">Mis datos</div>
          <div class="form-subtitle">Completa tu información</div>
        </div>
      </div>

      <div class="form-arrow">⌄</div>
    </button>

    <div class="form-content">
      <div class="form-grid"></div>
    </div>
  \`;

  const toggle = wrap.querySelector(".form-toggle");

  toggle.addEventListener("click", () => {
    wrap.classList.toggle("open");
  });

  const grid = wrap.querySelector(".form-grid");

  component.fields.forEach((field) => {
    const fieldWrap = document.createElement("div");
    fieldWrap.className = "field";

    if (field.inputType === "textarea") fieldWrap.classList.add("full");

    const label = document.createElement("label");
    label.className = "label";
    label.textContent = field.label + (field.required ? " *" : "");

    const input =
      field.inputType === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");

    if (field.inputType !== "textarea") {
      input.type = field.inputType || "text";
    }

    input.name = field.name;
    input.dataset.kind = "form-field";
    input.placeholder = field.placeholder || "";

    if (field.required) input.required = true;

    fieldWrap.appendChild(label);
    fieldWrap.appendChild(input);

    grid.appendChild(fieldWrap);
  });

  return wrap;
}

function renderButton(component) {
  const wrap = document.createElement("div");
  wrap.className = "submit-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "submit-btn";
  btn.textContent = component.label || "Enviar solicitud";

  btn.addEventListener("click", () => {
    onSubmit(btn, component.label || "Enviar solicitud");
  });

  wrap.appendChild(btn);

  return wrap;
}

function renderComponent(component) {
  switch (component.type) {
    case "text":
      return renderText(component);

    case "products":
      return renderProducts(component);

    case "form":
      return renderForm(component);

    case "button":
      return renderButton(component);

    default:
      return document.createElement("div");
  }
}

async function onSubmit(btn, originalLabel) {
  const selectedItems = [];

  document
    .querySelectorAll('[data-kind="product-quantity"]')
    .forEach((input) => {
      const quantity = Number(input.value || 0);
      const productId = input.dataset.productId;

      if (quantity > 0 && productId) {
        selectedItems.push({ productId, quantity });
      }
    });

  if (selectedItems.length === 0) {
    showMessage("error", "Selecciona al menos un producto.");
    return;
  }

  const customer = {};
  const formFields = document.querySelectorAll('[data-kind="form-field"]');

  for (const field of formFields) {
    const value = String(field.value || "").trim();

    if (field.required && !value) {
      document.querySelector(".form-collapse")?.classList.add("open");
      showMessage("error", "Completa los campos obligatorios.");
      return;
    }

    customer[field.name] = value;
  }

  try {
    btn.disabled = true;
    btn.textContent = "Enviando...";

    const response = await fetch("/api/runtime-links/" + token + "/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer,
        items: selectedItems,
        raw: {
          submittedAtClient: new Date().toISOString()
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
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

config.components.forEach((component) => {
  const el = renderComponent(component);
  contentEl.appendChild(el);
});

updateTotal();
</script>

</body>
</html>`;
}