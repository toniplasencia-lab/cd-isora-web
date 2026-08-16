/* =====================================================================
   HISTORIA · LISTADO DE FOTOGRAFÍAS POR PERIODO
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que tienes que tocar cuando quieras añadir,
   quitar o cambiar fotos en la página "Historia".

   Tu estructura de carpetas:
     img/historia/anos_30_60/
     img/historia/anos_60_80/
     img/historia/anos_80_2010/
     img/historia/anos_2010_actualidad/

   Cómo cambiar el texto de una foto:
     Busca la línea de esa foto y cambia el texto entre comillas
     después de  caption:
     Ejemplo:
       caption: 'Fotografía histórica del club'
       →
       caption: 'Unión Isora 1961 - cedida por Pepe Tanque'

   Cómo añadir una foto nueva:
     1. Copia tu foto dentro de la carpeta del periodo correspondiente.
     2. Añade una línea dentro del bloque de esa carpeta con:
          { src: 'img/historia/CARPETA/nombre.jpeg', caption: 'Texto a mostrar' },
     3. Guarda el archivo y recarga la web con Ctrl+F5.

   Reglas:
     • caption puede ir vacío:  caption: ''
     • Si en el texto hay un apóstrofo ('), usa comillas dobles fuera:
         caption: "El equipo en 'Guarpía'"
     • Si un periodo está vacío ([] ), la galería mostrará "Próximamente…"

   Formatos aceptados:  .jpg .jpeg .png .webp .avif
   ===================================================================== */

window.HISTORIA_FOTOS = {

  // ---------------- AÑOS 30 a 60 (20 fotos) ----------------
  'anos_30_60': [
    { src: 'img/historia/anos_30_60/historia_1.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_2.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_3.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_4.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_5.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_6.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_7.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_8.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_9.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_10.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_11.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_12.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_13.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_14.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_15.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_16.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_17.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_18.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_19.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_20.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_30_60/historia_21.jpeg', caption: 'Fotografía histórica del club' },
  ],

  // ---------------- AÑOS 60 a 80 (10 fotos) ----------------
  'anos_60_80': [
    { src: 'img/historia/anos_60_80/historia_1.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_2.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_3.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_4.jpeg', caption: 'Cromos de jugadores del C.D. Unión Isora - Colección "Obsequio Cigarrillos", año 1966' },
    { src: 'img/historia/anos_60_80/historia_5.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_6.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_7.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_8.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_9.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_60_80/historia_10.jpeg', caption: 'Fotografía histórica del club' },
  ],

  // ---------------- AÑOS 80 a 2010 (10 fotos) ----------------
  'anos_80_2010': [
    { src: 'img/historia/anos_80_2010/historia_1.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_2.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_3.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_4.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_5.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_6.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_7.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_8.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_9.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_80_2010/historia_10.jpeg', caption: 'Fotografía histórica del club' },
  ],

  // ---------------- AÑOS 2010 a la actualidad (24 fotos) ----------------
  'anos_2010_actualidad': [
    { src: 'img/historia/anos_2010_actualidad/historia_1.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_2.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_3.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_4.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_5.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_6.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_7.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_8.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_9.jpeg',  caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_10.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_11.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_12.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_13.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_14.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_15.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_16.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_17.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_18.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_19.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_20.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_21.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_22.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_23.jpeg', caption: 'Fotografía histórica del club' },
    { src: 'img/historia/anos_2010_actualidad/historia_24.jpeg', caption: 'Fotografía histórica del club' },
  ],

};
