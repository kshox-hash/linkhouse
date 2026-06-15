export function portalStyles(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0b0f;
  --s1:#111318;
  --s2:#191c24;
  --s3:#20242f;
  --border:rgba(255,255,255,.065);
  --border-accent:rgba(91,156,246,.18);
  --primary:#5b9cf6;
  --primary-dim:rgba(91,156,246,.12);
  --primary-glow:rgba(91,156,246,.25);
  --accent:#a78bfa;
  --accent-dim:rgba(167,139,250,.12);
  --text:#e2e4ea;
  --muted:#565e75;
  --muted2:#8891a8;
  --green:#34d399;
  --hdr:56px;
  --nav:58px;
  --r:16px;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}

/* HEADER */
.hdr{position:fixed;top:0;left:0;right:0;height:var(--hdr);background:rgba(10,11,15,.92);border-bottom:1px solid rgba(91,156,246,.1);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);display:flex;align-items:center;gap:10px;padding:0 16px;z-index:200}
.hdr-name{font-size:15px;font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.02em}
.hdr-badge{font-size:10px;font-weight:600;background:rgba(52,211,153,.1);color:var(--green);border:1px solid rgba(52,211,153,.22);border-radius:20px;padding:3px 10px;display:flex;align-items:center;gap:5px;flex-shrink:0;box-shadow:0 0 14px rgba(52,211,153,.1)}
.hdr-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);animation:bpulse 2.5s infinite;box-shadow:0 0 6px var(--green)}
@keyframes bpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.8)}}

/* LAYOUT */
.main{position:fixed;top:var(--hdr);bottom:calc(var(--nav) + env(safe-area-inset-bottom));left:0;right:0;overflow:hidden}
.panel{position:absolute;inset:0;display:none;flex-direction:column;overflow:hidden}
.panel.active{display:flex}
.panel-scroll{flex:1;overflow-y:auto;padding:20px 16px 16px;-webkit-overflow-scrolling:touch}

/* BOTTOM NAV */
.bottom-nav{position:fixed;bottom:0;left:0;right:0;height:calc(var(--nav) + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);background:rgba(10,11,15,.95);border-top:1px solid rgba(255,255,255,.055);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);display:flex;align-items:flex-start;padding-top:8px;z-index:200}
.bn-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;color:var(--muted);cursor:pointer;font-family:inherit;padding:4px 0;-webkit-tap-highlight-color:transparent;transition:color .2s;position:relative}
.bn-item svg{width:21px;height:21px;transition:transform .2s}
.bn-item span{font-size:10px;font-weight:500;letter-spacing:.03em;transition:color .2s}
.bn-item.active{color:var(--primary)}
.bn-item.active svg{transform:scale(1.08)}
.bn-item.active::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:28px;height:3px;background:var(--primary);border-radius:0 0 8px 8px;box-shadow:0 1px 8px var(--primary-glow)}
.bn-item:active{opacity:.55}

/* CHAT — messages */
.chat-msgs{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:18px 14px 28px;display:flex;flex-direction:column;gap:0;background:var(--bg)}
.user-row{display:flex;justify-content:flex-end;margin:4px 0 16px;animation:msgIn .22s cubic-bezier(.34,1.56,.64,1) both}
.user-pill{max-width:78%;background:linear-gradient(135deg,rgba(91,156,246,.3),rgba(91,156,246,.15));border:1px solid rgba(91,156,246,.32);border-radius:22px 22px 5px 22px;padding:11px 16px;font-size:15px;line-height:1.56;color:#fff;word-break:break-word;box-shadow:0 2px 14px rgba(91,156,246,.12)}
.ai-row{display:flex;gap:11px;align-items:flex-start;margin:4px 0 20px;animation:msgIn .24s cubic-bezier(.34,1.56,.64,1) both}
.ai-row--intro{margin-bottom:10px}
@keyframes msgIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.ai-icon-sm{width:34px;height:34px;border-radius:12px;flex-shrink:0;margin-top:1px;background:linear-gradient(145deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;box-shadow:0 4px 16px rgba(91,156,246,.45),0 0 0 1.5px rgba(91,156,246,.2)}
.ai-body{flex:1;min-width:0}
.ai-label{font-size:10.5px;font-weight:700;color:var(--primary);margin-bottom:5px;letter-spacing:.06em;text-transform:uppercase;opacity:.75}
.ai-greeting{font-size:15.5px;line-height:1.72;color:var(--text);margin-bottom:0}
.ai-text{font-size:15.5px;line-height:1.75;color:var(--text);word-break:break-word}
.ai-text b{color:#fff;font-weight:600}
.ai-text.typing::after{content:'▋';color:var(--primary);animation:blink .9s step-end infinite;font-size:12px;vertical-align:middle;margin-left:1px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.typing-row{display:flex;gap:11px;align-items:flex-start;margin:4px 0 8px;animation:msgIn .18s ease-out both}
.typing-dots{display:flex;align-items:center;gap:5px;padding:10px 2px}
.typing-dots span{width:7px;height:7px;border-radius:50%;background:var(--muted2);animation:tdot 1.4s ease-in-out infinite}
.typing-dots span:nth-child(2){animation-delay:.17s}
.typing-dots span:nth-child(3){animation-delay:.34s}
@keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.4}28%{transform:translateY(-7px);opacity:1}}

/* CHAT — módulos IA */
.ai-modules{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.ai-mod-card{background:linear-gradient(135deg,var(--s2),rgba(25,29,38,.96));border:1px solid rgba(255,255,255,.07);border-radius:15px;padding:13px 14px;display:flex;align-items:center;gap:13px;cursor:pointer;transition:background .2s,border-color .2s,transform .15s,box-shadow .2s;-webkit-tap-highlight-color:transparent;font-family:inherit;color:var(--text);text-align:left;width:100%}
.ai-mod-card:hover{background:linear-gradient(135deg,var(--s3),rgba(32,36,48,.96));border-color:rgba(91,156,246,.28);box-shadow:0 6px 22px rgba(0,0,0,.28),inset 0 0 0 1px rgba(91,156,246,.07);transform:translateX(2px)}
.ai-mod-card:active{transform:scale(.97)}
.ai-mod-card.used{opacity:.28;pointer-events:none;filter:grayscale(.6)}
.ai-mod-emoji{font-size:19px;flex-shrink:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(91,156,246,.1);border-radius:12px;border:1px solid rgba(91,156,246,.14)}
.ai-mod-texts{flex:1;min-width:0}
.ai-mod-title{font-size:13.5px;font-weight:600;margin-bottom:2px;color:#fff;letter-spacing:-.01em}
.ai-mod-desc{font-size:12px;color:var(--muted2);line-height:1.4}
.ai-mod-arrow{width:15px;height:15px;flex-shrink:0;stroke:var(--muted);opacity:.4}

/* CHAT — chips de sugerencia */
.ai-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px}
.ai-chip{background:rgba(91,156,246,.08);border:1px solid rgba(91,156,246,.28);border-radius:20px;padding:8px 16px;font-size:13px;font-weight:500;color:var(--primary);cursor:pointer;transition:background .18s,border-color .18s,transform .15s,box-shadow .18s,opacity .2s;-webkit-tap-highlight-color:transparent;font-family:inherit;white-space:nowrap;letter-spacing:.01em}
.ai-chip:hover{background:rgba(91,156,246,.16);border-color:rgba(91,156,246,.55);box-shadow:0 3px 14px rgba(91,156,246,.14);transform:translateY(-1px)}
.ai-chip:active{transform:scale(.94)}
.ai-chip.used{opacity:.25;pointer-events:none}

/* CHAT — formulario inline */
.chat-form{display:flex;flex-direction:column;gap:9px;margin-top:13px}
.chat-form-input{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;color:var(--text);font-size:14.5px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none}
.chat-form-input:focus{border-color:rgba(91,156,246,.55);box-shadow:0 0 0 3px rgba(91,156,246,.09),0 0 0 1px rgba(91,156,246,.15) inset}
.chat-form-input:disabled{opacity:.45}
.chat-form-input::placeholder{color:var(--muted)}
.chat-form-error{font-size:12.5px;color:#f87171;display:none;padding:2px 2px 0}
.chat-form-btn{background:linear-gradient(135deg,var(--primary),#4a8de0);border:none;border-radius:12px;padding:13px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.01em;transition:opacity .15s,transform .12s,box-shadow .18s;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 16px rgba(91,156,246,.28)}
.chat-form-btn:hover{opacity:.9;box-shadow:0 6px 22px rgba(91,156,246,.38)}
.chat-form-btn:active{transform:scale(.98)}
.chat-form-btn:disabled{opacity:.4;cursor:default;box-shadow:none}

/* CHAT — tarjetas de producto */
.product-cards{display:flex;flex-direction:column;gap:8px;margin-top:13px}
.product-card{background:var(--s2);border:1px solid var(--border);border-radius:14px;padding:13px 14px;display:flex;align-items:center;gap:12px;transition:border-color .18s}
.product-card:has(.qty-num:not(:empty)[data-qty]):not([data-qty="0"]){border-color:rgba(91,156,246,.3)}
.product-info{flex:1;min-width:0}
.product-name{font-size:14px;font-weight:600;margin-bottom:2px}
.product-desc{font-size:12px;color:var(--muted2);line-height:1.35;margin-bottom:4px}
.product-price{font-size:13px;font-weight:700;color:var(--primary)}
.qty-ctrl{display:flex;align-items:center;gap:7px;flex-shrink:0}
.qty-btn{width:30px;height:30px;border-radius:9px;background:var(--s3);border:1px solid var(--border);color:var(--text);font-size:17px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s,border-color .14s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.qty-btn:hover{background:var(--s1);border-color:rgba(91,156,246,.35)}
.qty-btn:active{transform:scale(.88)}
.qty-btn:disabled{opacity:.28;cursor:default}
.qty-num{font-size:15px;font-weight:700;min-width:18px;text-align:center;color:var(--text)}
.cart-summary{margin-top:10px;background:var(--s2);border:1px solid rgba(91,156,246,.2);border-radius:13px;padding:11px 13px;display:none}
.cart-summary.visible{display:block}
.cart-line{display:flex;justify-content:space-between;font-size:13px;color:var(--muted2);margin-bottom:5px}
.cart-total{display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:var(--primary);padding-top:7px;border-top:1px solid var(--border);margin-top:3px}
.cart-hint{font-size:12.5px;color:var(--muted2);text-align:center;padding:2px 0}
.cart-confirm-btn{margin-top:12px;width:100%;background:linear-gradient(135deg,var(--primary),var(--accent));border:none;border-radius:13px;padding:14px;color:#fff;font-size:14.5px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em;transition:opacity .15s,transform .12s,box-shadow .18s;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 18px rgba(91,156,246,.3)}
.cart-confirm-btn:hover{opacity:.9;box-shadow:0 6px 24px rgba(91,156,246,.4)}
.cart-confirm-btn:active{transform:scale(.98)}
.cart-confirm-btn:disabled{opacity:.35;cursor:default;box-shadow:none}

/* CHAT — tarjeta de confirmación */
.confirm-card{background:linear-gradient(145deg,rgba(91,156,246,.09),rgba(167,139,250,.05));border:1px solid rgba(91,156,246,.25);border-radius:16px;padding:16px;margin-top:4px;box-shadow:0 4px 22px rgba(91,156,246,.07)}
.confirm-title{font-size:15.5px;font-weight:700;margin-bottom:12px;color:#fff}
.confirm-row{display:flex;gap:10px;margin-bottom:7px;font-size:13.5px}
.confirm-label{color:var(--muted2);flex-shrink:0;min-width:60px}
.confirm-value{color:var(--text);font-weight:500}
.confirm-note{font-size:12px;color:var(--muted2);margin-top:10px;padding-top:9px;border-top:1px solid var(--border)}

/* OTHER TABS */
.sec-label{font-size:11px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;padding:18px 0 10px}
.mod-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);padding:16px 15px;display:flex;align-items:center;gap:13px;text-decoration:none;color:inherit;margin-bottom:8px;transition:background .18s,border-color .18s,box-shadow .18s;-webkit-tap-highlight-color:transparent;cursor:pointer}
.mod-card:hover{background:var(--s2);border-color:var(--border-accent);box-shadow:0 4px 18px rgba(0,0,0,.18)}
.mod-card:active{background:var(--s2);border-color:rgba(91,156,246,.25)}
.mod-icon{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mod-icon svg{width:22px;height:22px}
.mod-texts{flex:1;min-width:0}
.mod-title{font-size:15px;font-weight:600;margin-bottom:3px;letter-spacing:-.01em}
.mod-desc{font-size:13px;color:var(--muted2);line-height:1.4}
.mod-arrow svg{width:16px;height:16px;stroke:var(--muted)}
.steps-list{display:flex;flex-direction:column;gap:8px;margin-top:4px}
.step-item{display:flex;align-items:center;gap:12px;background:var(--s1);border:1px solid var(--border);border-radius:13px;padding:12px 14px}
.step-num{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.step-text{font-size:13.5px;line-height:1.4}

/* NOSOTROS */
.biz-hero{display:flex;flex-direction:column;align-items:center;padding:28px 0 22px;text-align:center}
.biz-av{width:76px;height:76px;border-radius:24px;background:linear-gradient(145deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;margin-bottom:14px;box-shadow:0 8px 32px rgba(91,156,246,.38),0 0 0 2px rgba(91,156,246,.2)}
.biz-name{font-size:20px;font-weight:700;letter-spacing:-.022em;margin-bottom:4px}
.biz-tag{font-size:13px;color:var(--muted2)}
.info-group{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.info-row{display:flex;align-items:center;gap:13px;padding:14px 15px;text-decoration:none;color:inherit;border-bottom:1px solid var(--border);cursor:default;transition:background .16s}
.info-row:last-child{border-bottom:none}
a.info-row,button.info-row{cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;color:var(--text)}
a.info-row:hover,button.info-row:hover{background:rgba(91,156,246,.04)}
a.info-row:active,button.info-row:active{background:var(--s2)}
.info-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.info-icon svg{width:17px;height:17px}
.info-label{font-size:11px;color:var(--muted2);margin-bottom:2px}
.info-val{font-size:14px;font-weight:500}

/* PANEL COTIZACIÓN (slide-in pantalla completa) */
.quote-panel{position:fixed;top:0;left:0;right:0;bottom:0;z-index:500;background:var(--bg);transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;will-change:transform;padding-top:env(safe-area-inset-top)}
.quote-panel.open{transform:translateX(0)}
.qp-header{height:var(--hdr);display:flex;align-items:center;padding:0 8px 0 4px;background:rgba(10,11,15,.92);border-bottom:1px solid rgba(91,156,246,.1);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);flex-shrink:0}
.qp-back{background:none;border:none;color:var(--primary);font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:3px;padding:10px 10px;-webkit-tap-highlight-color:transparent;flex-shrink:0;transition:opacity .15s}
.qp-back svg{width:18px;height:18px;flex-shrink:0;stroke:var(--primary);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.qp-back:hover{opacity:.75}
.qp-back:active{opacity:.5}
.qp-title{flex:1;text-align:center;font-size:15.5px;font-weight:700;letter-spacing:-.015em;margin-right:8px}
.qp-spacer{width:72px;flex-shrink:0}
.qp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px 20px}
.qp-footer{padding:10px 16px;padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(10,11,15,.93);border-top:1px solid rgba(91,156,246,.1);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);flex-shrink:0}
.qp-section-title{font-size:11px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;padding:18px 0 10px}
.qp-input{display:block;width:100%;background:var(--s2);border:1px solid var(--border);border-radius:13px;padding:14px 16px;color:var(--text);font-size:15px;font-family:inherit;outline:none;-webkit-appearance:none;transition:border-color .2s,box-shadow .2s;margin-bottom:10px}
.qp-input:focus{border-color:rgba(91,156,246,.55);box-shadow:0 0 0 4px rgba(91,156,246,.09)}
.qp-input:disabled{opacity:.45}
.qp-input::placeholder{color:var(--muted)}
.qp-error{font-size:12.5px;color:#f87171;display:none;padding:0 2px 8px}
.qp-btn{display:block;width:100%;background:linear-gradient(135deg,var(--primary),var(--accent));border:none;border-radius:14px;padding:15px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.01em;transition:opacity .15s,transform .12s,box-shadow .18s;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 20px rgba(91,156,246,.35)}
.qp-btn:hover{opacity:.92;box-shadow:0 6px 28px rgba(91,156,246,.45)}
.qp-btn:active{transform:scale(.98)}
.qp-btn:disabled{opacity:.38;cursor:default;box-shadow:none}
.qp-cart-bar{display:flex;align-items:center;justify-content:space-between;background:var(--s2);border:1px solid rgba(91,156,246,.2);border-radius:13px;padding:11px 14px;margin-bottom:10px}
.qp-cart-info{font-size:13px;color:var(--muted2)}
.qp-cart-total{font-size:14px;font-weight:700;color:var(--primary)}
.qp-summary{background:var(--s2);border:1px solid var(--border);border-radius:13px;padding:13px 14px;margin-bottom:4px}

/* BOOKING PANEL — fechas y horarios */
.bp-dates{display:flex;flex-direction:column;gap:8px}
.bp-date-card{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:13px 14px;display:flex;align-items:center;gap:13px;cursor:pointer;transition:background .18s,border-color .18s,transform .18s,box-shadow .18s;-webkit-tap-highlight-color:transparent}
.bp-date-card:hover{background:var(--s2);border-color:rgba(91,156,246,.3);transform:translateX(3px);box-shadow:0 4px 18px rgba(0,0,0,.2)}
.bp-date-card:active{transform:scale(.97);box-shadow:none}
.bp-date-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(145deg,rgba(91,156,246,.18),rgba(91,156,246,.08));border:1px solid rgba(91,156,246,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;gap:1px}
.bp-date-day{font-size:9.5px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.04em}
.bp-date-num{font-size:18px;font-weight:700;color:var(--primary);line-height:1}
.bp-date-info{flex:1;min-width:0}
.bp-date-label{font-size:14.5px;font-weight:600;margin-bottom:2px;letter-spacing:-.01em}
.bp-date-slots{font-size:12px;color:var(--muted2)}
.bp-date-arrow{width:15px;height:15px;stroke:var(--muted);flex-shrink:0;stroke-width:2;opacity:.45}
.bp-times{display:flex;flex-wrap:wrap;gap:8px}
.bp-time-chip{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:11px 18px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer;transition:background .16s,border-color .16s,color .16s,box-shadow .16s,transform .14s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.bp-time-chip:hover{background:rgba(91,156,246,.12);border-color:rgba(91,156,246,.45);color:var(--primary);box-shadow:0 2px 12px rgba(91,156,246,.14);transform:scale(1.04)}
.bp-time-chip:active{transform:scale(.94)}
.qp-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 0;gap:14px;color:var(--muted2);font-size:14px}
.qp-loading-spinner{width:32px;height:32px;border:2.5px solid rgba(91,156,246,.15);border-top-color:var(--primary);border-radius:50%;animation:qpspin .72s linear infinite;box-shadow:0 0 12px rgba(91,156,246,.15)}
@keyframes qpspin{to{transform:rotate(360deg)}}
.qp-empty{display:flex;flex-direction:column;align-items:center;padding:48px 8px 16px;gap:6px;text-align:center}
.qp-empty-icon{font-size:42px;margin-bottom:6px}
.qp-empty-msg{font-size:14.5px;color:var(--muted2);line-height:1.55;margin-bottom:12px}
.qp-empty-actions{display:flex;flex-direction:column;gap:8px;width:100%}
.qp-empty-btn{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;font-weight:500;color:var(--text);cursor:pointer;font-family:inherit;transition:background .16s,border-color .16s;-webkit-tap-highlight-color:transparent}
.qp-empty-btn:hover{background:var(--s2);border-color:var(--border-accent)}
.qp-empty-btn:active{background:var(--s2)}

::-webkit-scrollbar{width:0;height:0}
`;
}
