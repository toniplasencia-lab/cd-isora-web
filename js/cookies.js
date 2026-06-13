// Banner de cookies del CD Unión Isora
// Aparece la primera vez que se visita la web y guarda la decisión durante 12 meses

(function () {
  const COOKIE_NAME = "cdisora_cookies";
  const COOKIE_DAYS = 365;

  // Lee una cookie por su nombre
  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Guarda una cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/;SameSite=Lax";
  }

  // Si ya hay decisión guardada, no mostramos el banner
  if (getCookie(COOKIE_NAME)) return;

  // Crear el banner
  function crearBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
          Este sitio utiliza cookies técnicas para su correcto funcionamiento.
          Al continuar navegando aceptas su uso.
          <a href="cookies.html">Más información</a>.
        </p>
        <div class="cookie-banner__buttons">
          <button class="cookie-banner__btn cookie-banner__btn--reject" type="button">Rechazar</button>
          <button class="cookie-banner__btn cookie-banner__btn--accept" type="button">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector(".cookie-banner__btn--accept").addEventListener("click", function () {
      setCookie(COOKIE_NAME, "accepted", COOKIE_DAYS);
      banner.remove();
    });

    banner.querySelector(".cookie-banner__btn--reject").addEventListener("click", function () {
      setCookie(COOKIE_NAME, "rejected", COOKIE_DAYS);
      banner.remove();
    });
  }

  // Esperar a que el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", crearBanner);
  } else {
    crearBanner();
  }
})();