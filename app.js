const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

function prepareNoteCallouts(page) {
  document.querySelectorAll(".notes p").forEach((note) => {
    note.classList.remove("note-callout");
    delete note.dataset.callout;
  });

  const activeIds = new Set(
    [...page.querySelectorAll(".callout-dot[data-callout]")].map((marker) => marker.dataset.callout)
  );

  document.querySelectorAll(".notes p").forEach((note) => {
    const match = note.textContent.trim().match(/^(\d+)\./);
    if (!match || !activeIds.has(match[1]) || !page.contains(note)) return;
    note.dataset.callout = match[1];
    note.classList.add("note-callout");
  });
}

function drawCallouts() {
  const page = document.querySelector(".page.active");
  if (!page) return;

  page.querySelectorAll(".callout-layer").forEach((layer) => layer.remove());
  prepareNoteCallouts(page);

  const markers = page.querySelectorAll(".callout-dot[data-callout]");
  if (!markers.length) return;

  const pageRect = page.getBoundingClientRect();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("callout-layer");
  svg.setAttribute("width", pageRect.width);
  svg.setAttribute("height", pageRect.height);
  svg.setAttribute("viewBox", `0 0 ${pageRect.width} ${pageRect.height}`);
  page.appendChild(svg);

  markers.forEach((marker) => {
    const id = marker.dataset.callout;
    const note = page.querySelector(`.notes p[data-callout="${id}"]`);
    if (!note) return;

    const markerRect = marker.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();
    const markerCenterX = markerRect.left + markerRect.width / 2;
    const noteStartX = noteRect.left + 4;
    const startX = (noteStartX >= markerCenterX ? markerRect.right + 3 : markerRect.left - 3) - pageRect.left;
    const startY = markerRect.top + markerRect.height / 2 - pageRect.top;
    const endX = noteStartX - pageRect.left;
    const endY = noteRect.top + Math.min(noteRect.height / 2, 26) - pageRect.top;
    const bend = Math.max(70, (endX - startX) * 0.45);
    const arch = Number(marker.dataset.arch || 0);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${startX} ${startY} C ${startX + bend} ${startY + arch}, ${endX - bend} ${endY + arch}, ${endX} ${endY}`);
    svg.appendChild(path);
  });
}

window.addEventListener("resize", () => window.requestAnimationFrame(drawCallouts));
window.addEventListener("load", drawCallouts);

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.page;
    navItems.forEach((nav) => nav.classList.remove("active"));
    pages.forEach((page) => page.classList.remove("active"));
    item.classList.add("active");
    document.getElementById(target).classList.add("active");
    window.requestAnimationFrame(drawCallouts);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
