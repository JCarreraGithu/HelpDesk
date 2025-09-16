import { HistorialCaso } from "../models/HistorialCaso.js";

// Mostrar todos los registros del historial
export const getHistorial = async (req, res) => {
  try {
    const historial = await HistorialCaso.findAll();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Buscar historial por ID
export const getHistorialById = async (req, res) => {
  try {
    const registro = await HistorialCaso.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ msg: "Registro no encontrado" });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Buscar historial por caso
export const getHistorialByCaso = async (req, res) => {
  try {
    const historial = await HistorialCaso.findAll({
      where: { id_caso: req.params.id_caso }
    });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Crear registro de historial
export const createHistorial = async (req, res) => {
  try {
    const nuevoRegistro = await HistorialCaso.create(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Actualizar registro de historial (opcional)
export const updateHistorial = async (req, res) => {
  try {
    const registro = await HistorialCaso.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ msg: "Registro no encontrado" });

    await registro.update(req.body);
    res.json(registro);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
