/* =====================================================================
   EQUIPOS · LISTADO DE JUGADORES POR EQUIPO
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que tienes que tocar cuando quieras añadir,
   quitar o cambiar jugadores en la página "Equipos".

   Tu estructura de carpetas:
     img/equipos/regional/
     img/equipos/juvenil/
     img/equipos/cadete/
     img/equipos/femenino/
     img/equipos/veteranos/

   Cómo añadir un jugador nuevo:
     1. Copia su foto dentro de la carpeta del equipo correspondiente.
        Recomendado: foto cuadrada de unos 600x600 px, formato .jpg o .webp.
     2. Añade una línea dentro del bloque de ese equipo con:
          { foto: 'img/equipos/CARPETA/nombre-archivo.jpg', nombre: 'Nombre Apellido' },
     3. Guarda el archivo y recarga la web con Ctrl+F5.

   Cómo cambiar el nombre de un jugador:
     Busca su línea y cambia el texto entre comillas después de  nombre:

   Si un equipo NO tiene jugadores todavía, deja el bloque vacío así:
       regional: [],
     Aparecerá un mensaje amable de "Próximamente publicaremos esta plantilla".

   Reglas:
     • Si en el nombre hay un apóstrofo ('), usa comillas dobles fuera:
         nombre: "J. O'Connor"
     • No borres las comas al final de cada línea.
     • No borres los corchetes [  ] de cada bloque.
   ===================================================================== */

window.PLANTILLAS = {

  /* ---------- REGIONAL ---------- */
  regional: [
    { foto: 'img/equipos/regional/josemanuel.jpeg', nombre: 'José Manuel' },
    { foto: 'img/equipos/regional/paul.jpeg',       nombre: 'Paul' },
  ],

  /* ---------- JUVENIL ---------- */
  juvenil: [
    { foto: 'img/equipos/juvenil/josemanuel.jpeg', nombre: 'José Manuel' },
    { foto: 'img/equipos/juvenil/paul.jpeg',       nombre: 'Paul' },
  ],

  /* ---------- CADETE ---------- */
  cadete: [
    { foto: 'img/equipos/cadete/josemanuel.jpeg', nombre: 'José Manuel' },
    { foto: 'img/equipos/cadete/paul.jpeg',       nombre: 'Paul' },
  ],

  /* ---------- FEMENINO ---------- */
  femenino: [
    { foto: 'img/equipos/femenino/josemanuel.jpeg', nombre: 'José Manuel' },
    { foto: 'img/equipos/femenino/paul.jpeg',       nombre: 'Paul' },
  ],

  /* ---------- VETERANOS ---------- */
  veteranos: [
    { foto: 'img/equipos/veteranos/josemanuel.jpeg', nombre: 'José Manuel' },
    { foto: 'img/equipos/veteranos/paul.jpeg',       nombre: 'Paul' },
  ],

};
