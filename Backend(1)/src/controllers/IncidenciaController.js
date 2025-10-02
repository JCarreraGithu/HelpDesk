// src/controllers/IncidenciaController.js
import TipoIncidencia from "../models/TipoIncidencia.js";

// GET todos
export const getAllTipos = async (req, res) => {
  try {
    const tipos = await TipoIncidencia.findAll();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET por ID
export const getTipoById = async (req, res) => {
  try {
    const tipo = await TipoIncidencia.findByPk(req.params.id_tipo); // ⚠ usar id_tipo
    if (!tipo) return res.status(404).json({ error: "Tipo de incidencia no encontrado" });
    res.json(tipo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST
export const createTipo = async (req, res) => {
  try {
    const { tipo, descripcion } = req.body;
    const nuevo = await TipoIncidencia.create({ tipo, descripcion });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT
export const updateTipo = async (req, res) => {
  try {
    const { tipo, descripcion } = req.body;
    const tipoInc = await TipoIncidencia.findByPk(req.params.id_tipo); // ⚠ usar id_tipo
    if (!tipoInc) return res.status(404).json({ error: "Tipo de incidencia no encontrado" });

    await tipoInc.update({ tipo, descripcion });
    res.json(tipoInc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteTipo = async (req, res) => {
  try {
    const tipoInc = await TipoIncidencia.findByPk(req.params.id_tipo); // ⚠ usar id_tipo
    if (!tipoInc) return res.status(404).json({ error: "Tipo de incidencia no encontrado" });

    await tipoInc.destroy();
    res.json({ msg: "Tipo de incidencia eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
