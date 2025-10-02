// src/routes/RepuestoRoutes.js
import express from "express";
import Repuesto from "../models/Repuesto.js";

const router = express.Router();

// 🔹 Obtener todos los repuestos
router.get("/", async (req, res) => {
  try {
    const repuestos = await Repuesto.findAll();
    res.json(repuestos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Obtener repuesto por ID
router.get("/:id_repuesto", async (req, res) => {
  try {
    const repuesto = await Repuesto.findByPk(req.params.id_repuesto); // ✅ usar id_repuesto
    if (!repuesto) return res.status(404).json({ error: "Repuesto no encontrado" });
    res.json(repuesto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Crear un nuevo repuesto
router.post("/", async (req, res) => {
  const { nombre, descripcion, stock, precio_unitario } = req.body;
  try {
    const nuevoRepuesto = await Repuesto.create({ nombre, descripcion, stock, precio_unitario });
    res.status(201).json(nuevoRepuesto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Actualizar un repuesto existente
router.put("/:id_repuesto", async (req, res) => {
  const { nombre, descripcion, stock, precio_unitario } = req.body;
  try {
    const repuesto = await Repuesto.findByPk(req.params.id_repuesto); // ✅ usar id_repuesto
    if (!repuesto) return res.status(404).json({ error: "Repuesto no encontrado" });

    await repuesto.update({ nombre, descripcion, stock, precio_unitario });
    res.json(repuesto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Eliminar un repuesto
router.delete("/:id_repuesto", async (req, res) => {
  try {
    const repuesto = await Repuesto.findByPk(req.params.id_repuesto); // ✅ usar id_repuesto
    if (!repuesto) return res.status(404).json({ error: "Repuesto no encontrado" });

    await repuesto.destroy();
    res.json({ message: "Repuesto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
