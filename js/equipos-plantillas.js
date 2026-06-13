/* =====================================================================
   EQUIPOS · LISTADO DE JUGADORES POR EQUIPO
   ---------------------------------------------------------------------
   Este es el unico archivo que tienes que tocar cuando quieras anadir,
   quitar o cambiar jugadores en las paginas plantilla-*.html.

   Tu estructura de carpetas:
     img/equipos/regional/
     img/equipos/juvenil/
     img/equipos/cadete/
     img/equipos/femenino/
     img/equipos/veteranos/

   IMPORTANTE: las fotos de los jugadores tienen que estar RECORTADAS
   (sin fondo), en formato .PNG transparente, para que se vean los
   escudos del club detras. Puedes hacerlo gratis con remove.bg o con
   Canva ("Eliminar fondo").

   Como anadir un jugador nuevo:
     1. Copia su foto en PNG transparente dentro de la carpeta del
        equipo correspondiente. Recomendado 600x800 px, peso < 500 KB.
     2. Anade una linea dentro del bloque de ese equipo con:
          { foto: 'img/equipos/CARPETA/nombre-archivo.png', nombre: 'Nombre Apellido' },
     3. Guarda el archivo y recarga la web con Ctrl+F5.

   Reglas:
     - No borres las comas al final de cada linea.
     - No borres los corchetes [  ] de cada bloque.
   ===================================================================== */

window.PLANTILLAS = {

  /* ---------- REGIONAL ---------- */
  regional: [
    // { foto: 'img/equipos/regional/jugador-1.png', nombre: 'Nombre Apellido' },
  ],

  /* ---------- JUVENIL ---------- */
  juvenil: [
    // { foto: 'img/equipos/juvenil/jugador-1.png', nombre: 'Nombre Apellido' },
  ],

  /* ---------- CADETE ---------- */
  cadete: [
    { foto: 'img/equipos/cadete/IMAGEN1.png', nombre: 'Jose Manuel' },
    { foto: 'img/equipos/cadete/IMAGEN2.png', nombre: 'Paul' },
    { foto: 'img/equipos/cadete/IMAGEN3.png', nombre: 'Jose Manuel' },
    { foto: 'img/equipos/cadete/IMAGEN4.png', nombre: 'Paul' },
    { foto: 'img/equipos/cadete/IMAGEN7.png', nombre: 'Jose Manuel' },
    { foto: 'img/equipos/cadete/IMAGEN8.png', nombre: 'Paul' },
    { foto: 'img/equipos/cadete/IMAGEN9.png', nombre: 'Paul' }
  ],

  /* ---------- FEMENINO ---------- */
  femenino: [
    // { foto: 'img/equipos/femenino/jugadora-1.png', nombre: 'Nombre Apellido' },
  ],

  /* ---------- VETERANOS ---------- */
  veteranos: [
    // { foto: 'img/equipos/veteranos/jugador-1.png', nombre: 'Nombre Apellido' },
  ]

};