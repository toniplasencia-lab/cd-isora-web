/**
 * Mapa compartido de escudos de equipos rivales.
 * Clave = nombre del equipo tal como aparece en los datos de ftf.es
 * (columnas "local"/"visitante" de partidos, y "nombre_equipo" de clasificacion).
 * Valor = nombre de archivo dentro de img/escudos/
 *
 * Usado por: js/proximo-partido.js y js/clasificacion.js
 */
window.CD_ISORA_ESCUDOS = {
  "Union Isora": "Unionisora.png",

  // --- Cadete Preferente Tenerife G3 ---
  "C.D. Aguilas B": "Aguilas.png",
  "C.D. Anadona": "Anadona.png",
  "C.D. Igara C.B.": "Igara.png",
  "C.D. Marino B": "Marino.png",
  "C.D. Raqui B": "Isidro.png",
  "Esmugran": "Esmugran.png",
  "Furia Arona": "FuriaArona.png",
  "Once Diablos": "OnceDiablos.png",
  "San Lorenzo": "SanLorenzo.png",
  "San Miguel": "SanMiguel.png",
  "U.D Las Zocas": "LasZocas.png",
  "U.D. Guargacho": "Guargacho.png",
  "Buzanada": "Buzanada.png",

  // --- Juvenil Primera Tenerife G3 ---
  "A. Granadilla": "Granadilla.png",
  "Aldea Blanca": "AldeaBlanca.png",
  "At. U. Guimar B": "Guimar.png",
  "C.D. Aguilas C": "Aguilas.png",
  "C.D. Anadona C.F.": "Anadona.png",
  "C.D. Buzanada B": "Buzanada.png",
  "Charco D.Pino B": "CharcoDelPino.png",
  "Charco D. Pino B": "CharcoDelPino.png",
  "Costa Sur": "CostaSur.png",
  "Fund.Edgar M.": "FundacionEdgarM.png",
  "Santiago Del Tde.": "SantiagoDelTeide.png",

  // --- Regional Segunda G3 (Senior) ---
  "At. Alcala": "Alcala.png",
  "C.D. Respect": "Respect.png",
  "C.D.Tajaraste": "Tajaraste.png",
  "Fasnia B.T.": "FasniaBT.png",
  "Furia Arona B": "FuriaArona.png",
  "Lorenzo Negrin": "LorenzoNegrin.jpg",
  "Man.De Tajo": "Manantial.png",
  "Santos Reyes": "SantosReyes.jpg",
  "U.D. Alajero": "Alajero.jpg",
  "U.D. Gomera": "Gomera.jpg",
  "Vallehermoso": "Vallehermoso.png"
};

/** Devuelve la URL del escudo de un equipo, o null si no hay escudo mapeado. */
window.cdIsoraEscudoUrl = function (nombreEquipo) {
  const nombre = (nombreEquipo || "").trim();
  const archivo = window.CD_ISORA_ESCUDOS[nombre];
  return archivo ? `img/escudos/${archivo}` : null;
};
