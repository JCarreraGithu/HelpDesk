import { EstadoCaso } from "../models/EstadoCaso.js";

export const getEstadosCaso = async (req, res) => {
  try {
    const estados = await EstadoCaso.findAll({
      attributes: ["ID_ESTADO", "NOMBRE"]
    });
    res.json(estados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
