import { TipoIncidencia } from "../models/TipoIncidencias.js";

export const getTiposIncidencia = async (req, res) => {
  try {
    const tipos = await TipoIncidencia.findAll({
      attributes: ["ID_TIPO", "TIPO"]
    });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
