import { Caso } from "../models/Caso.js";
import { Empleado } from "../models/Empleado.js";
import { Prioridad } from "../models/Prioridad.js";
import { TipoIncidencia } from "../models/TipoIncidencias.js";
import { Incidencia } from "../models/Incidencia.js";
import { HistorialCaso } from "../models/HistorialCaso.js";
import { EstadoCaso } from "../models/EstadoCaso.js";
import { Notificaciones } from "../models/Notificaciones.js";

// ---------------- Formatear caso ----------------
const formatearCaso = (caso) => ({
  id_caso: caso.id_caso,
  titulo: caso.titulo,
  descripcion: caso.descripcion,
  fecha_creacion: caso.fecha_creacion,
  empleado: caso.Empleado ? `${caso.Empleado.nombre} ${caso.Empleado.apellido}` : null,
  tecnico: caso.Tecnico ? `${caso.Tecnico.nombre} ${caso.Tecnico.apellido}` : null,
  tipo_incidencia: caso.TipoIncidencia?.tipo || null,
  incidencia: caso.Incidencia?.nombre || null,
  prioridad: caso.Prioridad?.nombre || null,
  estado_actual: caso.EstadoActual?.nombre || null,
  historial: caso.HistorialCasos?.map(h => ({
    id_historial: h.id_historial,
    fecha: h.fecha,
    comentario: h.comentario,
    estado: h.EstadoCaso?.nombre || null,
    empleado: h.Empleado ? `${h.Empleado.nombre} ${h.Empleado.apellido}` : null
  })) || []
});

// ---------------- Mostrar todos los casos ----------------
export const getCasos = async (req, res) => {
  try {
    const casos = await Caso.findAll({
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: Empleado, as: "Tecnico", attributes: ["nombre", "apellido"] },
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

    res.json(casos.map(formatearCaso));
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
        { model: Empleado, as: "Tecnico", attributes: ["nombre", "apellido"] },
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

    res.json(formatearCaso(caso));
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

// ---------------- Buscar caso por título ----------------
export const getCasoByTitulo = async (req, res) => {
  try {
    const { titulo } = req.params;
    const casos = await Caso.findAll({
      where: { titulo },
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: Empleado, as: "Tecnico", attributes: ["nombre", "apellido"] },
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

    res.json(casos.map(formatearCaso));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Actualizar caso ----------------
export const updateCaso = async (req, res) => {
  try {
    const caso = await Caso.findByPk(req.params.id);
    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    const estadoAnterior = caso.id_estado_actual;
    const nuevoEstado = req.body.id_estado_actual;

    await caso.update(req.body);

    // Crear notificación si el estado cambió
    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
      const estadoObj = await EstadoCaso.findByPk(nuevoEstado);
      const nombreEstado = estadoObj ? estadoObj.nombre : nuevoEstado;

      await Notificaciones.create({
        ID_CASO: caso.id_caso,
        ID_EMPLEADO: caso.id_empleado_solicita,
        MENSAJE: `Tu caso con ID ${caso.id_caso} cambió de estado a: ${nombreEstado}`,
        ESTADO: "Encolado"
      });
    }

    res.json(formatearCaso(caso));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Cerrar caso ----------------
export const cerrarCaso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_empleado, detalles, complicacion, materiales } = req.body;

    const caso = await Caso.findByPk(id);
    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    // Actualizar estado
    await caso.update({
      id_estado_actual: 3, // Cerrado
      fecha_cierre: new Date()
    });

    // Guardar en historial
    await HistorialCaso.create({
      id_caso: caso.id_caso,
      comentario: detalles || "Caso cerrado",
      id_estado: 3,
      id_empleado
    });

    if (complicacion) {
      await HistorialCaso.create({
        id_caso: caso.id_caso,
        comentario: `Complicación: ${complicacion}`,
        id_estado: 3,
        id_empleado
      });
    }

    // Materiales (opcional)
    if (materiales && materiales.length > 0) {
      for (const mat of materiales) {
        // await CasoRepuesto.create({ ... })
      }
    }

    // Crear notificación
    await Notificaciones.create({
      ID_CASO: caso.id_caso,
      ID_EMPLEADO: caso.id_empleado_solicita,
      MENSAJE: `Tu caso con ID ${caso.id_caso} ha cambiado a: Cerrado`,
      ESTADO: "Encolado"
    });

    res.json({ msg: "Caso cerrado exitosamente y notificación enviada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Asignar técnico ----------------
export const asignarTecnico = async (req, res) => {
  try {
    const { id_caso } = req.params;
    const { id_tecnico } = req.body;

    const caso = await Caso.findByPk(id_caso);
    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    await caso.update({ id_tecnico });

    // Traer de nuevo con relaciones
    const casoCompleto = await Caso.findByPk(id_caso, {
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: Empleado, as: "Tecnico", attributes: ["nombre", "apellido"] },
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

    await Notificaciones.create({
      ID_CASO: caso.id_caso,
      ID_EMPLEADO: id_tecnico,
      MENSAJE: `Se te ha asignado el caso ID ${caso.id_caso}`,
      ESTADO: "Encolado"
    });

    res.json({ msg: "Técnico asignado correctamente", caso: formatearCaso(casoCompleto) });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
