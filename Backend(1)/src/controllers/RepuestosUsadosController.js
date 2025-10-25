import { RepuestosUsados } from "../models/RepuestosUsados.js";

export const registrarUsoRepuesto = async (req, res) => {
  const { id_caso, id_repuesto, cantidad, comentario } = req.body;

  if (!id_caso || !id_repuesto || !cantidad) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    await RepuestosUsados.create({
      id_caso,
      id_repuesto,
      cantidad,
      comentario: comentario ?? "",
      fecha_uso: new Date()
    });

    res.status(201).json({ mensaje: "Uso de repuesto registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar uso de repuesto:", error);
    res.status(500).json({ mensaje: "Error al guardar uso de repuesto" });
  }
};