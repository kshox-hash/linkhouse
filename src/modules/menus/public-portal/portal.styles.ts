export function portalStyles(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d0d12;
  --card:#16161d;
  --card2:#1c1c26;
  --border:rgba(255,255,255,.07);
  --text:#ffffff;
  --muted:rgba(255,255,255,.48);
  --muted2:rgba(255,255,255,.22);
  --accent:#7c3aed;
  --accent-lt:#a78bfa;
  --green:#4ade80;
  --r:14px;
}
html,body{min-height:100%;background:var(--bg);color:var(--text);
  font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}

/* PAGE */
.page{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}

/* ── HERO HEADER ──────────────────────────────────────── */
.hero-hdr{
  background:linear-gradient(160deg,#3b0764 0%,#6d28d9 55%,#a78bfa 100%);
  padding:52px 24px 32px;
  text-align:center;
  position:relative;
  overflow:hidden;
  flex-shrink:0;
}
/* decorative blobs — clipped inside hero */
.hero-hdr::before{
  content:'';position:absolute;top:-80px;right:-80px;
  width:240px;height:240px;border-radius:50%;
  background:rgba(255,255,255,.06);pointer-events:none
}
.hero-hdr::after{
  content:'';position:absolute;bottom:-40px;left:-60px;
  width:180px;height:180px;border-radius:50%;
  background:rgba(255,255,255,.04);pointer-events:none
}

.hero-av{
  width:76px;height:76px;border-radius:20px;margin:0 auto 12px;
  background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.3);
  display:flex;align-items:center;justify-content:center;
  font-size:24px;font-weight:800;color:#fff;letter-spacing:-.03em;
  overflow:hidden;position:relative;z-index:1;
  box-shadow:0 4px 24px rgba(0,0,0,.3)
}
.hero-av img{width:100%;height:100%;object-fit:cover}

.hero-badge{
  display:inline-flex;align-items:center;gap:5px;
  background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.24);
  color:#fff;border-radius:20px;padding:4px 11px;
  font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  margin-bottom:10px;position:relative;z-index:1
}
.hero-dot{
  width:6px;height:6px;border-radius:50%;background:var(--green);
  animation:blink 2.5s infinite;flex-shrink:0
}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}

.hero-title{
  font-size:24px;font-weight:800;color:#fff;letter-spacing:-.04em;
  line-height:1.15;margin-bottom:7px;position:relative;z-index:1
}
.hero-sub{
  font-size:13px;color:rgba(255,255,255,.68);line-height:1.55;
  max-width:270px;margin:0 auto;position:relative;z-index:1
}

/* ── STATS ROW (inside hero, at bottom) ──────────────── */
.hero-stats{
  display:flex;gap:8px;justify-content:center;
  margin-top:20px;position:relative;z-index:1
}
.hero-stat{
  background:rgba(0,0,0,.25);backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.15);border-radius:12px;
  padding:9px 14px;display:flex;flex-direction:column;
  align-items:center;gap:1px;min-width:64px
}
.stat-num{font-size:15px;font-weight:800;color:#fff;letter-spacing:-.03em}
.stat-lbl{font-size:9px;color:rgba(255,255,255,.55);font-weight:600;
  letter-spacing:.05em;text-transform:uppercase}

/* ── CONTENT CARD ────────────────────────────────────── */
.content-area{
  flex:1;background:var(--bg);
  border-radius:20px 20px 0 0;
  margin-top:-20px;            /* overlap hero by 20px for rounded-card feel */
  padding:24px 16px 100px;
  display:flex;flex-direction:column;gap:18px;
  position:relative;z-index:2
}

/* ── WELCOME TEXT ────────────────────────────────────── */
.welcome-text{font-size:13.5px;color:var(--muted);line-height:1.65;padding:0 2px}

/* ── SECTION HEADER ──────────────────────────────────── */
.sec-hdr{display:flex;align-items:center;justify-content:space-between;padding:0 2px}
.sec-hdr-title{font-size:14px;font-weight:700;color:var(--text);letter-spacing:-.02em}
.sec-hdr-count{font-size:12px;color:var(--muted2);font-weight:600}

/* ── SERVICE LIST ────────────────────────────────────── */
.svc-list{display:flex;flex-direction:column;gap:8px}
.svc-item{
  width:100%;background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);padding:14px 14px;
  display:flex;align-items:center;gap:14px;
  cursor:pointer;font-family:inherit;text-align:left;
  -webkit-tap-highlight-color:transparent;
  transition:background .15s,border-color .15s,transform .15s
}
.svc-item:hover{background:var(--card2);border-color:rgba(124,58,237,.3)}
.svc-item:active{transform:scale(.975)}
.svc-item.active{border-color:rgba(124,58,237,.55);background:#1a1530}

.svc-icon-wrap{
  width:46px;height:46px;border-radius:13px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;color:#fff
}
.svc-icon-wrap svg{width:22px;height:22px;stroke:currentColor;fill:none}

.svc-item-info{flex:1;min-width:0}
.svc-item-title{font-size:14px;font-weight:700;color:var(--text);letter-spacing:-.02em;margin-bottom:2px}
.svc-item-desc{font-size:12px;color:var(--muted);line-height:1.4}
.svc-item-tag{
  font-size:10px;font-weight:700;color:var(--accent-lt);
  background:rgba(124,58,237,.14);border-radius:5px;
  padding:2px 7px;margin-top:5px;display:inline-block
}

.svc-arrow{
  flex-shrink:0;width:26px;height:26px;border-radius:7px;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:center;
  transition:background .15s,border-color .15s
}
.svc-item:hover .svc-arrow,
.svc-item.active .svc-arrow{background:rgba(124,58,237,.2);border-color:rgba(124,58,237,.3)}
.svc-arrow svg{width:13px;height:13px;stroke:var(--muted);stroke-width:2.5;
  stroke-linecap:round;stroke-linejoin:round;fill:none;transition:stroke .15s}
.svc-item:hover .svc-arrow svg,
.svc-item.active .svc-arrow svg{stroke:var(--accent-lt)}

/* ── ACTION HINT ─────────────────────────────────────── */
.action-hint{
  text-align:center;font-size:11.5px;color:var(--muted2);
  padding:2px 0 0;
  display:flex;align-items:center;justify-content:center;gap:5px
}
.action-hint svg{
  width:13px;height:13px;stroke:var(--muted2);stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round;fill:none;
  animation:bounce 2s ease-in-out infinite
}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}

/* ── CONTACT COMPACT ─────────────────────────────────── */
.contact-compact{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);overflow:hidden
}
.cc-row{
  display:flex;align-items:center;gap:12px;padding:12px 14px;
  text-decoration:none;color:var(--text);font-size:13px;font-weight:500;
  border-bottom:1px solid var(--border);
  transition:background .15s;-webkit-tap-highlight-color:transparent
}
.cc-row:last-child{border-bottom:none}
a.cc-row:hover{background:rgba(255,255,255,.04)}
.cc-icon{
  width:28px;height:28px;border-radius:7px;
  background:rgba(255,255,255,.06);
  display:flex;align-items:center;justify-content:center;flex-shrink:0
}
.cc-icon svg{width:13px;height:13px;fill:none;
  stroke:var(--muted);stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}

/* ── FOOTER ──────────────────────────────────────────── */
.pg-footer{text-align:center;font-size:11px;color:var(--muted2);padding:4px 0}
.pg-footer strong{color:rgba(255,255,255,.28);font-weight:600}

/* ── STICKY CTA BAR ──────────────────────────────────── */
.cta-bar{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;
  padding:10px 16px calc(12px + env(safe-area-inset-bottom));
  background:linear-gradient(to top,var(--bg) 65%,transparent);
  display:flex;flex-direction:column;gap:8px;z-index:100
}
.cta-btn{
  width:100%;border:none;border-radius:13px;padding:15px;
  font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  letter-spacing:-.01em;transition:transform .15s,opacity .15s;
  -webkit-tap-highlight-color:transparent
}
.cta-btn:active{transform:scale(.97)}
.cta-primary{background:var(--accent);color:#fff}
.cta-primary:hover{opacity:.85}
.cta-secondary{background:rgba(255,255,255,.07);color:var(--text);
  border:1px solid rgba(255,255,255,.1)}
.cta-secondary:hover{background:rgba(255,255,255,.11)}

/* ── SLIDE PANELS ────────────────────────────────────── */
.quote-panel{
  position:fixed;top:0;left:50%;
  transform:translateX(-50%) translateX(100vw);
  width:100%;max-width:480px;height:100%;
  z-index:500;background:#111115;
  transition:transform .38s cubic-bezier(.22,1,.36,1);
  display:flex;flex-direction:column;will-change:transform;
  padding-top:env(safe-area-inset-top)
}
.quote-panel.open{transform:translateX(-50%) translateX(0)}

.qp-header{
  height:56px;display:flex;align-items:center;
  padding:0 8px 0 4px;background:#111115;
  border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0
}
.qp-back{
  background:none;border:none;color:#fff;font-size:14px;font-weight:600;
  font-family:inherit;cursor:pointer;display:flex;align-items:center;
  gap:3px;padding:10px;-webkit-tap-highlight-color:transparent;
  flex-shrink:0;transition:opacity .15s
}
.qp-back svg{
  width:17px;height:17px;flex-shrink:0;
  stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;fill:none
}
.qp-back:hover{opacity:.5}
.qp-title{flex:1;text-align:center;font-size:15px;font-weight:700;letter-spacing:-.03em}
.qp-spacer{width:72px;flex-shrink:0}

.qp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px 20px;background:#111115}
.qp-footer{
  padding:10px 16px;padding-bottom:calc(10px + env(safe-area-inset-bottom));
  background:#111115;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0
}
.qp-section-title{
  font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  text-transform:uppercase;letter-spacing:.1em;padding:18px 0 10px
}
.qp-input{
  display:block;width:100%;background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.1);border-radius:12px;
  padding:13px 16px;color:#fff;font-size:15px;font-family:inherit;
  outline:none;-webkit-appearance:none;transition:border-color .2s;margin-bottom:10px
}
.qp-input:focus{border-color:rgba(255,255,255,.3)}
.qp-input:disabled{opacity:.35}
.qp-input::placeholder{color:rgba(255,255,255,.2)}
.qp-error{font-size:12.5px;color:#f87171;display:none;padding:0 2px 8px}

.qp-btn{
  display:block;width:100%;background:#fff;border:none;
  border-radius:12px;padding:14px;color:#111;font-size:13px;font-weight:700;
  cursor:pointer;font-family:inherit;letter-spacing:.02em;
  transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent
}
.qp-btn:hover{opacity:.88}
.qp-btn:active{transform:scale(.98)}
.qp-btn:disabled{opacity:.22;cursor:default}

.qp-cart-bar{
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
  border-radius:12px;padding:11px 14px;margin-bottom:10px
}
.qp-cart-info{font-size:13px;color:rgba(255,255,255,.5)}
.qp-cart-total{font-size:14px;font-weight:700}
.qp-summary{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
  border-radius:12px;padding:13px 14px;margin-bottom:4px
}
.product-cards{
  display:flex;flex-direction:column;gap:1px;
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.07);
  border-radius:12px;overflow:hidden;margin-top:4px
}
.product-card{background:var(--card);padding:13px 14px;display:flex;align-items:center;gap:12px}
.product-info{flex:1;min-width:0}
.product-name{font-size:14px;font-weight:600;margin-bottom:2px}
.product-desc{font-size:12px;color:rgba(255,255,255,.4);line-height:1.35;margin-bottom:4px}
.product-price{font-size:13px;font-weight:700}
.qty-ctrl{display:flex;align-items:center;gap:7px;flex-shrink:0}
.qty-btn{
  width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.1);color:#fff;font-size:16px;line-height:1;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:background .15s;-webkit-tap-highlight-color:transparent;font-family:inherit
}
.qty-btn:hover{background:rgba(255,255,255,.14)}
.qty-btn:active{transform:scale(.88)}
.qty-btn:disabled{opacity:.22;cursor:default}
.qty-num{font-size:15px;font-weight:700;min-width:18px;text-align:center}

.cart-summary{
  margin-top:10px;background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.09);border-radius:12px;
  padding:11px 13px;display:none
}
.cart-summary.visible{display:block}
.cart-line{display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.4);margin-bottom:5px}
.cart-total{
  display:flex;justify-content:space-between;font-size:14px;font-weight:700;
  padding-top:7px;border-top:1px solid rgba(255,255,255,.09);margin-top:3px
}
.cart-confirm-btn{
  margin-top:12px;width:100%;background:#fff;border:none;border-radius:12px;
  padding:13px;color:#111;font-size:13px;font-weight:700;cursor:pointer;
  font-family:inherit;letter-spacing:.02em;
  transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent
}
.cart-confirm-btn:hover{opacity:.88}
.cart-confirm-btn:active{transform:scale(.98)}
.cart-confirm-btn:disabled{opacity:.22;cursor:default}

.bp-dates{display:flex;flex-direction:column;gap:6px}
.bp-date-card{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  border-radius:12px;padding:13px 14px;display:flex;align-items:center;gap:13px;
  cursor:pointer;transition:background .2s;-webkit-tap-highlight-color:transparent
}
.bp-date-card:hover{background:rgba(255,255,255,.09)}
.bp-date-card:active{transform:scale(.97)}
.bp-date-icon{
  width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,.08);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  flex-shrink:0;gap:1px
}
.bp-provider-avatar{
  width:44px;height:44px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;font-size:15px;font-weight:700
}
.bp-date-day{font-size:9px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.06em}
.bp-date-num{font-size:19px;font-weight:700;line-height:1}
.bp-date-info{flex:1;min-width:0}
.bp-date-label{font-size:14px;font-weight:600;margin-bottom:2px}
.bp-date-slots{font-size:12px;color:rgba(255,255,255,.4)}
.bp-date-arrow{width:14px;height:14px;stroke:rgba(255,255,255,.25);flex-shrink:0;stroke-width:2;fill:none}

.bp-times{display:flex;flex-wrap:wrap;gap:6px}
.bp-time-chip{
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;padding:10px 16px;font-size:14px;font-weight:600;
  cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;font-family:inherit;color:#fff
}
.bp-time-chip:hover{background:#fff;color:#111;border-color:#fff}
.bp-time-chip:active{transform:scale(.93)}

.qp-loading{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:64px 0;gap:14px;color:rgba(255,255,255,.35);font-size:14px
}
.qp-loading-spinner{
  width:26px;height:26px;border:2px solid rgba(255,255,255,.1);
  border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite
}
@keyframes spin{to{transform:rotate(360deg)}}

.qp-empty{display:flex;flex-direction:column;align-items:center;padding:48px 8px 16px;gap:6px;text-align:center}
.qp-empty-icon{font-size:36px;margin-bottom:6px;opacity:.5}
.qp-empty-msg{font-size:14px;color:rgba(255,255,255,.35);line-height:1.55;margin-bottom:12px}
.qp-empty-actions{display:flex;flex-direction:column;gap:8px;width:100%}
.qp-empty-btn{
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  border-radius:12px;padding:12px 16px;font-size:14px;font-weight:500;
  cursor:pointer;font-family:inherit;transition:background .15s;
  -webkit-tap-highlight-color:transparent;color:#fff
}
.qp-empty-btn:hover{background:rgba(255,255,255,.12)}

::-webkit-scrollbar{width:0;height:0}
`;
}
