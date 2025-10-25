import { SolicitudRepuestos } from "../models/SolicitudRepuestos.js";

export const crearSolicitudRepuesto = async (req, res) => {
  const { id_caso, id_repuesto, cantidad, comentario } = req.body;

  if (!id_caso || !id_repuesto || !cantidad) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    console.log("📥 Comentario recibido:", comentario);

    await SolicitudRepuestos.create({
      id_caso,
      id_repuesto,
      cantidad,
      comentario: comentario ?? "", // ← fuerza que no sea undefined
      fecha_solicitud: new Date()
    });

    const solicitudCompleta = await SolicitudRepuestos.findOne({
      where: { id_caso, id_repuesto }
    });

    res.status(201).json(solicitudCompleta);
  } catch (error) {
    console.error("❌ Error al crear solicitud de repuesto:", error);
    res.status(500).json({ mensaje: "Error al registrar la solicitud" });
  }
};

export const listarSolicitudesPorCaso = async (req, res) => {
  res.json({ mensaje: "Listado de solicitudes por caso" });
};