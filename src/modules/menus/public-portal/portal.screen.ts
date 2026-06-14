import { escapeHtml } from "../../../utils/html";

export type PortalViewData = {
  businessName: string;
  publicSlug: string;
  productCount: number;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
};

export function renderPortalHtml(data: PortalViewData): string {
  const { businessName, publicSlug, productCount, phone, address, city } = data;

  const safe = {
    name: escapeHtml(businessName),
    slug: escapeHtml(publicSlug),
    phone: phone ? escapeHtml(phone) : null,
    address: address ? escapeHtml(address) : null,
    city: city ? escapeHtml(city) : null,
  };

  const initials = businessName
    .split(" ").slice(0, 2).map(w => w[0] ?? "").join("").toUpperCase() || "?";

  const locationLine = [safe.address, safe.city].filter(Boolean).join(", ");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#080a0c"/>
<title>${safe.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080a0c;
  --s1:#0f1218;
  --s2:#141921;
  --s3:#1a2030;
  --border:rgba(255,255,255,.07);
  --primary:#4a9eff;
  --primary-bg:rgba(74,158,255,.12);
  --text:#e8ecf0;
  --muted:#6b7585;
  --green:#22c55e;
  --red:#ef4444;
  --hdr:56px;
  --nav:64px;
  --r:18px;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}

/* ── HEADER ── */
.hdr{position:fixed;top:0;left:0;right:0;height:var(--hdr);background:var(--s1);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;padding:0 16px;z-index:100;backdrop-filter:blur(12px)}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4a9eff,#7c5cfc);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.hdr-info{flex:1;min-width:0}
.hdr-name{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hdr-status{font-size:12px;color:var(--green);display:flex;align-items:center;gap:5px}
.hdr-status::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* ── MAIN ── */
.main{position:fixed;top:var(--hdr);bottom:var(--nav);left:0;right:0;overflow:hidden}

/* ── PANELS ── */
.panel{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;display:none;-webkit-overflow-scrolling:touch}
.panel.active{display:flex;flex-direction:column}
.panel-scroll{flex:1;overflow-y:auto;padding:16px 16px 8px}

/* ── BOTTOM NAV ── */
.nav{position:fixed;bottom:0;left:0;right:0;height:var(--nav);background:var(--s1);border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(4,1fr);padding-bottom:env(safe-area-inset-bottom)}
.nb{background:none;border:none;color:var(--muted);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;padding:6px 0;transition:color .2s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.nb.active{color:var(--primary)}
.nb svg{width:22px;height:22px}
.nb span{font-size:11px;font-weight:500}

/* ── CHAT ── */
.chat-body{flex:1;overflow-y:auto;padding:12px 12px 0;display:flex;flex-direction:column;gap:10px}
.chat-footer{padding:10px 12px;border-top:1px solid var(--border);background:var(--s1);flex-shrink:0}
.chat-input-row{display:flex;gap:8px;align-items:flex-end}
.chat-input{flex:1;background:var(--s2);border:1px solid var(--border);border-radius:22px;padding:10px 16px;color:var(--text);font-size:15px;font-family:inherit;resize:none;outline:none;max-height:120px;line-height:1.4;transition:border-color .2s}
.chat-input:focus{border-color:rgba(74,158,255,.4)}
.chat-input::placeholder{color:var(--muted)}
.send-btn{width:40px;height:40px;border-radius:50%;background:var(--primary);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,opacity .15s}
.send-btn:active{transform:scale(.92)}
.send-btn:disabled{opacity:.5;cursor:default}
.send-btn svg{width:18px;height:18px;fill:#fff}

.bubble{max-width:78%;padding:10px 14px;border-radius:18px;font-size:14.5px;line-height:1.5;word-break:break-word;white-space:pre-wrap}
.bubble.ai{background:var(--s2);border-bottom-left-radius:4px;align-self:flex-start;color:var(--text)}
.bubble.user{background:var(--primary);border-bottom-right-radius:4px;align-self:flex-end;color:#fff}
.bubble.ai .ai-label{font-size:11px;color:var(--primary);font-weight:600;margin-bottom:4px}

.quick-actions{display:flex;flex-wrap:wrap;gap:8px;padding:12px 12px 4px}
.qa-btn{background:var(--s2);border:1px solid var(--border);border-radius:22px;padding:8px 16px;color:var(--text);font-size:13.5px;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:6px;transition:background .2s,border-color .2s;white-space:nowrap}
.qa-btn:active{background:var(--s3)}

.typing{display:none;align-self:flex-start;background:var(--s2);padding:12px 16px;border-radius:18px;border-bottom-left-radius:4px}
.typing span{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--muted);margin:0 2px;animation:tdot 1.2s infinite}
.typing span:nth-child(2){animation-delay:.2s}
.typing span:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

/* ── MODULE CARDS ── */
.mod-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);padding:20px;display:flex;align-items:center;gap:16px;text-decoration:none;color:inherit;transition:background .2s;-webkit-tap-highlight-color:transparent;cursor:pointer}
.mod-card:active{background:var(--s2)}
.mod-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mod-icon svg{width:24px;height:24px}
.mod-info{flex:1}
.mod-info h3{font-size:15px;font-weight:600;margin-bottom:3px}
.mod-info p{font-size:13px;color:var(--muted);line-height:1.4}
.mod-chevron{color:var(--muted)}
.mod-chevron svg{width:18px;height:18px}

.section-title{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;padding:20px 0 10px}
.divider{height:1px;background:var(--border);margin:4px 0}

/* ── NOSOTROS ── */
.biz-hero{display:flex;flex-direction:column;align-items:center;padding:28px 16px 20px;text-align:center}
.biz-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#4a9eff,#7c5cfc);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#fff;margin-bottom:14px}
.biz-name{font-size:20px;font-weight:700;margin-bottom:4px}
.biz-sub{font-size:14px;color:var(--muted)}

.info-list{display:flex;flex-direction:column;gap:1px;background:var(--border);border-radius:var(--r);overflow:hidden;border:1px solid var(--border)}
.info-row{background:var(--s1);display:flex;align-items:center;gap:14px;padding:14px 16px;text-decoration:none;color:inherit;transition:background .15s}
.info-row:active{background:var(--s2)}
.info-row-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.info-row-icon svg{width:18px;height:18px}
.info-row-label{font-size:12px;color:var(--muted);margin-bottom:2px}
.info-row-value{font-size:14px;font-weight:500}

/* ── EMPTY STATE ── */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);padding:48px 24px;text-align:center}
.empty svg{width:44px;height:44px;opacity:.4}
.empty p{font-size:14px;line-height:1.5}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:0;height:0}
</style>
</head>
<body>

<!-- HEADER -->
<header class="hdr">
  <div class="avatar">${initials}</div>
  <div class="hdr-info">
    <div class="hdr-name">${safe.name}</div>
    <div class="hdr-status">En línea</div>
  </div>
</header>

<!-- MAIN -->
<main class="main">

  <!-- TAB: CHAT -->
  <div id="panel-chat" class="panel active">
    <div class="chat-body" id="chatBody">
      <div class="bubble ai">
        <div class="ai-label">✦ ${safe.name}</div>
        ¡Hola! Soy el asistente de ${safe.name}. ¿En qué te puedo ayudar hoy?
      </div>
    </div>
    <div class="quick-actions" id="quickActions">
      <button class="qa-btn" onclick="quickAction('reservas')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Reservar hora
      </button>
      <button class="qa-btn" onclick="quickAction('cotizar')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Pedir cotización
      </button>
      <button class="qa-btn" onclick="quickAction('precios')">
        💰 Ver precios
      </button>
    </div>
    <div class="chat-footer">
      <div class="chat-input-row">
        <textarea class="chat-input" id="chatInput" placeholder="Escribe tu pregunta…" rows="1"></textarea>
        <button class="send-btn" id="sendBtn" onclick="sendMessage()">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- TAB: RESERVAS -->
  <div id="panel-reservas" class="panel">
    <div class="panel-scroll">
      <p class="section-title">Agenda tu hora</p>
      <a class="mod-card" href="/open/${safe.slug}/reservas">
        <div class="mod-icon" style="background:rgba(74,158,255,.12)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#4a9eff" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="mod-info">
          <h3>Reservar una hora</h3>
          <p>Elige el día y horario disponible para agendar tu atención.</p>
        </div>
        <div class="mod-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      </a>

      <p class="section-title" style="padding-top:24px">¿Cómo funciona?</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${['Selecciona el día disponible', 'Elige el horario que mejor te acomode', 'Ingresa tus datos y confirma la reserva'].map((s,i) => `
        <div style="display:flex;align-items:center;gap:12px;background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:14px 16px">
          <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-bg);color:var(--primary);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
          <span style="font-size:14px">${s}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- TAB: COTIZAR -->
  <div id="panel-cotizar" class="panel">
    <div class="panel-scroll">
      <p class="section-title">Solicita una cotización</p>
      <a class="mod-card" href="/shop/${safe.slug}/cotizador">
        <div class="mod-icon" style="background:rgba(124,92,252,.12)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div class="mod-info">
          <h3>Cotizar servicios</h3>
          <p>${productCount > 0 ? `${productCount} servicio${productCount !== 1 ? 's' : ''} disponible${productCount !== 1 ? 's' : ''}` : 'Selecciona productos y recibe un presupuesto'}</p>
        </div>
        <div class="mod-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      </a>

      <p class="section-title" style="padding-top:24px">¿Cómo funciona?</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${['Selecciona los servicios que te interesan', 'Ingresa tus datos de contacto', 'Recibes la cotización por correo en PDF'].map((s,i) => `
        <div style="display:flex;align-items:center;gap:12px;background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:14px 16px">
          <div style="width:28px;height:28px;border-radius:50%;background:rgba(124,92,252,.12);color:#7c5cfc;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
          <span style="font-size:14px">${s}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- TAB: NOSOTROS -->
  <div id="panel-nosotros" class="panel">
    <div class="panel-scroll">
      <div class="biz-hero">
        <div class="biz-avatar">${initials}</div>
        <div class="biz-name">${safe.name}</div>
        <div class="biz-sub">Perfil del negocio</div>
      </div>

      <div class="info-list">
        ${safe.phone ? `
        <a class="info-row" href="tel:${safe.phone}">
          <div class="info-row-icon" style="background:rgba(34,197,94,.12)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <div class="info-row-label">Teléfono</div>
            <div class="info-row-value">${safe.phone}</div>
          </div>
        </a>` : ''}
        ${locationLine ? `
        <div class="info-row">
          <div class="info-row-icon" style="background:rgba(74,158,255,.12)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a9eff" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div class="info-row-label">Ubicación</div>
            <div class="info-row-value">${locationLine}</div>
          </div>
        </div>` : ''}
        <div class="info-row" onclick="showTab('chat')" style="cursor:pointer">
          <div class="info-row-icon" style="background:rgba(74,158,255,.12)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a9eff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div class="info-row-label">Atención</div>
            <div class="info-row-value">Chatea con nosotros</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</main>

<!-- BOTTOM NAV -->
<nav class="nav">
  <button class="nb active" id="nb-chat" onclick="showTab('chat')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span>Chat</span>
  </button>
  <button class="nb" id="nb-reservas" onclick="showTab('reservas')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    <span>Reservas</span>
  </button>
  <button class="nb" id="nb-cotizar" onclick="showTab('cotizar')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
    <span>Servicios</span>
  </button>
  <button class="nb" id="nb-nosotros" onclick="showTab('nosotros')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>Nosotros</span>
  </button>
</nav>

<script>
const SLUG = '${safe.slug}';
const tabs = ['chat','reservas','cotizar','nosotros'];

function showTab(name) {
  tabs.forEach(t => {
    document.getElementById('panel-' + t).classList.toggle('active', t === name);
    document.getElementById('nb-' + t).classList.toggle('active', t === name);
  });
  if (name === 'chat') {
    setTimeout(() => document.getElementById('chatBody').scrollTop = 9999, 50);
  }
}

// ── Chat ──────────────────────────────────────────────

let sending = false;

function addBubble(role, text) {
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = 'bubble ' + role;
  if (role === 'ai') {
    div.innerHTML = '<div class="ai-label">✦ ${safe.name}</div>' + escHtml(text);
  } else {
    div.textContent = text;
  }
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

function showTyping() {
  const body = document.getElementById('chatBody');
  const t = document.createElement('div');
  t.className = 'typing';
  t.id = 'typingDot';
  t.innerHTML = '<span></span><span></span><span></span>';
  body.appendChild(t);
  t.style.display = 'flex';
  body.scrollTop = body.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typingDot');
  if (t) t.remove();
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\\n/g,'<br>');
}

async function sendMessage() {
  if (sending) return;
  const input = document.getElementById('chatInput');
  const q = input.value.trim();
  if (!q) return;

  input.value = '';
  input.style.height = 'auto';

  document.getElementById('quickActions').style.display = 'none';

  addBubble('user', q);
  showTyping();
  sending = true;
  document.getElementById('sendBtn').disabled = true;

  try {
    const res = await fetch('/api/public/' + SLUG + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    });
    const data = await res.json();
    hideTyping();
    addBubble('ai', data.answer || 'No pude procesar tu pregunta. Intenta de nuevo.');
  } catch {
    hideTyping();
    addBubble('ai', 'Hubo un problema al conectar. Intenta nuevamente.');
  } finally {
    sending = false;
    document.getElementById('sendBtn').disabled = false;
  }
}

function quickAction(action) {
  document.getElementById('quickActions').style.display = 'none';
  if (action === 'reservas') {
    addBubble('user', 'Quiero reservar una hora');
    addBubble('ai', 'Con gusto te ayudo a agendar. Puedes revisar la disponibilidad y reservar en la sección Reservas 📅');
    setTimeout(() => showTab('reservas'), 1200);
  } else if (action === 'cotizar') {
    addBubble('user', 'Quiero pedir una cotización');
    addBubble('ai', 'Perfecto. Te llevo a nuestro cotizador donde puedes seleccionar los servicios que necesitas 🧾');
    setTimeout(() => showTab('cotizar'), 1200);
  } else if (action === 'precios') {
    const input = document.getElementById('chatInput');
    input.value = '¿Cuáles son los precios?';
    sendMessage();
  }
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('chatInput');

  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
</script>
</body>
</html>`;
}
