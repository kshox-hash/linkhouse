export function portalStyles(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0c0c0f;
  --card:#141418;
  --card2:#1a1a20;
  --border:rgba(255,255,255,.07);
  --border2:rgba(255,255,255,.12);
  --text:#ffffff;
  --muted:rgba(255,255,255,.48);
  --muted2:rgba(255,255,255,.24);
  --accent:#818cf8;
  --green:#4ade80;
  --r:18px;
}
html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}

/* ─── PAGE ──────────────────────────────────────────── */
.page{max-width:480px;margin:0 auto;padding-bottom:64px;display:flex;flex-direction:column;gap:10px}

/* ─── HEADER ────────────────────────────────────────── */
.site-header{display:flex;align-items:center;gap:12px;padding:20px 18px 10px}
.site-avatar{width:38px;height:38px;border-radius:10px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;letter-spacing:-.02em}
.site-avatar img{width:100%;height:100%;border-radius:10px;object-fit:cover}
.site-info{flex:1;min-width:0}
.site-name{font-size:14px;font-weight:700;color:var(--text);letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.site-tagline{font-size:11px;color:var(--muted);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.site-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(74,222,128,.1);color:var(--green);border:1px solid rgba(74,222,128,.18);border-radius:20px;padding:5px 11px;font-size:9px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;flex-shrink:0}
.badge-dot{width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0;animation:blink 2.5s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}

/* ─── HERO CARD ─────────────────────────────────────── */
.hero-card{margin:0 14px;border-radius:22px;background:var(--card);border:1px solid var(--border);overflow:hidden;display:flex;min-height:195px;position:relative}
.hero-text{padding:22px 20px;flex:1;display:flex;flex-direction:column;justify-content:flex-end;position:relative;z-index:1}
.hero-label{font-size:9px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:.14em;margin-bottom:9px}
.hero-title{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.04em;line-height:1.18;margin-bottom:8px}
.hero-sub{font-size:12px;color:var(--muted);line-height:1.55;max-width:180px}
.hero-art{width:155px;flex-shrink:0;position:relative;overflow:hidden;background:
  radial-gradient(ellipse 90% 65% at 85% 12%, rgba(167,139,250,.96) 0%, transparent 52%),
  radial-gradient(ellipse 75% 80% at 18% 72%, rgba(251,191,36,.62) 0%, transparent 55%),
  radial-gradient(ellipse 80% 58% at 52% 88%, rgba(96,165,250,.82) 0%, transparent 50%),
  radial-gradient(ellipse 65% 62% at 28% 12%, rgba(251,113,133,.88) 0%, transparent 48%),
  radial-gradient(ellipse 55% 55% at 62% 42%, rgba(52,211,153,.48) 0%, transparent 44%),
  var(--card)}
.hero-art::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,var(--card) 0%,transparent 28%)}

/* ─── SECTION LABEL ─────────────────────────────────── */
.sec-label{display:flex;align-items:center;justify-content:space-between;padding:6px 18px 0}
.sec-label-title{font-size:16px;font-weight:800;color:var(--text);letter-spacing:-.03em}
.sec-label-sub{font-size:11px;color:var(--muted2)}

/* ─── MODULE GRID ───────────────────────────────────── */
.mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 14px}
.mod-card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;font-family:inherit;text-align:left;display:flex;flex-direction:column;-webkit-tap-highlight-color:transparent;transition:transform .2s,border-color .2s,box-shadow .2s}
.mod-card:hover{transform:translateY(-2px);border-color:var(--border2);box-shadow:0 8px 32px rgba(0,0,0,.35)}
.mod-card:active{transform:scale(.96)}
.mod-art{height:125px;width:100%;flex-shrink:0;position:relative}
.art-reservas{background:
  radial-gradient(circle at 38% 34%, rgba(255,255,255,.65) 0%, transparent 22%),
  radial-gradient(circle at 64% 68%, rgba(255,255,255,.1) 0%, transparent 18%),
  radial-gradient(circle at 50% 50%, #f9a8d4 0%, #ec4899 40%, #831843 100%)}
.art-cotizador{background:
  radial-gradient(ellipse 80% 55% at 72% 28%, rgba(167,139,250,.9) 0%, transparent 52%),
  radial-gradient(ellipse 65% 72% at 20% 68%, rgba(99,102,241,.85) 0%, transparent 50%),
  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(56,189,248,.35) 0%, transparent 55%),
  #0f0b2a}
.art-0{background:radial-gradient(circle at 38% 34%, rgba(255,255,255,.55) 0%, transparent 22%),radial-gradient(circle at 50% 50%, #86efac 0%, #22c55e 40%, #14532d 100%)}
.art-1{background:radial-gradient(circle at 38% 34%, rgba(255,255,255,.55) 0%, transparent 22%),radial-gradient(circle at 50% 50%, #fde68a 0%, #f59e0b 42%, #78350f 100%)}
.art-2{background:radial-gradient(ellipse 80% 55% at 72% 28%, rgba(251,113,133,.9) 0%, transparent 50%),radial-gradient(ellipse 60% 70% at 20% 68%, rgba(239,68,68,.8) 0%, transparent 50%),#1a0a0a}
.mod-body{padding:12px 13px 14px;flex:1;display:flex;flex-direction:column;gap:4px}
.mod-card-title{font-size:13px;font-weight:700;color:var(--text);letter-spacing:-.02em;line-height:1.25}
.mod-card-desc{font-size:11px;color:var(--muted);line-height:1.45}

/* ─── CONTACT ───────────────────────────────────────── */
.contact-card{margin:0 14px;background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.contact-row{display:flex;align-items:center;gap:13px;padding:13px 16px;text-decoration:none;color:var(--text);font-size:13px;font-weight:500;border-bottom:1px solid var(--border);transition:background .15s;-webkit-tap-highlight-color:transparent}
.contact-row:last-child{border-bottom:none}
a.contact-row:hover{background:rgba(255,255,255,.04)}
.ci-wrap{width:31px;height:31px;border-radius:8px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ci{width:14px;height:14px;stroke:var(--muted);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}

/* ─── FOOTER ────────────────────────────────────────── */
.pg-footer{text-align:center;font-size:11px;color:var(--muted2);padding:16px 0 0}
.pg-footer strong{color:rgba(255,255,255,.3);font-weight:600}

/* ─── SLIDE PANELS ──────────────────────────────────── */
.quote-panel{position:fixed;top:0;left:0;right:0;bottom:0;z-index:500;background:#111114;transform:translateX(100%);transition:transform .36s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;will-change:transform;max-width:480px;padding-top:env(safe-area-inset-top)}
.quote-panel.open{transform:translateX(0)}
.qp-header{height:58px;display:flex;align-items:center;padding:0 8px 0 4px;background:rgba(17,17,20,.96);border-bottom:1px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);flex-shrink:0}
.qp-back{background:none;border:none;color:#fff;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:3px;padding:10px;-webkit-tap-highlight-color:transparent;flex-shrink:0;transition:opacity .15s}
.qp-back svg{width:17px;height:17px;flex-shrink:0;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.qp-back:hover{opacity:.5}
.qp-back:active{opacity:.3}
.qp-title{flex:1;text-align:center;font-size:15px;font-weight:700;letter-spacing:-.03em;color:#fff}
.qp-spacer{width:72px;flex-shrink:0}
.qp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px 20px;background:#111114}
.qp-footer{padding:10px 16px;padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(17,17,20,.96);border-top:1px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);flex-shrink:0}
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
.qp-cart-info{font-size:13px;color:var(--muted)}
.qp-cart-total{font-size:14px;font-weight:700;color:#fff}
.qp-summary{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:13px 14px;margin-bottom:4px}
.product-cards{display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;margin-top:4px}
.product-card{background:#161619;padding:13px 14px;display:flex;align-items:center;gap:12px}
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
