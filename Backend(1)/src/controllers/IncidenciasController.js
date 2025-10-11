import { Incidencia } from "../models/Incidencia.js";

// ✅ Obtener todas las incidencias
export const getIncidencias = async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll();
    res.json(incidencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener incidencias" });
  }
};

// ✅ Obtener una incidencia por ID
export const getIncidenciaById = async (req, res) => {
  try {
    const { id } = req.params;
    const incidencia = await Incidencia.findByPk(id);

    if (!incidencia) {
      return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }

    res.json(incidencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener incidencia" });
  }
};

// ✅ Crear una nueva incidencia
export const createIncidencia = async (req, res) => {
  try {
    const { nombre, id_tipo } = req.body;

    const nueva = await Incidencia.create({
      nombre,
      id_tipo: id_tipo || null,
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear incidencia" });
  }
};

// ✅ Actualizar una incidencia
export const updateIncidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, id_tipo } = req.body;

    const incidencia = await Incidencia.findByPk(id);

    if (!incidencia) {
      return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }

    incidencia.nombre = nombre;
    incidencia.id_tipo = id_tipo || null;

    await incidencia.save();

    res.json(incidencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar incidencia" });
  }
};

// ✅ Eliminar una incidencia
export const deleteIncidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const incidencia = await Incidencia.findByPk(id);

    if (!incidencia) {
      return res.status(404).json({ mensaje: "Incidencia no encontrada" });
    }

    await incidencia.destroy();

    res.json({ mensaje: "Incidencia eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar incidencia" });
  }
};
