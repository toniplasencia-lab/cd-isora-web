/* Toggle del menú de navegación en móvil */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("is-open");
      const expanded = menu.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", expanded);
    });
  }
});
