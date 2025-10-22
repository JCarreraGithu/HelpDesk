import { EncuestaSatisfaccion } from "../models/Encuesta.js";
import { Empleado } from "../models/Empleado.js";
import { Caso } from "../models/Caso.js";

export const getEncuestas = async (req, res) => {
  try {
    const encuestas = await EncuestaSatisfaccion.findAll({
      include: [
        { 
          model: Empleado, 
          as: "UsuarioReporta", 
          attributes: ["id_empleado", "nombre", "apellido", "correo"] 
        },
        { 
          model: Caso, 
          attributes: ["id_caso", "descripcion"] 
        }
      ]
    });
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Crear una nueva encuesta
export const createEncuesta = async (req, res) => {
  const {
    id_caso,
    calificacion,
    comentario,
    usuario_reporta,
    calif_tiempo_respuesta,
    calif_trato_tecnico,
    calif_solucion,
    calif_comunicacion,
    recomendaria
  } = req.body;

  try {
    const nuevaEncuesta = await EncuestaSatisfaccion.create({
      id_caso,
      calificacion,
      comentario,
      usuario_reporta,
      calif_tiempo_respuesta,
      calif_trato_tecnico,
      calif_solucion,
      calif_comunicacion,
      recomendaria
    });

    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
