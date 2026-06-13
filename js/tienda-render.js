/* Renderiza los productos de la tienda con galeria de miniaturas */
(function () {
  var WA = '34659995075';
  var EMAIL = 'cdunionisora2019@gmail.com';
  var MESSENGER = 'https://m.me/CD.UnionIsora';
  var INSTAGRAM = 'https://ig.me/m/c.d.unionisora';

  var cont = document.getElementById('tienda-productos');
  if (!cont || !window.PRODUCTOS) return;

  if (window.PRODUCTOS.length === 0) {
    cont.innerHTML = '<p style="text-align:center; color:var(--color-muted); grid-column:1/-1;">Pronto publicaremos los productos disponibles.</p>';
    return;
  }

  cont.innerHTML = window.PRODUCTOS.map(function (p, idx) {
    var asunto = encodeURIComponent('Pedido tienda: ' + p.nombre);
    var msgWA = encodeURIComponent('Hola, me interesa "' + p.nombre + '" (' + p.precio + ') de la tienda del CD Union Isora.');

    var todasLasFotos = [p.foto].concat(p.fotosExtra || []);

    var miniaturas = '';
    if (todasLasFotos.length > 1) {
      miniaturas = '<div class="tienda-thumbs">' +
        todasLasFotos.map(function (f, i) {
          return '<button type="button" class="tienda-thumb' + (i === 0 ? ' is-active' : '') + '"' +
            ' data-target="prod-' + idx + '" data-foto="' + f + '"' +
            ' aria-label="Ver foto ' + (i + 1) + '">' +
            '<img src="' + f + '" alt=""/>' +
          '</button>';
        }).join('') +
      '</div>';
    }

    var btnAgotado = p.agotado
      ? '<p style="margin:0.5rem 0; color:#c0392b; font-weight:700;">AGOTADO</p>'
      : '';

    var botones = p.agotado ? '' :
      '<div class="tienda-botones">' +
        '<a href="https://wa.me/' + WA + '?text=' + msgWA + '" target="_blank" rel="noopener" class="btn-mini" style="background:#25D366;">WhatsApp</a>' +
        '<a href="mailto:' + EMAIL + '?subject=' + asunto + '" class="btn-mini" style="background:#444;">Email</a>' +
        '<a href="' + INSTAGRAM + '" target="_blank" rel="noopener" class="btn-mini" style="background:#E1306C;">Instagram</a>' +
        '<a href="' + MESSENGER + '" target="_blank" rel="noopener" class="btn-mini" style="background:#0084FF;">Messenger</a>' +
      '</div>';

    return '' +
      '<article class="card producto-card">' +
        '<div class="tienda-foto-principal">' +
          '<img id="prod-' + idx + '" src="' + p.foto + '" alt="' + p.nombre + '" onerror="this.style.opacity=0.3;this.src=\'img/logo-club.png\';"/>' +
        '</div>' +
        miniaturas +
        '<h3 style="margin:0.5rem 0 0.25rem;">' + p.nombre + '</h3>' +
        '<p style="font-size:1.4rem; color:var(--color-secondary); font-weight:700; margin:0;">' + p.precio + '</p>' +
        '<p style="color:var(--color-muted); font-size:0.95rem; margin:0.25rem 0 0;">' + p.descripcion + '</p>' +
        btnAgotado +
        botones +
      '</article>';
  }).join('');

  // Clic en miniaturas cambia la foto principal
  cont.addEventListener('click', function (e) {
    var t = e.target.closest('.tienda-thumb');
    if (!t) return;
    var targetId = t.getAttribute('data-target');
    var newFoto = t.getAttribute('data-foto');
    var img = document.getElementById(targetId);
    if (img) img.src = newFoto;
    // Marca activa
    var parent = t.parentElement;
    parent.querySelectorAll('.tienda-thumb').forEach(function (b) {
      b.classList.remove('is-active');
    });
    t.classList.add('is-active');
  });
  // ===== LIGHTBOX: clic en foto principal abre en grande =====
  var lightbox = document.getElementById('tienda-lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('.lightbox__img');
    var lbClose = lightbox.querySelector('.lightbox__close');

    cont.addEventListener('click', function (e) {
      var foto = e.target.closest('.tienda-foto-principal img');
      if (!foto) return;
      lbImg.src = foto.src;
      lbImg.alt = foto.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    });

    function cerrar() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lbClose) cerrar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) cerrar();
    });
  }

})();