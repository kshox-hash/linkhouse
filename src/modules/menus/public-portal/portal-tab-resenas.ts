export function resenasTabHtml(): string {
  return `
  <div id="panel-resenas" class="panel">
    <div class="pscroll">
      <div class="sec-hdr">
        <div>
          <div class="sec-title">Reseñas de clientes</div>
          <div class="sec-sub">Lo que dicen nuestros clientes</div>
        </div>
      </div>
      <div id="reviewsContent">
        <div class="cal-loading"><div class="spinner"></div>Cargando reseñas…</div>
      </div>
    </div>
  </div>`;
}
