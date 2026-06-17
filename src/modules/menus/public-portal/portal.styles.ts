export function portalStyles(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0e0e13;
  --card:#18181f;
  --border:rgba(255,255,255,.07);
  --text:#ffffff;
  --muted:rgba(255,255,255,.5);
  --muted2:rgba(255,255,255,.25);
  --accent:#7c3aed;
  --accent-light:#a78bfa;
  --green:#4ade80;
  --r:16px;
}
html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}

/* ─── PAGE ──────────────────────────────────────────── */
.page{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}

/* ─── HERO GRADIENT HEADER ──────────────────────────── */
.hero-hdr{
  background:linear-gradient(160deg,#4c1d95 0%,#6d28d9 45%,#a78bfa 100%);
  padding:48px 24px 0;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.hero-hdr::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.07);pointer-events:none}
.hero-hdr::after{content:'';position:absolute;bottom:80px;left:-40px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.05);pointer-events:none}
.hero-av{width:80px;height:80px;border-radius:22px;margin:0 auto 14px;background:rgba(255,255,255,.18);border:2.5px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#fff;letter-spacing:-.03em;position:relative;z-index:1;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.25)}
.hero-av img{width:100%;height:100%;object-fit:cover}
.hero-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.28);color:#fff;border-radius:20px;padding:4px 12px;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:12px;position:relative;z-index:1}
.hero-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:blink 2.5s infinite;flex-shrink:0}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.hero-title{font-size:26px;font-weight:800;color:#fff;letter-spacing:-.04em;line-height:1.15;margin-bottom:8px;position:relative;z-index:1}
.hero-sub{font-size:13px;color:rgba(255,255,255,.72);line-height:1.55;max-width:280px;margin:0 auto 24px;position:relative;z-index:1}

/* Stats glassmorphism */
.hero-stats{display:flex;gap:8px;justify-content:center;padding-bottom:0;position:relative;z-index:1;transform:translateY(50%)}
.hero-stat{background:rgba(255,255,255,.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:10px 16px;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:72px}
.stat-num{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.03em}
.stat-lbl{font-size:9.5px;color:rgba(255,255,255,.62);font-weight:600;letter-spacing:.04em;text-transform:uppercase}

/* ─── CONTENT CARD (dark, overlaps hero) ──────────────── */
.content-area{
  flex:1;
  background:var(--bg);
  border-radius:24px 24px 0 0;
  margin-top:0;
  padding:44px 18px 90px;
  display:flex;
  flex-direction:column;
  gap:20px;
  position:relative;
}

/* ─── WELCOME TEXT ──────────────────────────────────── */
.welcome-text{font-size:13.5px;color:var(--muted);line-height:1.65;padding:0 2px}

/* ─── SECTION LABEL ─────────────────────────────────── */
.sec-hdr{display:flex;align-items:center;justify-content:space-between}
.sec-hdr-title{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-.02em}
.sec-hdr-count{font-size:12px;color:var(--muted2);font-weight:600}

/* ─── SERVICE LIST ───────────────────────────────────── */
.svc-list{display:flex;flex-direction:column;gap:8px}
.svc-item{width:100%;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;display:flex;align-items:center;gap:14px;cursor:pointer;font-family:inherit;text-align:left;-webkit-tap-highlight-color:transparent;transition:background .18s,border-color .18s,transform .18s;position:relative;overflow:hidden}
.svc-item::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--accent),var(--accent-light));opacity:0;transition:opacity .2s;pointer-events:none;border-radius:inherit}
.svc-item:hover{background:#1f1f28;border-color:rgba(124,58,237,.35)}
.svc-item:active{transform:scale(.97)}
.svc-item.active{border-color:rgba(124,58,237,.5);background:#1a1627}
.svc-icon-wrap{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.svc-item-info{flex:1;min-width:0}
.svc-item-title{font-size:14px;font-weight:700;color:var(--text);letter-spacing:-.02em;margin-bottom:3px}
.svc-item-desc{font-size:12px;color:var(--muted);line-height:1.4}
.svc-item-tag{font-size:10px;font-weight:700;color:var(--accent-light);background:rgba(124,58,237,.15);border-radius:6px;padding:2px 8px;margin-top:5px;display:inline-block}
.svc-arrow{flex-shrink:0;width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;transition:background .18s}
.svc-item:hover .svc-arrow{background:rgba(124,58,237,.25)}
.svc-arrow svg{stroke:var(--muted);width:14px;height:14px;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .18s}
.svc-item:hover .svc-arrow svg{stroke:var(--accent-light)}

/* ─── CONTACT COMPACT ───────────────────────────────── */
.contact-compact{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.cc-row{display:flex;align-items:center;gap:12px;padding:12px 16px;text-decoration:none;color:var(--text);font-size:13px;font-weight:500;border-bottom:1px solid var(--border);transition:background .15s;-webkit-tap-highlight-color:transparent}
.cc-row:last-child{border-bottom:none}
a.cc-row:hover{background:rgba(255,255,255,.04)}
.cc-icon{width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cc-icon svg{width:13px;height:13px;stroke:var(--muted);stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}

/* ─── ANCHOR & SCROLL TARGET ─────────────────────────── */
#svc-anchor{height:1px}
.action-hint{text-align:center;font-size:12px;color:var(--muted2);padding:4px 0;display:flex;align-items:center;justify-content:center;gap:6px}
.action-hint svg{width:14px;height:14px;stroke:var(--muted2);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;animation:bounce 2s infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}

/* ─── STICKY CTA BAR ─────────────────────────────────── */
.cta-bar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:12px 18px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(to top,var(--bg) 70%,transparent);display:flex;flex-direction:column;gap:8px;z-index:100}
.cta-btn{width:100%;border:none;border-radius:14px;padding:15px 20px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em;transition:all .2s;-webkit-tap-highlight-color:transparent}
.cta-btn:active{transform:scale(.97)}
.cta-primary{background:#fff;color:#111}
.cta-primary:hover{opacity:.9}
.cta-secondary{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.12)}
.cta-secondary:hover{background:rgba(255,255,255,.13)}

/* ─── FOOTER ────────────────────────────────────────── */
.pg-footer{text-align:center;font-size:11px;color:var(--muted2);padding:4px 0}
.pg-footer strong{color:rgba(255,255,255,.3);font-weight:600}

/* ─── SLIDE PANELS ──────────────────────────────────── */
.quote-panel{position:fixed;top:0;left:50%;transform:translateX(-50%) translateX(100vw);width:100%;max-width:480px;height:100%;z-index:500;background:#111115;transition:transform .4s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;will-change:transform;padding-top:env(safe-area-inset-top)}
.quote-panel.open{transform:translateX(-50%) translateX(0)}
.qp-header{height:58px;display:flex;align-items:center;padding:0 8px 0 4px;background:rgba(17,17,21,.95);border-bottom:1px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);flex-shrink:0}
.qp-back{background:none;border:none;color:#fff;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:3px;padding:10px;-webkit-tap-highlight-color:transparent;flex-shrink:0;transition:opacity .15s}
.qp-back svg{width:17px;height:17px;flex-shrink:0;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.qp-back:hover{opacity:.5}
.qp-title{flex:1;text-align:center;font-size:15px;font-weight:700;letter-spacing:-.03em;color:#fff}
.qp-spacer{width:72px;flex-shrink:0}
.qp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px 20px;background:#111115}
.qp-footer{padding:10px 16px;padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(17,17,21,.95);border-top:1px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);flex-shrink:0}
.qp-section-title{font-size:10.5px;font-weight:700;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.1em;padding:18px 0 10px}
.qp-input{display:block;width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 16px;color:#fff;font-size:15px;font-family:inherit;outline:none;-webkit-appearance:none;transition:border-color .2s;margin-bottom:10px}
.qp-input:focus{border-color:rgba(255,255,255,.3)}
.qp-input:disabled{opacity:.4}
.qp-input::placeholder{color:rgba(255,255,255,.2)}
.qp-error{font-size:12.5px;color:#f87171;display:none;padding:0 2px 8px}
.qp-btn{display:block;width:100%;background:#fff;border:none;border-radius:12px;padding:14px;color:#111;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em;transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent}
.qp-btn:hover{opacity:.88}
.qp-btn:active{transform:scale(.98)}
.qp-btn:disabled{opacity:.22;cursor:default}
.qp-cart-bar{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:11px 14px;margin-bottom:10px}
.qp-cart-info{font-size:13px;color:rgba(255,255,255,.5)}
.qp-cart-total{font-size:14px;font-weight:700;color:#fff}
.qp-summary{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:13px 14px;margin-bottom:4px}
.product-cards{display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;margin-top:4px}
.product-card{background:#18181e;padding:13px 14px;display:flex;align-items:center;gap:12px}
.product-info{flex:1;min-width:0}
.product-name{font-size:14px;font-weight:600;margin-bottom:2px;color:#fff}
.product-desc{font-size:12px;color:rgba(255,255,255,.4);line-height:1.35;margin-bottom:4px}
.product-price{font-size:13px;font-weight:700;color:#fff}
.qty-ctrl{display:flex;align-items:center;gap:7px;flex-shrink:0}
.qty-btn{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:16px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.qty-btn:hover{background:rgba(255,255,255,.14)}
.qty-btn:active{transform:scale(.88)}
.qty-btn:disabled{opacity:.22;cursor:default}
.qty-num{font-size:15px;font-weight:700;min-width:18px;text-align:center;color:#fff}
.cart-summary{margin-top:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:11px 13px;display:none}
.cart-summary.visible{display:block}
.cart-line{display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.4);margin-bottom:5px}
.cart-total{display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:#fff;padding-top:7px;border-top:1px solid rgba(255,255,255,.09);margin-top:3px}
.cart-hint{font-size:12.5px;color:rgba(255,255,255,.35);text-align:center;padding:2px 0}
.cart-confirm-btn{margin-top:12px;width:100%;background:#fff;border:none;border-radius:12px;padding:13px;color:#111;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em;transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent}
.cart-confirm-btn:hover{opacity:.88}
.cart-confirm-btn:active{transform:scale(.98)}
.cart-confirm-btn:disabled{opacity:.22;cursor:default}
.bp-dates{display:flex;flex-direction:column;gap:6px}
.bp-date-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:13px 14px;display:flex;align-items:center;gap:13px;cursor:pointer;transition:background .2s;-webkit-tap-highlight-color:transparent}
.bp-date-card:hover{background:rgba(255,255,255,.09)}
.bp-date-card:active{transform:scale(.97)}
.bp-date-icon{width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;gap:1px}
.bp-provider-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;font-weight:700}
.bp-date-day{font-size:9px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.06em}
.bp-date-num{font-size:19px;font-weight:700;color:#fff;line-height:1}
.bp-date-info{flex:1;min-width:0}
.bp-date-label{font-size:14px;font-weight:600;margin-bottom:2px;color:#fff}
.bp-date-slots{font-size:12px;color:rgba(255,255,255,.4)}
.bp-date-arrow{width:14px;height:14px;stroke:rgba(255,255,255,.25);flex-shrink:0;stroke-width:2}
.bp-times{display:flex;flex-wrap:wrap;gap:6px}
.bp-time-chip{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 16px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.bp-time-chip:hover{background:#fff;color:#111;border-color:#fff}
.bp-time-chip:active{transform:scale(.93)}
.qp-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 0;gap:14px;color:rgba(255,255,255,.35);font-size:14px}
.qp-loading-spinner{width:26px;height:26px;border:2px solid rgba(255,255,255,.1);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.qp-empty{display:flex;flex-direction:column;align-items:center;padding:48px 8px 16px;gap:6px;text-align:center}
.qp-empty-icon{font-size:36px;margin-bottom:6px;opacity:.5}
.qp-empty-msg{font-size:14px;color:rgba(255,255,255,.35);line-height:1.55;margin-bottom:12px}
.qp-empty-actions{display:flex;flex-direction:column;gap:8px;width:100%}
.qp-empty-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px 16px;font-size:14px;font-weight:500;color:#fff;cursor:pointer;font-family:inherit;transition:background .15s;-webkit-tap-highlight-color:transparent}
.qp-empty-btn:hover{background:rgba(255,255,255,.12)}

::-webkit-scrollbar{width:0;height:0}
`;
}
