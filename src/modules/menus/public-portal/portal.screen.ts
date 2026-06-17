import { escapeHtml } from "../../../utils/html";
import { portalStyles } from "./portal.styles";
import { portalScripts } from "./portal.scripts";
import { MenuModuleItem } from "../user-modules.repository";

export type PortalViewData = {
  businessName: string;
  publicSlug: string;
  productCount: number;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  brandColor?: string | null;
  description?: string | null;
  welcomeMessage?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  businessHours?: string | null;
  logoUrl?: string | null;
  enabledModules: MenuModuleItem[];
  products: { id: string | number; name: string; price: number; description?: string | null }[];
};

function sanitizeBrandColor(c: string | null | undefined): string | null {
  if (!c) return null;
  return /^#[0-9a-fA-F]{6}$/.test(c.trim()) ? c.trim() : null;
}
function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("https://") ? escapeHtml(url) : null;
}

const MOD_TITLE: Record<string, string> = {
  reservas:  "Reservar hora",
  cotizador: "Pedir cotización",
};
const MOD_DESC: Record<string, string> = {
  reservas:  "Elige día y horario disponible",
  cotizador: "Solicita tu presupuesto en segundos",
};
const MOD_TAG: Record<string, string> = {
  reservas:  "Agenda tu cita",
  cotizador: "Obtén un presupuesto",
};
const MOD_ICON: Record<string, string> = {
  reservas:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  cotizador: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
};
const MOD_ICON_BG: Record<string, string> = {
  reservas:  "linear-gradient(135deg,#f472b6 0%,#7c3aed 100%)",
  cotizador: "linear-gradient(135deg,#6366f1 0%,#a78bfa 100%)",
};
const MOD_ICON_BG_FALLBACK = "linear-gradient(135deg,#6366f1 0%,#a78bfa 100%)";

function phoneIcon(): string {
  return `<svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
}
function wpIcon(): string {
  return `<svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
}
function mapIcon(): string {
  return `<svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.75"/></svg>`;
}
function clockIcon(): string {
  return `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.75"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`;
}
function igIcon(): string {
  return `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.75"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>`;
}
function chevRight(): string {
  return `<svg viewBox="0 0 24 24" fill="none"><polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function renderPortalHtml(data: PortalViewData): string {
  const {
    businessName, publicSlug, productCount, brandColor, description, welcomeMessage,
    phone, address, city, instagramUrl, whatsappNumber, businessHours,
    logoUrl, enabledModules, products,
  } = data;

  const safeColor   = sanitizeBrandColor(brandColor);
  const safeLogoUrl = sanitizeImageUrl(logoUrl);
  const initials    = publicSlug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "AB";

  const safe = {
    name:          escapeHtml(businessName),
    phone:         phone          ? escapeHtml(phone)          : null,
    address:       address        ? escapeHtml(address)        : null,
    city:          city           ? escapeHtml(city)           : null,
    description:   description    ? escapeHtml(description)    : null,
    welcome:       welcomeMessage ? escapeHtml(welcomeMessage) : null,
    instagram:     instagramUrl   ? escapeHtml(instagramUrl)   : null,
    whatsapp:      whatsappNumber ? escapeHtml(whatsappNumber) : null,
    businessHours: businessHours  ? escapeHtml(businessHours)  : null,
  };

  // ── Hero stats ─────────────────────────────────────────────────────────────
  const statsItems: Array<{ num: string; lbl: string }> = [];
  if (productCount > 0) statsItems.push({ num: String(productCount), lbl: productCount === 1 ? "Servicio" : "Servicios" });
  if (enabledModules.length > 0) statsItems.push({ num: String(enabledModules.length), lbl: enabledModules.length === 1 ? "Módulo" : "Módulos" });
  statsItems.push({ num: "★ 5", lbl: "Calidad" });
  const statsHtml = statsItems.map(s =>
    `<div class="hero-stat"><span class="stat-num">${escapeHtml(s.num)}</span><span class="stat-lbl">${escapeHtml(s.lbl)}</span></div>`
  ).join("");

  // ── Service list ───────────────────────────────────────────────────────────
  const svcListHtml = enabledModules.map(m => {
    const icon  = MOD_ICON[m.code]     ?? MOD_ICON["cotizador"];
    const bg    = MOD_ICON_BG[m.code]  ?? MOD_ICON_BG_FALLBACK;
    const title = MOD_TITLE[m.code]    ?? escapeHtml(m.title);
    const desc  = MOD_DESC[m.code]     ?? "";
    const tag   = MOD_TAG[m.code]      ?? "";
    return `
    <button class="svc-item" data-action="${escapeHtml(m.code)}" type="button">
      <div class="svc-icon-wrap" style="background:${bg}">${icon}</div>
      <div class="svc-item-info">
        <div class="svc-item-title">${title}</div>
        <div class="svc-item-desc">${desc}</div>
        ${tag ? `<div class="svc-item-tag">${tag}</div>` : ""}
      </div>
      <div class="svc-arrow">${chevRight()}</div>
    </button>`;
  }).join("");

  // ── Contact rows ───────────────────────────────────────────────────────────
  const locationLine = [safe.address, safe.city].filter(Boolean).join(", ");
  const contactRows = [
    safe.phone    ? `<a class="cc-row" href="tel:${safe.phone}"><div class="cc-icon">${phoneIcon()}</div><span>${safe.phone}</span></a>` : "",
    safe.whatsapp ? `<a class="cc-row" href="https://wa.me/${safe.whatsapp}" target="_blank" rel="noopener"><div class="cc-icon">${wpIcon()}</div><span>WhatsApp</span></a>` : "",
    locationLine  ? `<div class="cc-row"><div class="cc-icon">${mapIcon()}</div><span>${locationLine}</span></div>` : "",
    safe.businessHours ? `<div class="cc-row"><div class="cc-icon">${clockIcon()}</div><span>${safe.businessHours}</span></div>` : "",
    safe.instagram ? `<a class="cc-row" href="${safe.instagram}" target="_blank" rel="noopener"><div class="cc-icon">${igIcon()}</div><span>Instagram</span></a>` : "",
  ].filter(Boolean).join("");

  // ── CTA buttons ────────────────────────────────────────────────────────────
  const ctaHtml = enabledModules.map((m, i) => {
    const title = MOD_TITLE[m.code] ?? escapeHtml(m.title);
    const cls   = i === 0 ? "cta-btn cta-primary" : "cta-btn cta-secondary";
    return `<button class="${cls}" data-action="${escapeHtml(m.code)}" type="button">${title}</button>`;
  }).join("");

  const colorVars = safeColor ? `:root{--accent:${safeColor}}` : "";

  const heroSubText = safe.description ?? safe.welcome ?? "Explora nuestros servicios y agenda cuando quieras.";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#4c1d95"/>
<title>${safe.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>${portalStyles()}${colorVars}</style>
</head>
<body>
<div class="page">

  <!-- ── HERO GRADIENT HEADER ── -->
  <div class="hero-hdr">
    <div class="hero-av">${safeLogoUrl ? `<img src="${safeLogoUrl}" alt="${safe.name}"/>` : initials}</div>
    <div class="hero-badge"><span class="hero-dot"></span>En línea</div>
    <h1 class="hero-title">${safe.name}</h1>
    <p class="hero-sub">${heroSubText}</p>
    ${statsHtml ? `<div class="hero-stats">${statsHtml}</div>` : ""}
  </div>

  <!-- ── CONTENT AREA ── -->
  <div class="content-area">

    ${safe.welcome && safe.description ? `<p class="welcome-text">${safe.welcome}</p>` : ""}

    ${svcListHtml ? `
    <div>
      <div class="sec-hdr">
        <span class="sec-hdr-title">Servicios disponibles</span>
        <span class="sec-hdr-count">${enabledModules.length} opción${enabledModules.length !== 1 ? "es" : ""}</span>
      </div>
      <div class="svc-list">${svcListHtml}</div>
      <div class="action-hint">
        <svg viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Toca un servicio para continuar
      </div>
    </div>` : ""}

    ${contactRows ? `
    <div>
      <div class="sec-hdr"><span class="sec-hdr-title">Contacto</span></div>
      <div class="contact-compact">${contactRows}</div>
    </div>` : ""}

    <p class="pg-footer">Powered by <strong>Automatiza Fácil</strong></p>
    <div id="svc-anchor"></div>

  </div><!-- /content-area -->

  ${ctaHtml ? `<div class="cta-bar">${ctaHtml}</div>` : ""}

</div><!-- /page -->

<div id="quotePanel" class="quote-panel"></div>
<div id="bookingPanel" class="quote-panel"></div>
<script>${portalScripts(publicSlug, safe.name, enabledModules, products, {
  phone: safe.phone, address: safe.address, city: safe.city,
  description: safe.description, welcomeMessage: welcomeMessage ?? null,
  businessHours: safe.businessHours, instagramUrl: safe.instagram, whatsappNumber: safe.whatsapp,
}, initials)}</script>
</body>
</html>`;
}
