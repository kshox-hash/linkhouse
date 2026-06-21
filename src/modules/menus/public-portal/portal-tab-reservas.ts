export function reservasTabHtml(): string {
  return `
  <div id="panel-reservas" class="panel">
    <div class="pscroll">

      <!-- Calendar card -->
      <div class="rdash-cal-card">

        <div class="rdash-cal-hdr">
          <div>
            <div class="rdash-title">Reservas</div>
            <div class="rdash-sub">Seleccioná un día para ver turnos</div>
          </div>
          <div class="rdash-mnav">
            <button class="rdash-mnav-btn" id="rdashPrev" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="rdash-month-lbl" id="rdashMonthLbl"></span>
            <button class="rdash-mnav-btn" id="rdashNext" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div class="month-cal-grid" id="monthCal"></div>

        <div class="rdash-stat-row">
          <div class="rsr-item">
            <span class="rsr-val" id="rstatDays">—</span>
            <span class="rsr-lbl">días libres</span>
          </div>
          <div class="rsr-sep"></div>
          <div class="rsr-item">
            <span class="rsr-val" id="rstatSlots">—</span>
            <span class="rsr-lbl">turnos</span>
          </div>
          <div class="rsr-sep"></div>
          <div class="rsr-item">
            <span class="rsr-lbl">Próximo</span>
            <span class="rsr-val rsr-next-val" id="rstatNext">—</span>
          </div>
        </div>

      </div>

      <!-- Slots area -->
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
