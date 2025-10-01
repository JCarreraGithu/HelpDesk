import { Prioridad } from "../models/Prioridad.js";

export const getPrioridades = async (req, res) => {
  try {
    const prioridades = await Prioridad.findAll({
      attributes: ["ID_PRIORIDAD", "NOMBRE"]
    });
    res.json(prioridades);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
