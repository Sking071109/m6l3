const express = require("express");
const router = express.Router();
 
// Importamos los datos desde el almacén
const goles = require("../data/registros");
 
// ─────────────────────────────────────────────
// ✅ TICKET 1 y 2 de la semana pasada — ya completados
 
router.get("/", (req, res) => {
  res.json(goles);
});
 
router.post("/", (req, res) => {
  const nuevoGol = req.body;
  goles.push(nuevoGol);
  res.status(201).json({ mensaje: "Gol registrado", gol: nuevoGol });
});
 
router.get("/seleccion/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const golesFiltrados = goles.filter(
    (gol) => gol.seleccion.toLowerCase() === nombre.toLowerCase()
  );
  res.json(golesFiltrados);
});
 
// ─────────────────────────────────────────────
// 🎫 TICKET 1 — PUT /goles/:id
// El árbitro se equivocó en el minuto o el jugador de un gol.
// Debes reemplazar el gol completo con los datos nuevos que llegan
// en req.body, manteniendo el mismo id.
//
// Pasos:
// 1. Convierte req.params.id a número con parseInt()
// 2. Busca la POSICIÓN del gol en el array con findIndex()
//    (no uses find() — necesitas la posición, no solo el objeto)
// 3. Si la posición es -1, el gol no existe: responde 404
//    con res.status(404).json({ error: "..." })
// 4. Si existe, reemplaza goles[posicion] con un objeto nuevo que
//    combine el id (de la URL) con los datos del body (spread ...)
// 5. Responde con res.json() confirmando la corrección
 
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const posicion = goles.findIndex((gol) => gol.id === id);

  if (posicion === -1) {
    return res.status(404).json({ error: "Gol no encontrado" });
  }

  const golActualizado = { ...req.body, id };
  goles[posicion] = golActualizado;

  res.json({ mensaje: "Gol corregido", gol: golActualizado });
});
 
// ─────────────────────────────────────────────
// 🎫 TICKET 2 — DELETE /goles/:id
// El VAR anuló el gol. Debes eliminarlo del array por completo.
//
// Pasos:
// 1. Convierte req.params.id a número con parseInt()
// 2. Busca la POSICIÓN del gol con findIndex()
// 3. Si la posición es -1, responde 404
// 4. Si existe, usa goles.splice(posicion, 1) para eliminarlo
//    (splice devuelve un array con el elemento eliminado)
// 5. Responde con res.json() confirmando la anulación
 
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const posicion = goles.findIndex((gol) => gol.id === id);

  if (posicion === -1) {
    return res.status(404).json({ error: "Gol no encontrado" });
  }

  const [golEliminado] = goles.splice(posicion, 1);
  res.json({ mensaje: "Gol anulado", gol: golEliminado });
});
 
// ─────────────────────────────────────────────
// 🔥 EXTRA 1 (opcional) — GET /goles/ordenados
// Devuelve una copia de los goles ordenada por minuto, de menor a
// mayor. Usa sort() con función de comparación (a.minuto - b.minuto).
// Pista: haz una copia del array antes de ordenar ([...goles]) para
// no alterar el orden original.
 
router.get("/ordenados", (req, res) => {
  const golesOrdenados = [...goles].sort((a, b) => a.minuto - b.minuto);
  res.json(golesOrdenados);
});
 
// ─────────────────────────────────────────────
// 🔥 EXTRA 2 (opcional) — GET /goles/estadisticas
// Devuelve un objeto con dos datos:
//   - total: cuántos goles hay (goles.length)
//   - golMasTardio: el minuto más alto entre todos los goles
// Pista: puedes resolver golMasTardio con reduce(), comparando el
// minuto acumulado contra el minuto de cada gol.
 
router.get("/estadisticas", (req, res) => {
  const golMasTardio = goles.reduce((maxMinuto, gol) => {
    return gol.minuto > maxMinuto ? gol.minuto : maxMinuto;
  }, 0);

  res.json({ total: goles.length, golMasTardio });
});
 
module.exports = router;
 
/*
> [!IMPORTANT]
> Las rutas `/ordenados` y `/estadisticas` deben ir ANTES de
> `router.put("/:id")` en el código si decides moverlas de posición —
> igual que pasó con `/seleccion/:nombre` la semana pasada, Express
> puede confundir "ordenados" con un :id. En el orden en que están
> arriba ya está resuelto, pero vale la pena que lo menciones en
> clase como recordatorio.
*/