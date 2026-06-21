export function reservasTabHtml(): string {
  return `
  <div id="panel-reservas" class="panel">
    <div class="pscroll">

      <!-- Dashboard header -->
      <div class="rdash-hdr">
        <div>
          <div class="rdash-title">Reservas</div>
          <div class="rdash-sub" id="rdashMonthLbl"></div>
        </div>
        <div class="rdash-nav">
          <button class="rdash-nav-btn" id="rdashPrev" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="rdash-nav-btn" id="rdashNext" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="rdash-stats" id="rdashStats">
        <div class="rstat-card">
          <div class="rstat-icon" style="background:rgba(79,127,232,.12);color:#4F7FE8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="rstat-val" id="rstatDays">—</div>
          <div class="rstat-lbl">Días disponibles</div>
        </div>
        <div class="rstat-card">
          <div class="rstat-icon" style="background:rgba(34,197,94,.12);color:#22c55e">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="rstat-val" id="rstatSlots">—</div>
          <div class="rstat-lbl">Turnos este mes</div>
        </div>
        <div class="rstat-card">
          <div class="rstat-icon" style="background:rgba(251,146,60,.12);color:#fb923c">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div class="rstat-val" id="rstatNext">—</div>
          <div class="rstat-lbl">Próximo turno</div>
        </div>
      </div>

      <!-- Monthly calendar grid -->
      <div class="month-cal-wrap">
        <div class="month-cal-grid" id="monthCal"></div>
      </div>

      <!-- Slots area (hidden until day selected) -->
      <div class="slots-area" id="slotsArea" style="display:none">
        <div class="slots-date-lbl" id="slotsDateLbl"></div>
        <div class="slots-grid" id="slotsGrid"></div>
        <button class="slots-close" type="button" id="slotsClose">✕ Cerrar</button>
      </div>

      <!-- Services -->
      <div class="rdash-sec-hdr">
        <div class="rdash-sec-title">Servicios</div>
      </div>
      <div class="svc-grid" id="svcGrid">
        <div class="svc-empty" style="grid-column:1/-1"><div class="spinner" style="margin:0 auto 10px"></div>Cargando servicios…</div>
      </div>

    </div>
  </div>`;
}
