import { escapeHtml } from "../../../utils/html";

type Product = {
  id: string | number;
  name: string;
  price: number;
  description?: string | null;
  color?: string | null;
  photos?: string[];
};

function fmtPrice(n: number): string {
  return n === 0 ? "Consultar" : "$" + Number(n).toLocaleString("es-CL");
}

function buildProductCard(product: Product): string {
  const name  = escapeHtml(product.name);
  const desc  = product.description ? escapeHtml(product.description) : null;
  const price = fmtPrice(product.price);
  const color = escapeHtml(product.color || "#63ACF1");

  const firstPhoto = product.photos && product.photos.length > 0 ? product.photos[0] : null;
  const thumb = firstPhoto
    ? `<img class="prd-thumb" src="${escapeHtml(firstPhoto)}" alt="" loading="lazy">`
    : `<div class="prd-thumb prd-thumb-dot" style="background:${color}"></div>`;

  return `<div class="prd-card" data-name="${name.toLowerCase()}" data-prod-id="${escapeHtml(String(product.id))}">
  ${thumb}
  <div class="prd-info">
    <div class="prd-name">${name}</div>
    ${desc ? `<div class="prd-desc">${desc}</div>` : ""}
  </div>
  <div class="prd-price">${price}</div>
</div>`;
}

export function nosotrosTabHtml(products: Product[]): string {
  const hasProducts = products && products.length > 0;

  return `<div id="panel-nosotros" class="panel">
  <div class="pscroll">
    <div class="sec-hdr">
      <div>
        <div class="sec-title">Productos &amp; Servicios</div>
        <div class="sec-sub">${hasProducts ? `${products.length} disponible${products.length !== 1 ? "s" : ""}` : "Sin productos aún"}</div>
      </div>
    </div>
    ${hasProducts ? `
    <div class="prd-search-wrap">
      <svg class="prd-search-icon" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M14 14l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <input id="prd-search" class="prd-search" type="text" placeholder="Buscar servicio..." oninput="filterPrd(this.value)">
    </div>
    <div id="prd-list" class="prd-list">${products.map(p => buildProductCard(p)).join("")}</div>
    <div id="prd-empty-search" class="prd-no-results" style="display:none">Sin resultados para tu búsqueda.</div>
    ` : `<div class="prod-empty">Sin productos publicados aún.<br/><span style="font-size:12px">Agrega tus productos desde el panel de administración.</span></div>`}
  </div>
</div>`;
}
