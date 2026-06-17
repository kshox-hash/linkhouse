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

const MOD_ACTION: Record<string, string> = {
  reservas:  "reservas",
  cotizador: "cotizador",
};

type ModConfig = { artClass: string; title: string; desc: string };

const MODULE_CONFIG: Record<string, ModConfig> = {
  reservas: {
    artClass: "art-reservas",
    title: "Reservar hora",
    desc:  "Elige día y horario disponible.",
  },
  cotizador: {
    artClass: "art-cotizador",
    title: "Pedir cotización",
    desc:  "Solicita tu presupuesto en segundos.",
  },
};
const FALLBACK_CONFIGS: ModConfig[] = [
  { artClass: "art-0", title: "Ver más",    desc: "Explora nuestros servicios." },
  { artClass: "art-1", title: "Más info",   desc: "Contáctanos para más detalles." },
  { artClass: "art-2", title: "Consultar",  desc: "Escríbenos en cualquier momento." },
];

export function renderPortalHtml(data: PortalViewData): string {
  const {
    businessName, publicSlug, brandColor, description, welcomeMessage,
    phone, address, city, instagramUrl, whatsappNumber, businessHours,
    logoUrl, enabledModules, products,
  } = data;

  const safeColor   = sanitizeBrandColor(brandColor);
  const safeLogoUrl = sanitizeImageUrl(logoUrl);
  const initials    = publicSlug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

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

  const locationLine = [safe.address, safe.city].filter(Boolean).join(", ");

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const avatarHtml = safeLogoUrl
    ? `<div class="site-avatar"><img src="${safeLogoUrl}" alt="${safe.name}"/></div>`
    : `<div class="site-avatar">${initials}</div>`;

  // ── Hero card ──────────────────────────────────────────────────────────────
  const heroTitle = safe.welcome ?? `Bienvenidos a<br>${safe.name}`;
  const heroSub   = safe.description ?? "Explora nuestros servicios y agenda cuando quieras.";

  // ── Module cards ───────────────────────────────────────────────────────────
  const moduleCards = enabledModules.map((m, i) => {
    const cfg    = MODULE_CONFIG[m.code] ?? FALLBACK_CONFIGS[i % FALLBACK_CONFIGS.length];
    const action = MOD_ACTION[m.code]    ?? m.code;
    return `
      <button class="mod-card" data-action="${escapeHtml(action)}" type="button">
        <div class="mod-art ${cfg.artClass}"></div>
        <div class="mod-body">
          <div class="mod-card-title">${cfg.title}</div>
          <div class="mod-card-desc">${cfg.desc}</div>
        </div>
      </button>`;
  }).join("");

  // ── Contact rows ───────────────────────────────────────────────────────────
  const contactRows = [
    safe.phone ? `
      <a class="contact-row" href="tel:${safe.phone}">
        <div class="ci-wrap"><svg class="ci" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
        <span>${safe.phone}</span>
      </a>` : "",
    safe.whatsapp ? `
      <a class="contact-row" href="https://wa.me/${safe.whatsapp}" target="_blank" rel="noopener">
        <div class="ci-wrap"><svg class="ci" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
        <span>WhatsApp</span>
      </a>` : "",
    locationLine ? `
      <div class="contact-row">
        <div class="ci-wrap"><svg class="ci" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <span>${locationLine}</span>
      </div>` : "",
    safe.businessHours ? `
      <div class="contact-row">
        <div class="ci-wrap"><svg class="ci" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <span>${safe.businessHours}</span>
      </div>` : "",
    safe.instagram ? `
      <a class="contact-row" href="${safe.instagram}" target="_blank" rel="noopener">
        <div class="ci-wrap"><svg class="ci" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg></div>
        <span>Instagram</span>
      </a>` : "",
  ].filter(Boolean).join("");

  const colorVars = safeColor ? `:root{--accent:${safeColor}}` : "";
  const accentRgb = safeColor ? `--accent-raw:${safeColor}` : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="theme-color" content="#0c0c0f"/>
<title>${safe.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>${portalStyles()}${colorVars}</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <header class="site-header">
    ${avatarHtml}
    <div class="site-info">
      <div class="site-name">${safe.name}</div>
      ${safe.description ? `<div class="site-tagline">${safe.description}</div>` : ""}
    </div>
    <div class="site-badge"><span class="badge-dot"></span>En línea</div>
  </header>

  <!-- HERO CARD -->
  <div class="hero-card">
    <div class="hero-text">
      <p class="hero-label">Bienvenidos</p>
      <h1 class="hero-title">${heroTitle}</h1>
      <p class="hero-sub">${heroSub}</p>
    </div>
    <div class="hero-art"></div>
  </div>

  <!-- MÓDULOS -->
  ${moduleCards ? `
  <div class="sec-label">
    <span class="sec-label-title">Servicios</span>
    <span class="sec-label-sub">¿Cómo podemos ayudarte?</span>
  </div>
  <div class="mod-grid">${moduleCards}</div>` : ""}

  <!-- CONTACTO -->
  ${contactRows ? `
  <div class="sec-label">
    <span class="sec-label-title">Contacto</span>
  </div>
  <div class="contact-card">${contactRows}</div>` : ""}

  <div class="pg-footer">Powered by <strong>Automatiza Fácil</strong></div>

</div>

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
