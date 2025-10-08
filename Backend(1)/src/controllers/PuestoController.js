import { Puesto } from "../models/Puesto.js";

// Listar todos los puestos
export const getPuestos = async (req, res) => {
  try {
    const puestos = await Puesto.findAll();
    res.json(puestos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener puesto por ID
export const getPuestoById = async (req, res) => {
  try {
    const puesto = await Puesto.findByPk(req.params.id);
    if (!puesto) return res.status(404).json({ msg: "Puesto no encontrado" });
    res.json(puesto);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Crear puesto
export const createPuesto = async (req, res) => {
  try {
    const nuevoPuesto = await Puesto.create(req.body);
    res.status(201).json(nuevoPuesto);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Actualizar puesto
export const updatePuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const puesto = await Puesto.findByPk(id);
    if (!puesto) return res.status(404).json({ msg: "Puesto no encontrado" });

    await puesto.update(req.body);
    res.json({ msg: "Puesto actualizado", puesto });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Eliminar puesto
export const deletePuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const puesto = await Puesto.findByPk(id);
    if (!puesto) return res.status(404).json({ msg: "Puesto no encontrado" });

    await puesto.destroy();
    res.json({ msg: "Puesto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
