import { Caso } from "../models/Caso.js";
import { Empleado } from "../models/Empleado.js";
import { Prioridad } from "../models/Prioridad.js";
import { TipoIncidencia } from "../models/TipoIncidencias.js";
import { Incidencia } from "../models/Incidencia.js";
import { HistorialCaso } from "../models/HistorialCaso.js";
import { EstadoCaso } from "../models/EstadoCaso.js";

// ---------------- Mostrar todos los casos ----------------
export const getCasos = async (req, res) => {
  try {
    const casos = await Caso.findAll({
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: TipoIncidencia, as: "TipoIncidencia", attributes: ["tipo"] },
        { model: Incidencia, as: "Incidencia", attributes: ["nombre"] },
        { model: Prioridad, attributes: ["nombre"] },
        { model: EstadoCaso, as: "EstadoActual", attributes: ["nombre"] },
        {
          model: HistorialCaso,
          include: [
            { model: EstadoCaso, attributes: ["nombre"] },
            { model: Empleado, attributes: ["nombre", "apellido"] }
          ]
        }
      ]
    });

    const casosFormateados = casos.map(c => ({
      id_caso: c.id_caso,
      titulo: c.titulo,
      descripcion: c.descripcion,
      fecha_creacion: c.fecha_creacion,
      empleado: c.Empleado ? `${c.Empleado.nombre} ${c.Empleado.apellido}` : null,
      tipo_incidencia: c.TipoIncidencia?.tipo || null,
      incidencia: c.Incidencia?.nombre || null,
      prioridad: c.Prioridad?.nombre || null,
      estado_actual: c.EstadoActual?.nombre || null,
      historial: c.HistorialCasos.map(h => ({
        id_historial: h.id_historial,
        fecha: h.fecha,
        comentario: h.comentario,
        estado: h.EstadoCaso?.nombre || null,
        empleado: h.Empleado ? `${h.Empleado.nombre} ${h.Empleado.apellido}` : null
      }))
    }));

    res.json(casosFormateados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Buscar caso por ID ----------------
export const getCasoById = async (req, res) => {
  try {
    const caso = await Caso.findByPk(req.params.id, {
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: TipoIncidencia, as: "TipoIncidencia", attributes: ["tipo"] },
        { model: Incidencia, as: "Incidencia", attributes: ["nombre"] },
        { model: Prioridad, attributes: ["nombre"] },
        { model: EstadoCaso, as: "EstadoActual", attributes: ["nombre"] },
        {
          model: HistorialCaso,
          include: [
            { model: EstadoCaso, attributes: ["nombre"] },
            { model: Empleado, attributes: ["nombre", "apellido"] }
          ]
        }
      ]
    });

    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    res.json({
      id_caso: caso.id_caso,
      titulo: caso.titulo,
      descripcion: caso.descripcion,
      fecha_creacion: caso.fecha_creacion,
      empleado: caso.Empleado ? `${caso.Empleado.nombre} ${caso.Empleado.apellido}` : null,
      tipo_incidencia: caso.TipoIncidencia?.tipo || null,
      incidencia: caso.Incidencia?.nombre || null,
      prioridad: caso.Prioridad?.nombre || null,
      estado_actual: caso.EstadoActual?.nombre || null,
      historial: caso.HistorialCasos.map(h => ({
        id_historial: h.id_historial,
        fecha: h.fecha,
        comentario: h.comentario,
        estado: h.EstadoCaso?.nombre || null,
        empleado: h.Empleado ? `${h.Empleado.nombre} ${h.Empleado.apellido}` : null
      }))
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Buscar por título ----------------
export const getCasoByTitulo = async (req, res) => {
  try {
    const { titulo } = req.params;
    const casos = await Caso.findAll({
      where: { titulo },
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: TipoIncidencia, as: "TipoIncidencia", attributes: ["tipo"] },
        { model: Incidencia, as: "Incidencia", attributes: ["nombre"] },
        { model: Prioridad, attributes: ["nombre"] },
        { model: EstadoCaso, as: "EstadoActual", attributes: ["nombre"] },
        {
          model: HistorialCaso,
          include: [
            { model: EstadoCaso, attributes: ["nombre"] },
            { model: Empleado, attributes: ["nombre", "apellido"] }
          ]
        }
      ]
    });

    const casosFormateados = casos.map(c => ({
      id_caso: c.id_caso,
      titulo: c.titulo,
      descripcion: c.descripcion,
      fecha_creacion: c.fecha_creacion,
      empleado: c.Empleado ? `${c.Empleado.nombre} ${c.Empleado.apellido}` : null,
      tipo_incidencia: c.TipoIncidencia?.tipo || null,
      incidencia: c.Incidencia?.nombre || null,
      prioridad: c.Prioridad?.nombre || null,
      estado_actual: c.EstadoActual?.nombre || null,
      historial: c.HistorialCasos.map(h => ({
        id_historial: h.id_historial,
        fecha: h.fecha,
        comentario: h.comentario,
        estado: h.EstadoCaso?.nombre || null,
        empleado: h.Empleado ? `${h.Empleado.nombre} ${h.Empleado.apellido}` : null
      }))
    }));

    res.json(casosFormateados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Crear caso ----------------
export const createCaso = async (req, res) => {
  try {
    const { id_empleado_solicita, id_tipo_incidencia, id_incidencia, titulo, descripcion, id_prioridad } = req.body;

    const nuevoCaso = await Caso.create({
      id_empleado_solicita,
      id_tipo_incidencia,
      id_incidencia,
      titulo,
      descripcion,
      id_prioridad
    });

    await HistorialCaso.create({
      id_caso: nuevoCaso.id_caso,
      comentario: "Caso recibido",
      id_estado: 1,
      id_empleado: id_empleado_solicita
    });

    res.status(201).json({ msg: "Caso creado exitosamente", id_caso: nuevoCaso.id_caso });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Actualizar caso ----------------
export const updateCaso = async (req, res) => {
  try {
    const caso = await Caso.findByPk(req.params.id);
    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    await caso.update(req.body);
    res.json(caso);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Cerrar caso ----------------
export const cerrarCaso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_empleado, detalles } = req.body;

    const caso = await Caso.findByPk(id);
    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    await caso.update({
      id_estado_actual: 3,
      fecha_cierre: new Date()
    });

    await HistorialCaso.create({
      id_caso: caso.id_caso,
      comentario: detalles || "Caso cerrado",
      id_estado: 3,
      id_empleado
    });

    res.json({ msg: "Caso cerrado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
