import { EncuestaSatisfaccion } from "../models/Encuesta.js";
import { Empleado } from "../models/Empleado.js";
import { Caso } from "../models/Caso.js";

// Obtener todas las encuestas con datos del caso y del empleado
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
          as: "CasoRelacionado",
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
      recomendaria,
      fecha_respuesta: new Date()
    });

    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    console.error("ERROR BACKEND: encuesta SequelizeDatabaseError: ORA-00904: RECOMENDARIA: invalid identifier", error);
    res.status(500).json({ msg: error.message });
  }
};