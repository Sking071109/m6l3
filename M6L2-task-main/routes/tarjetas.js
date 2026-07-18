const express = require("express");
const router = express.Router();

// Importamos los datos desde el almacén
const tarjetas = require("../data/tarjetasData");

// ─────────────────────────────────────────────
// TICKET 1 — POST /tarjetas
// Registra una tarjeta nueva.
router.post("/", (req, res) => {
  const nuevaTarjeta = req.body;
  tarjetas.push(nuevaTarjeta);
  res.status(201).json({ mensaje: "Tarjeta registrada", tarjeta: nuevaTarjeta });
});

// ─────────────────────────────────────────────
// TICKET 2 — GET /tarjetas
// Devuelve todas las tarjetas registradas.
router.get("/", (req, res) => {
  res.json(tarjetas);
});

// ─────────────────────────────────────────────
// 🔥 BONUS (opcional) — GET /tarjetas/tipo/:tipo
// Devuelve solo las tarjetas de un tipo ("amarilla" o "roja").
router.get("/tipo/:tipo", (req, res) => {
  const tipo = req.params.tipo.toLowerCase();
  const tarjetasFiltradas = tarjetas.filter(
    (tarjeta) => tarjeta.tipo.toLowerCase() === tipo
  );

  res.json(tarjetasFiltradas);
});

// ─────────────────────────────────────────────
// TICKET 3 — GET /tarjetas/:id
// Devuelve una tarjeta por su id. Si no existe, responde 404.
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tarjeta = tarjetas.find((item) => item.id === id);

  if (!tarjeta) {
    return res.status(404).json({ error: "Tarjeta no encontrada" });
  }

  res.json(tarjeta);
});

// ─────────────────────────────────────────────
// TICKET 4 — PUT /tarjetas/:id
// Reemplaza una tarjeta existente con los datos del body.
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const posicion = tarjetas.findIndex((tarjeta) => tarjeta.id === id);

  if (posicion === -1) {
    return res.status(404).json({ error: "Tarjeta no encontrada" });
  }

  const tarjetaActualizada = { ...req.body, id };
  tarjetas[posicion] = tarjetaActualizada;

  res.json({ mensaje: "Tarjeta corregida", tarjeta: tarjetaActualizada });
});

// ─────────────────────────────────────────────
// TICKET 5 — DELETE /tarjetas/:id
// Elimina una tarjeta existente con splice().
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const posicion = tarjetas.findIndex((tarjeta) => tarjeta.id === id);

  if (posicion === -1) {
    return res.status(404).json({ error: "Tarjeta no encontrada" });
  }

  const [tarjetaEliminada] = tarjetas.splice(posicion, 1);
  res.json({ mensaje: "Tarjeta anulada", tarjeta: tarjetaEliminada });
});

module.exports = router;