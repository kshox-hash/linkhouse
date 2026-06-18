"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nosotrosTabHtml = nosotrosTabHtml;
const html_1 = require("../../../utils/html");
const ACCENT_COLORS = ['#4F87F5', '#F472B6', '#22C55E', '#F59E0B', '#7C3AED', '#EF4444'];
function fmtPrice(n) {
    return n === 0 ? "Consultar" : "$" + Number(n).toLocaleString("es-CL");
}
function buildProductCard(product, index) {
    const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
    const name = (0, html_1.escapeHtml)(product.name);
    const desc = product.description ? (0, html_1.escapeHtml)(product.description) : null;
    const price = fmtPrice(product.price);
    return `
  <div class="prd-card">
    <div class="prd-accent" style="background:${color}"></div>
    <div class="prd-body">
      <div class="prd-info">
        <div class="prd-name">${name}</div>
        ${desc ? `<div class="prd-desc">${desc}</div>` : ""}
      </div>
      <div class="prd-price">${price}</div>
    </div>
  </div>`;
}
function nosotrosTabHtml(products) {
    const hasProducts = products && products.length > 0;
    return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <div class="sec-hdr" style="margin-bottom:20px">
        <div>
          <div class="sec-title">Productos &amp; Servicios</div>
          <div class="sec-sub">${hasProducts ? `${products.length} disponible${products.length !== 1 ? "s" : ""}` : "Sin productos aún"}</div>
        </div>
      </div>
      ${hasProducts
        ? `<div class="prd-list">${products.map((p, i) => buildProductCard(p, i)).join("")}</div>`
        : `<div class="prod-empty">Sin productos publicados aún.<br/><span style="font-size:12px">Agrega tus productos desde el panel de administración.</span></div>`}
    </div>
  </div>`;
}
