/* Fecha civil en Canarias (YYYY-MM-DD), para comparar con DATE en Supabase. */
window.cdIsoraFechaCanaria = (() => {
  const formato = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Atlantic/Canary",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return (instante = new Date()) => {
    const partes = Object.fromEntries(
      formato.formatToParts(instante).map(({ type, value }) => [type, value])
    );
    return `${partes.year}-${partes.month}-${partes.day}`;
  };
})();
