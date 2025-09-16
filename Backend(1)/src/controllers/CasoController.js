import { Caso } from "../models/Caso.js";
import {Empleado} from "../models/Empleado.js";
import {Prioridad} from "../models/Prioridad.js";
import {TipoIncidencia} from "../models/TipoIncidencias.js";
import {SLA} from "../models/SLA.js";
import {HistorialCaso} from "../models/HistorialCaso.js";
import {EstadoCaso} from "../models/EstadoCaso.js";
import { SlaView } from "../models/SlaView.js";

// ---------------- Mostrar todos los casos ----------------
export const getCasos = async (req, res) => {
  try {
    const casos = await Caso.findAll({
      include: [
        { model: Empleado, attributes: ["nombre", "apellido"] },
        { model: TipoIncidencia, attributes: ["tipo"] },
        { model: Prioridad, attributes: ["nombre"] },
        { model: SlaView },
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
      tipo_incidencia: c.TipoIncidencium?.tipo || null,
      prioridad: c.Prioridad?.nombre || null,
      sla: c.SlaView ? {
        tiempo_resolucion: c.SlaView.tiempo_resolucion,
        tiempo_primer_respuesta: c.SlaView.tiempo_primer_respuesta
      } : null,
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
        { model: TipoIncidencia, attributes: ["tipo"] },
        { model: Prioridad, attributes: ["nombre"] },
        { model: SlaView },
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
      tipo_incidencia: caso.TipoIncidencium?.tipo || null,
      prioridad: caso.Prioridad?.nombre || null,
      sla: caso.SlaView ? {
        tiempo_resolucion: caso.SlaView.tiempo_resolucion,
        tiempo_primer_respuesta: caso.SlaView.tiempo_primer_respuesta
      } : null,
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


// ✅ Buscar por título (simple, aquí puedes decidir si también limpias o lo dejas crudo)
export const getCasoByTitulo = async (req, res) => {
  try {
    const { titulo } = req.params;
    const casos = await Caso.findAll({
      where: { titulo }
    });
    res.json(casos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ---------------- Crear caso con historial inicial ----------------
export const createCaso = async (req, res) => {
  try {
    // Crear el caso
    const nuevoCaso = await Caso.create(req.body);

    // Crear historial inicial
    await HistorialCaso.create({
      id_caso: nuevoCaso.id_caso,
      comentario: "Caso recibido",
      id_estado: 1, // Suponiendo que 1 = "Abierto"
      id_empleado: req.body.id_empleado_solicita
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