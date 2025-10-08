import { Caso } from "../models/Caso.js";
import { Empleado } from "../models/Empleado.js";
import { Prioridad } from "../models/Prioridad.js";
import { TipoIncidencia } from "../models/TipoIncidencias.js";
import { Incidencia } from "../models/Incidencia.js";
import { HistorialCaso } from "../models/HistorialCaso.js";
import { EstadoCaso } from "../models/EstadoCaso.js";
import { Notificaciones } from "../models/Notificaciones.js";
import { HistorialCasoRepuestos } from "../models/HistorialCasoRepuestos.js";

// ---------------- Formatear intervalo ----------------
const formatearIntervaloNode = (fechaCreacion, fechaCierre) => {
  if (!fechaCreacion || !fechaCierre) return null;

  const diffMs = new Date(fechaCierre) - new Date(fechaCreacion); // diferencia en ms
  const totalSegundos = Math.floor(diffMs / 1000);
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  return `${horas} h ${minutos} min ${segundos} seg`;
};

// ---------------- Formatear caso ----------------
const formatearCasoNode = (caso) => ({
  id_caso: caso.id_caso,
  titulo: caso.titulo,
  descripcion: caso.descripcion,
  fecha_creacion: caso.fecha_creacion,
  fecha_cierre: caso.fecha_cierre,
  tiempo_resolucion: formatearIntervaloNode(caso.fecha_creacion, caso.fecha_cierre),
  empleado: caso.Empleado ? `${caso.Empleado.nombre} ${caso.Empleado.apellido}` : null,
  tecnico: caso.Tecnico ? `${caso.Tecnico.nombre} ${caso.Tecnico.apellido}` : null,
  tipo_incidencia: caso.TipoIncidencia?.tipo || null,
  incidencia: caso.Incidencia?.nombre || null,
  prioridad: caso.Prioridad?.nombre || null,
  estado_actual: caso.EstadoActual?.nombre || null,
  historial: caso.HistorialCasos?.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha)).map(h => ({
    id_historial: h.id_historial,
    fecha: h.fecha,
    comentario: h.comentario,
    estado: h.EstadoCaso?.nombre || null,
    empleado: h.Empleado ? `${h.Empleado.nombre} ${h.Empleado.apellido}` : null,
    repuestos: h.HistorialCasoRepuestos?.map(r => ({
      id_repuesto: r.id_repuesto,
      cantidad: r.cantidad
    })) || []
  })) || []
});

// ---------------- Obtener todos los casos ----------------
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
            { model: Empleado, attributes: ["nombre", "apellido"] },
            { model: HistorialCasoRepuestos }
          ]
        }
      ]
    });

    res.json(casos.map(formatearCasoNode));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Obtener caso por ID ----------------
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
            { model: Empleado, attributes: ["nombre", "apellido"] },
            { model: HistorialCasoRepuestos }
          ]
        }
      ]
    });

    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });
    res.json(formatearCasoNode(caso));
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

    const estadoAnterior = caso.id_estado_actual;
    const nuevoEstado = req.body.id_estado_actual;
    const comentario = req.body.detalles || `Cambio de estado a ${nuevoEstado}`;

    await caso.update(req.body);

    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
      await HistorialCaso.create({
        id_caso: caso.id_caso,
        comentario,
        id_estado: nuevoEstado,
        id_empleado: req.body.id_empleado
      });

      const estadoObj = await EstadoCaso.findByPk(nuevoEstado);
      const nombreEstado = estadoObj ? estadoObj.nombre : nuevoEstado;

      await Notificaciones.create({
        ID_CASO: caso.id_caso,
        ID_EMPLEADO: caso.id_empleado_solicita,
        MENSAJE: `Tu caso con ID ${caso.id_caso} cambió de estado a: ${nombreEstado}`,
        ESTADO: "Encolado"
      });
    }

    // Recargar y devolver caso con tiempo_resolucion actualizado
    await caso.reload();
    res.json(formatearCasoNode(caso));
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

    if (caso.id_estado_actual === 3)
      return res.status(400).json({ msg: "El caso ya está cerrado" });

    // Actualizar estado y fecha de cierre
    await caso.update({
      id_estado_actual: 3,
      fecha_cierre: new Date()
    });

    // Crear historial del cierre
    const historial = await HistorialCaso.create({
      id_caso: caso.id_caso,
      comentario: detalles || "Caso cerrado",
      id_estado: 3,
      id_empleado
    });

    // Complicaciones
    if (complicacion) {
      await HistorialCaso.create({
        id_caso: caso.id_caso,
        comentario: `Complicación: ${complicacion}`,
        id_estado: 3,
        id_empleado
      });
    }

    // Materiales
    if (materiales && materiales.length > 0) {
      for (const mat of materiales) {
        await HistorialCasoRepuestos.create({
          id_historial: historial.id_historial,
          id_repuesto: mat.id_repuesto,
          cantidad: mat.cantidad || 1
        });
      }
    }

    // Notificación al solicitante
    await Notificaciones.create({
      ID_CASO: caso.id_caso,
      ID_EMPLEADO: caso.id_empleado_solicita,
      MENSAJE: `Tu caso con ID ${caso.id_caso} ha cambiado a: Cerrado`,
      ESTADO: "Encolado"
    });

    // Recargar caso para tener el tiempo_resolucion actualizado
    await caso.reload();
    res.json(formatearCasoNode(caso));
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Asignar técnico ----------------
// ---------------- Asignar técnico ----------------
export const asignarTecnico = async (req, res) => {
  try {
    const { id_caso } = req.params;
    const { id_tecnico, id_empleado, comentario } = req.body; // id_empleado: quien realiza la asignación

    // Buscar caso con relación al empleado que lo abrió
    const caso = await Caso.findByPk(id_caso, { include: "Empleado" }); 
    if (!caso) return res.status(404).json({ msg: "Caso no encontrado" });

    // Validación: no asignar si el caso ya está cerrado
    if (caso.estado_actual === "Cerrado") {
      return res.status(400).json({ msg: "No se puede asignar técnico: el caso ya está cerrado" });
    }

    // Actualizar técnico en el caso
    await caso.update({ id_tecnico });

    // Registrar historial
    await HistorialCaso.create({
      id_caso: caso.id_caso,
      comentario: comentario || `Técnico asignado: ${id_tecnico}`,
      id_estado: caso.id_estado_actual,
      id_empleado, // quien hace la asignación
    });

    // Crear notificación para el técnico asignado
    await Notificaciones.create({
      ID_CASO: caso.id_caso,
      ID_EMPLEADO: id_tecnico,
      MENSAJE: `Se te ha asignado el caso ID ${caso.id_caso}`,
      ESTADO: "Encolado",
    });

    // Crear notificación para el empleado que abrió el caso
    const idEmpleadoQueAbrió = caso.Empleado?.id_empleado || id_empleado; // fallback si no existe relación
    await Notificaciones.create({
      ID_CASO: caso.id_caso,
      ID_EMPLEADO: idEmpleadoQueAbrió,
      MENSAJE: `Tu caso ID ${caso.id_caso} ha sido asignado a un técnico`,
      ESTADO: "Encolado",
    });

    await caso.reload();
    res.json({
      msg: "Técnico asignado correctamente y notificaciones enviadas",
      caso: formatearCasoNode(caso),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al asignar técnico", error: error.message });
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
            { model: Empleado, attributes: ["nombre", "apellido"] },
            { model: HistorialCasoRepuestos }
          ]
        }
      ]
    });

    if (!casos || casos.length === 0) return res.status(404).json({ msg: "No se encontraron casos con ese título" });

    // Devolver siempre con tiempo_resolucion calculado
    res.json(casos.map(formatearCasoNode));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
