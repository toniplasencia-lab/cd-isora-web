/* =====================================================================
   TIENDA · LISTADO DE PRODUCTOS DEL CLUB
   ---------------------------------------------------------------------
   Cada producto tiene una foto principal y opcionalmente un array de
   fotos extra. Si hay varias, aparecen como miniaturas clicables.

   Para anadir un producto: copia un bloque y cambia los datos.
   Para QUITAR: borra el bloque entero (con las llaves {} y la coma).
   Para AGOTADO: pon  agotado: true
   ===================================================================== */

window.PRODUCTOS = [

  {
    foto: 'img/tienda/camisa.png',
    fotosExtra: [],
    nombre: 'Camisa polo',
    precio: 'Consulta',
    descripcion: 'Camisa polo oficial del club',
    agotado: false
  },

  {
    foto: 'img/tienda/chandal.png',
    fotosExtra: ['img/tienda/chandal1.png'],
    nombre: 'Chandal del club',
    precio: '20 €',
    descripcion: 'Chandal completo con los colores del club',
    agotado: false
  },

  {
    foto: 'img/tienda/gorra.png',
    fotosExtra: ['img/tienda/gorra1.png', 'img/tienda/gorra3.png'],
    nombre: 'Gorra del club',
    precio: '12 €',
    descripcion: 'Gorra con el escudo del club',
    agotado: false
  },

  {
    foto: 'img/tienda/mochila.png',
    fotosExtra: ['img/tienda/mochila1.png'],
    nombre: 'Mochila del club',
    precio: '20 €',
    descripcion: 'Mochila con los colores del club',
    agotado: false
  },

  {
    foto: 'img/tienda/paraguas.png',
    fotosExtra: ['img/tienda/paraguas1.png'],
    nombre: 'Paraguas del club',
    precio: '15 €',
    descripcion: 'Paraguas grande resistente',
    agotado: false
  },

  {
    foto: 'img/tienda/botella.png',
    fotosExtra: ['img/tienda/botella1.png'],
    nombre: 'Botella del club',
    precio: 'Consulta',
    descripcion: 'Botella reutilizable con el escudo',
    agotado: false
  },

  {
    foto: 'img/tienda/taza.png',
    fotosExtra: ['img/tienda/taza1.png'],
    nombre: 'Taza del club',
    precio: 'Consulta',
    descripcion: 'Taza ceramica con el escudo del club',
    agotado: false
  }

];