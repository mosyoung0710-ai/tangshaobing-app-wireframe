const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

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
}

window.addEventListener("resize", () => window.requestAnimationFrame(drawCallouts));

function showPage(target) {
  const nextPage = document.getElementById(target);
  if (!nextPage) return;

  navItems.forEach((nav) => {
    nav.classList.toggle("active", nav.dataset.page === target);
  });
  pages.forEach((page) => page.classList.toggle("active", page.id === target));
  window.requestAnimationFrame(drawCallouts);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showPage(item.dataset.page);
  });
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-goto]");
  if (!trigger || trigger.classList.contains("disabled")) return;
  showPage(trigger.dataset.goto);
});

function initPage() {
  const activeNav = document.querySelector(".nav-item.active") || navItems[0];
  if (!activeNav) return;
  navItems.forEach((nav) => {
    nav.classList.toggle("active", nav === activeNav);
  });
  pages.forEach((page) => page.classList.toggle("active", page.id === activeNav.dataset.page));
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.requestAnimationFrame(drawCallouts);
}

window.addEventListener("load", initPage);
