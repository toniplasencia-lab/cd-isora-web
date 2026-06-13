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
    // { foto: 'img/equipos/regional/jugador-1.jpg', nombre: 'Nombre Apellido' },
    // { foto: 'img/equipos/regional/jugador-2.jpg', nombre: 'Nombre Apellido' },
  ],

  /* ---------- JUVENIL ---------- */
  juvenil: [
    // { foto: 'img/equipos/juvenil/jugador-1.jpg', nombre: 'Nombre Apellido' },
  ],

  /* ---------- CADETE ---------- */
  cadete: [
    // { foto: 'img/equipos/cadete/jugador-1.jpg', nombre: 'Nombre Apellido' },
  ],

  /* ---------- FEMENINO ---------- */
  femenino: [
    // { foto: 'img/equipos/femenino/jugadora-1.jpg', nombre: 'Nombre Apellido' },
  ],

  /* ---------- VETERANOS ---------- */
  veteranos: [
    // { foto: 'img/equipos/veteranos/jugador-1.jpg', nombre: 'Nombre Apellido' },
  ],

};
