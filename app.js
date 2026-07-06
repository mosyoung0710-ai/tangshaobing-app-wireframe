const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.page;
    navItems.forEach((nav) => nav.classList.remove("active"));
    pages.forEach((page) => page.classList.remove("active"));
    item.classList.add("active");
    document.getElementById(target).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
