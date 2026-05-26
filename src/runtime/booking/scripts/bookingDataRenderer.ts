export function bookingDateRendererScript(): string {
  return `
function renderDates() {
  if (!allSlots.length) {
    datesContainer.innerHTML = \`
      <div class="no-times">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--muted-2); margin-bottom:10px; display:block; margin-left:auto; margin-right:auto;">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Sin disponibilidad en este momento.<br>Intenta más tarde.
      </div>
    \`;
    return;
  }

  const today = todayStr();
  const scroll = document.createElement("div");

  scroll.className = "dates-scroll";

  allSlots.forEach(({ date, times }) => {
    if (!times || !times.length) return;

    const d = parseDateLocal(date);
    const chip = document.createElement("div");

    chip.className =
      "date-chip" +
      (date === selDate ? " selected" : "") +
      (date === today ? " today" : "");

    chip.innerHTML = \`
      <span class="date-chip-dow">\${DOW[d.getDay()]}</span>
      <span class="date-chip-day">\${d.getDate()}</span>
      <span class="date-chip-mon">\${MON[d.getMonth()]}</span>
    \`;

    chip.addEventListener("click", () => selectDate(date));

    scroll.appendChild(chip);
  });

  datesContainer.innerHTML = "";
  datesContainer.appendChild(scroll);
}

function selectDate(date) {
  selDate = date;
  selTime = null;

  renderDates();
  renderTimes(date);
  goToStep(2);
}
`;
}