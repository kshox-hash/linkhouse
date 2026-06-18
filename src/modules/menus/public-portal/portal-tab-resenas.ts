export function resenasTabHtml(): string {
  return `
  <div id="panel-resenas" class="panel">
    <div class="pscroll">
      <div class="sec-hdr">
        <div>
          <div class="sec-title">Reseñas de clientes</div>
          <div class="sec-sub">Lo que dicen nuestros clientes</div>
        </div>
        <button class="btn-primary" type="button" id="openReviewBtn" style="font-size:12.5px;padding:8px 16px">
          ★ Dejar reseña
        </button>
      </div>
      <div id="reviewsContent">
        <div class="cal-loading"><div class="spinner"></div>Cargando reseñas…</div>
      </div>
    </div>
  </div>`;
}
