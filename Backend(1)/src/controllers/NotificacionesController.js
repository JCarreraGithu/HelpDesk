import { Notificaciones } from "../models/Notificaciones.js";

// Obtener notificaciones de un empleado
export const getNotificaciones = async (req, res) => {
  const { id_empleado } = req.params;
  try {
    const notis = await Notificaciones.findAll({
      where: { ID_EMPLEADO: id_empleado }, // 🔹 usar nombre exacto en mayúsculas
      order: [["ID_NOTIFICACION", "DESC"]], // 🔹 también en mayúsculas
    });
    res.json(notis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
};

// Marcar notificación como vista
export const marcarVisto = async (req, res) => {
  const { id } = req.params; // aquí viene de la ruta /:id
  try {
    const noti = await Notificaciones.findByPk(id, { attributes: ["ID_NOTIFICACION", "ESTADO"] });
    if (!noti) return res.status(404).json({ msg: "Notificación no encontrada" });

    noti.ESTADO = "Visto"; // 🔹 actualizar usando nombre exacto
    await noti.save();

    res.json({ msg: "Notificación marcada como vista" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar notificación" });
  }
};