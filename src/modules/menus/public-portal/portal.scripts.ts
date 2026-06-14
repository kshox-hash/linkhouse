import { MenuModuleItem } from "../user-modules.repository";

type ProductData = { id: string | number; name: string; price: number; description?: string | null };
type ModuleCard  = { emoji: string; title: string; desc: string; action: string };

function buildModuleCards(modules: MenuModuleItem[]): ModuleCard[] {
  const cards: ModuleCard[] = [];
  if (modules.some(m => m.code === "reservas"))
    cards.push({ emoji: "📅", title: "Reservar una hora", desc: "Agenda tu cita disponible", action: "reservas" });
  if (modules.some(m => m.code === "cotizador"))
    cards.push({ emoji: "🧾", title: "Pedir cotización", desc: "Recibe un presupuesto por correo", action: "cotizar" });
  cards.push({ emoji: "💰", title: "Consultar precios",      desc: "Conoce nuestras tarifas",     action: "precios" });
  cards.push({ emoji: "💬", title: "¿Qué servicios ofrecen?", desc: "Descubre lo que hacemos",    action: "info"    });
  return cards;
}

export function portalScripts(
  slug: string,
  bizName: string,
  modules: MenuModuleItem[],
  products: ProductData[]
): string {
  const moduleCards  = buildModuleCards(modules);
  const safeProducts = products.map(p => ({
    id:          String(p.id),
    name:        p.name,
    price:       Number(p.price || 0),
    description: p.description || "",
  }));

  return `
const SLUG=${JSON.stringify(slug)};
const BIZ=${JSON.stringify(bizName)};
const MODULE_CARDS=${JSON.stringify(moduleCards)};
const PRODUCTS=${JSON.stringify(safeProducts)};
const TABS=['chat','reservas','cotizar','nosotros'];
let sending=false;

// ── Estado compartido ─────────────────────────────────────────────────────────
var S={flow:null,date:null,time:null,slots:{},cart:{}};

// ── Tabs ──────────────────────────────────────────────────────────────────────
function showTab(t){
  TABS.forEach(function(x){ document.getElementById('panel-'+x).classList.toggle('active',x===t); });
  var back=document.getElementById('btnBackChat');
  if(back) back.classList.toggle('visible',t!=='chat');
  if(t==='chat') scrollChat();
}

// ── Scroll ────────────────────────────────────────────────────────────────────
function scrollChat(){
  var el=document.getElementById('chatMsgs');
  if(el) requestAnimationFrame(function(){ el.scrollTop=el.scrollHeight; });
}

// ── Utilidades ────────────────────────────────────────────────────────────────
function renderMd(t){
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\\*\\*([^]+?)\\*\\*/g,'<b>$1</b>').replace(/\\n/g,'<br>');
}
function escH(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function formatPrice(n){ return '$'+Number(n||0).toLocaleString('es-CL'); }
function formatDate(d){
  var dt=new Date(d+'T12:00:00');
  var DAYS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var MON=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return DAYS[dt.getDay()]+' '+dt.getDate()+' de '+MON[dt.getMonth()];
}
function parseSlotsResponse(data){
  // API returns { slots: [{date, times}] }
  var result={};
  if(!data||!Array.isArray(data.slots)) return result;
  data.slots.forEach(function(s){ if(s.date&&s.times&&s.times.length) result[s.date]=s.times; });
  return result;
}

// ── Animación de escritura ────────────────────────────────────────────────────
function typeWrite(el,rawText){
  el.classList.add('typing'); var chars=Array.from(rawText); var i=0;
  (function tick(){
    if(i<chars.length){
      var c=chars[i]; i++;
      el.innerHTML=renderMd(chars.slice(0,i).join(''));
      setTimeout(tick,c==='\\n'?80:11); scrollChat();
    } else { el.innerHTML=renderMd(rawText); el.classList.remove('typing'); scrollChat(); }
  })();
}

// ── Constructor base de mensajes AI ──────────────────────────────────────────
function makeAiRow(){
  var row=document.createElement('div'); row.className='ai-row';
  var icon=document.createElement('div'); icon.className='ai-icon-sm'; icon.textContent='✦';
  var body=document.createElement('div'); body.className='ai-body';
  var lbl=document.createElement('div'); lbl.className='ai-label'; lbl.textContent=BIZ;
  body.appendChild(lbl); row.appendChild(icon); row.appendChild(body);
  return {row:row,body:body};
}
function appendAiRow(row){ document.getElementById('chatMsgs').appendChild(row); scrollChat(); }

// ── Mensaje de usuario ────────────────────────────────────────────────────────
function addUser(text){
  var row=document.createElement('div'); row.className='user-row';
  var pill=document.createElement('div'); pill.className='user-pill'; pill.textContent=text;
  row.appendChild(pill); document.getElementById('chatMsgs').appendChild(row); scrollChat();
}

// ── Mensaje AI simple ─────────────────────────────────────────────────────────
function addAi(text,animate){
  var m=makeAiRow();
  var el=document.createElement('div'); el.className='ai-text'; m.body.appendChild(el); appendAiRow(m.row);
  if(animate!==false){ typeWrite(el,text); } else { el.innerHTML=renderMd(text); scrollChat(); }
}

// ── Mensaje AI con chips ──────────────────────────────────────────────────────
function addAiWithChips(text,chips){
  var m=makeAiRow();
  var el=document.createElement('div'); el.className='ai-text'; el.innerHTML=renderMd(text);
  m.body.appendChild(el);
  if(chips&&chips.length){
    var wrap=document.createElement('div'); wrap.className='ai-chips';
    chips.forEach(function(c){
      var btn=document.createElement('button'); btn.type='button'; btn.className='ai-chip'; btn.textContent=c.label;
      btn.addEventListener('click',function(){
        wrap.querySelectorAll('.ai-chip').forEach(function(x){ x.classList.add('used'); });
        addUser(c.label); c.onClick();
      });
      wrap.appendChild(btn);
    });
    m.body.appendChild(wrap);
  }
  appendAiRow(m.row);
}

// ── Indicador de escritura ────────────────────────────────────────────────────
function showTyping(){
  var row=document.createElement('div'); row.className='typing-row'; row.id='typingRow';
  var icon=document.createElement('div'); icon.className='ai-icon-sm'; icon.textContent='✦';
  var dots=document.createElement('div'); dots.className='typing-dots'; dots.innerHTML='<span></span><span></span><span></span>';
  row.appendChild(icon); row.appendChild(dots); document.getElementById('chatMsgs').appendChild(row); scrollChat();
}
function hideTyping(){ var r=document.getElementById('typingRow'); if(r) r.remove(); }

// ── Formulario inline ─────────────────────────────────────────────────────────
function addAiWithForm(text,fields,btnLabel,onSubmit){
  var m=makeAiRow();
  var el=document.createElement('div'); el.className='ai-text'; el.innerHTML=renderMd(text);
  m.body.appendChild(el);
  var form=document.createElement('div'); form.className='chat-form';
  var inputs={};
  fields.forEach(function(f){
    var inp=document.createElement('input');
    inp.type=f.type||'text'; inp.placeholder=f.placeholder; inp.className='chat-form-input';
    if(f.autocomplete) inp.setAttribute('autocomplete',f.autocomplete);
    inputs[f.id]=inp; form.appendChild(inp);
  });
  var err=document.createElement('div'); err.className='chat-form-error';
  var btn=document.createElement('button'); btn.type='button'; btn.className='chat-form-btn'; btn.textContent=btnLabel;
  btn.addEventListener('click',function(){
    var values={}; var ok=true;
    fields.forEach(function(f){
      var val=inputs[f.id].value.trim();
      if(f.required!==false&&!val) ok=false;
      values[f.id]=val;
    });
    if(!ok){ err.textContent='Completa todos los campos requeridos.'; err.style.display='block'; return; }
    err.style.display='none';
    Object.keys(inputs).forEach(function(k){ inputs[k].disabled=true; });
    btn.disabled=true; btn.textContent='Enviando...';
    onSubmit(values);
  });
  form.appendChild(err); form.appendChild(btn); m.body.appendChild(form);
  appendAiRow(m.row);
  setTimeout(function(){ inputs[fields[0].id].focus(); },150);
}

// ── Tarjetas de producto ──────────────────────────────────────────────────────
function addAiWithProductCards(text,products){
  if(!products||!products.length){
    addAi('No hay servicios disponibles en este momento. Contáctanos directamente.',false); return;
  }
  var m=makeAiRow();
  var el=document.createElement('div'); el.className='ai-text'; el.innerHTML=renderMd(text);
  m.body.appendChild(el);

  var cards=document.createElement('div'); cards.className='product-cards';
  var summary=document.createElement('div'); summary.className='cart-summary';
  var confirmBtn=document.createElement('button'); confirmBtn.type='button';
  confirmBtn.className='cart-confirm-btn'; confirmBtn.textContent='Solicitar cotización →';

  function refreshSummary(){
    var lines=[]; var total=0;
    products.forEach(function(p){
      var q=S.cart[p.id]||0;
      if(q>0){ lines.push({name:p.name,q:q,sub:p.price*q}); total+=p.price*q; }
    });
    if(!lines.length){ summary.classList.remove('visible'); return; }
    summary.classList.add('visible');
    var html='';
    lines.forEach(function(l){ html+='<div class="cart-line"><span>'+escH(l.name)+' ×'+l.q+'</span><span>'+formatPrice(l.sub)+'</span></div>'; });
    html+='<div class="cart-total"><span>Total</span><span>'+formatPrice(total)+'</span></div>';
    summary.innerHTML=html;
  }

  products.forEach(function(p){
    var card=document.createElement('div'); card.className='product-card';
    var info=document.createElement('div'); info.className='product-info';
    info.innerHTML='<div class="product-name">'+escH(p.name)+'</div>'
      +(p.description?'<div class="product-desc">'+escH(p.description)+'</div>':'')
      +'<div class="product-price">'+formatPrice(p.price)+'</div>';
    var qc=document.createElement('div'); qc.className='qty-ctrl';
    var minus=document.createElement('button'); minus.type='button'; minus.className='qty-btn'; minus.textContent='−'; minus.disabled=true;
    var num=document.createElement('span'); num.className='qty-num'; num.textContent='0';
    var plus=document.createElement('button'); plus.type='button'; plus.className='qty-btn'; plus.textContent='+';
    (function(pid,numEl,minusEl){
      plus.addEventListener('click',function(){
        S.cart[pid]=(S.cart[pid]||0)+1; numEl.textContent=S.cart[pid]; minusEl.disabled=false; refreshSummary();
      });
      minusEl.addEventListener('click',function(){
        S.cart[pid]=Math.max(0,(S.cart[pid]||0)-1); numEl.textContent=S.cart[pid]; if(!S.cart[pid]) minusEl.disabled=true; refreshSummary();
      });
    })(p.id,num,minus);
    qc.appendChild(minus); qc.appendChild(num); qc.appendChild(plus);
    card.appendChild(info); card.appendChild(qc); cards.appendChild(card);
  });

  confirmBtn.addEventListener('click',function(){
    var hasItems=products.some(function(p){ return (S.cart[p.id]||0)>0; });
    if(!hasItems){
      summary.innerHTML='<div class="cart-hint">Selecciona al menos un servicio para continuar.</div>';
      summary.classList.add('visible'); return;
    }
    confirmBtn.disabled=true;
    cards.querySelectorAll('.qty-btn').forEach(function(b){ b.disabled=true; });
    showQuoteFormStep();
  });

  m.body.appendChild(cards); m.body.appendChild(summary); m.body.appendChild(confirmBtn);
  appendAiRow(m.row);
}

// ── Tarjeta de confirmación ───────────────────────────────────────────────────
function addConfirmCard(icon,title,rows,note){
  var m=makeAiRow();
  var card=document.createElement('div'); card.className='confirm-card';
  var titleEl=document.createElement('div'); titleEl.className='confirm-title'; titleEl.innerHTML=icon+' '+escH(title);
  card.appendChild(titleEl);
  rows.forEach(function(r){
    var row=document.createElement('div'); row.className='confirm-row';
    row.innerHTML='<span class="confirm-label">'+escH(r.label)+'</span><span class="confirm-value">'+escH(r.value)+'</span>';
    card.appendChild(row);
  });
  if(note){
    var noteEl=document.createElement('div'); noteEl.className='confirm-note'; noteEl.textContent=note;
    card.appendChild(noteEl);
  }
  m.body.appendChild(card); appendAiRow(m.row);
}

// ── FLOW: RESERVAS ────────────────────────────────────────────────────────────
function startReservasFlow(){
  S.flow='reservas'; S.date=null; S.time=null;
  showTyping();
  fetch('/api/public/'+SLUG+'/slots')
    .then(function(r){ return r.json(); })
    .then(function(data){
      hideTyping();
      S.slots=parseSlotsResponse(data);
      var dates=Object.keys(S.slots);
      if(!dates.length){
        addAi('No hay horarios disponibles por el momento. Contáctanos directamente.',false); return;
      }
      addAiWithChips(
        '¿Qué día prefieres?',
        dates.slice(0,7).map(function(d){
          return {label:formatDate(d),onClick:(function(date){ return function(){ S.date=date; addUser(formatDate(date)); showTimesStep(date); }; })(d)};
        })
      );
    })
    .catch(function(){ hideTyping(); addAi('No pude cargar la disponibilidad. Intenta de nuevo.',false); });
}

function showTimesStep(date){
  var times=S.slots[date]||[];
  if(!times.length){ addAi('No hay horarios para ese día. Elige otro.',false); return; }
  addAiWithChips(
    '¿A qué hora?',
    times.map(function(t){
      return {label:t,onClick:(function(time){ return function(){ S.time=time; addUser(time); showBookingFormStep(); }; })(t)};
    })
  );
}

function showBookingFormStep(){
  addAiWithForm(
    'Perfecto, casi listo. ¿Me dejas tus datos para la reserva?',
    [
      {id:'name',  placeholder:'Nombre completo',            type:'text',  autocomplete:'name'},
      {id:'phone', placeholder:'Teléfono',                   type:'tel',   autocomplete:'tel'},
      {id:'email', placeholder:'Email (para confirmación)',  type:'email', autocomplete:'email'},
    ],
    'Confirmar reserva',
    function(v){ submitBooking(v); }
  );
}

function submitBooking(v){
  showTyping();
  fetch('/api/public/'+SLUG+'/bookings',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({customer:{name:v.name,phone:v.phone,email:v.email,notes:''},slot:{date:S.date,time:S.time}})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    hideTyping();
    if(d.ok){
      addConfirmCard('✅','¡Reserva creada!',[
        {label:'Nombre', value:v.name},
        {label:'Fecha',  value:formatDate(S.date)},
        {label:'Hora',   value:S.time},
      ],'📧 Te enviamos un correo de confirmación.');
    } else {
      addAi(d.message||'No se pudo crear la reserva. Intenta de nuevo.',false);
    }
  })
  .catch(function(){ hideTyping(); addAi('Error de conexión. Intenta de nuevo.',false); });
}

// ── FLOW: COTIZACIONES ────────────────────────────────────────────────────────
function startCotizarFlow(){
  S.flow='cotizar'; S.cart={};
  addAiWithProductCards('¿Qué servicios te interesan? Elige la cantidad de cada uno.',PRODUCTS);
}

function showQuoteFormStep(){
  addAiWithForm(
    '¡Casi listo! ¿A dónde te enviamos la cotización?',
    [
      {id:'name',  placeholder:'Tu nombre',                 type:'text',  autocomplete:'name'},
      {id:'phone', placeholder:'Teléfono',                  type:'tel',   autocomplete:'tel'},
      {id:'email', placeholder:'Email (opcional)',          type:'email', autocomplete:'email', required:false},
    ],
    'Enviar cotización',
    function(v){ submitQuote(v); }
  );
}

function submitQuote(v){
  showTyping();
  var items=PRODUCTS
    .filter(function(p){ return (S.cart[p.id]||0)>0; })
    .map(function(p){ return {productId:p.id,quantity:S.cart[p.id]}; });
  fetch('/shop/'+SLUG+'/quotes/submit',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({customer:{name:v.name,phone:v.phone,email:v.email||'',message:''},items:items})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    hideTyping();
    if(d.ok){
      var rows=[{label:'Nombre',value:v.name},{label:'Teléfono',value:v.phone}];
      if(v.email) rows.push({label:'Email',value:v.email});
      addConfirmCard('✅','¡Cotización enviada!',rows,d.message||'Te contactaremos pronto con el presupuesto.');
    } else {
      addAi(d.message||'No se pudo enviar la cotización. Intenta de nuevo.',false);
    }
  })
  .catch(function(){ hideTyping(); addAi('Error de conexión. Intenta de nuevo.',false); });
}

// ── Saludo inicial con módulos ────────────────────────────────────────────────
function addAiWithModules(){
  var m=makeAiRow(); m.row.classList.add('ai-row--intro');
  var el=document.createElement('div'); el.className='ai-text ai-greeting';
  el.innerHTML='Hola! Soy el asistente de <b>'+escH(BIZ)+'</b>. ¿En qué te puedo ayudar hoy?';
  m.body.appendChild(el);
  var mods=document.createElement('div'); mods.className='ai-modules';
  MODULE_CARDS.forEach(function(card){
    var btn=document.createElement('button'); btn.type='button'; btn.className='ai-mod-card';
    btn.innerHTML='<span class="ai-mod-emoji">'+card.emoji+'</span><div class="ai-mod-texts"><div class="ai-mod-title">'+escH(card.title)+'</div><div class="ai-mod-desc">'+escH(card.desc)+'</div></div><svg class="ai-mod-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    btn.addEventListener('click',(function(action,modsEl){
      return function(){
        modsEl.querySelectorAll('.ai-mod-card').forEach(function(c){ c.classList.add('used'); });
        quickAction(action);
      };
    })(card.action,mods));
    mods.appendChild(btn);
  });
  m.body.appendChild(mods); appendAiRow(m.row);
}

// ── Chat libre (API) ──────────────────────────────────────────────────────────
async function sendMsg(){
  if(sending) return;
  var inp=document.getElementById('chatInput');
  var q=inp.value.trim(); if(!q) return;
  inp.value=''; inp.style.height='auto';
  addUser(q); showTyping(); sending=true;
  document.getElementById('sendBtn').disabled=true;
  try{
    var r=await fetch('/api/public/'+SLUG+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
    var d=await r.json(); hideTyping();
    if(d.answer){ addAi(d.answer); }
    else { addAi(d.message||'No encontré información sobre eso. ¿Puedes reformular tu pregunta?',false); }
  }catch(e){ hideTyping(); addAi('Hubo un problema al conectar. Intenta de nuevo.',false); }
  finally{ sending=false; document.getElementById('sendBtn').disabled=false; }
}

// ── Acciones rápidas ──────────────────────────────────────────────────────────
function quickAction(a){
  if(a==='reservas'){      addUser('Quiero reservar una hora');    startReservasFlow(); }
  else if(a==='cotizar'){  addUser('Quiero pedir una cotización'); startCotizarFlow();  }
  else if(a==='precios'){  document.getElementById('chatInput').value='¿Cuáles son los precios?'; sendMsg(); }
  else if(a==='info'){     document.getElementById('chatInput').value='¿Qué servicios ofrecen?'; sendMsg(); }
}

// ── Init ──────────────────────────────────────────────────────────────────────
(function init(){
  var inp=document.getElementById('chatInput');
  var btn=document.getElementById('sendBtn');
  btn.addEventListener('click',function(){ sendMsg(); });
  btn.addEventListener('touchend',function(e){ e.preventDefault(); sendMsg(); });
  inp.addEventListener('input',function(){ this.style.height='auto'; this.style.height=Math.min(this.scrollHeight,160)+'px'; });
  inp.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg(); } });
  var backBtn=document.getElementById('btnBackChat');
  if(backBtn) backBtn.addEventListener('click',function(){ showTab('chat'); });
  setTimeout(function(){ addAiWithModules(); },600);
})();
`;
}
