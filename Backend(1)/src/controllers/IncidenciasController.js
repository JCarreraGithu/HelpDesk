import { Incidencia } from "../models/Incidencia.js";

// Obtener todas las incidencias
export const getIncidencias = async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll();
    res.json(incidencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener incidencias" });
  }
};
