import { Empleado } from "./Empleado.js";
import { Departamento } from "./Departamento.js";
import { Caso } from "./Caso.js";
import { TipoIncidencia } from "./TipoIncidencias.js";
import { Prioridad } from "./Prioridad.js";
import { HistorialCaso } from "./HistorialCaso.js";
import { HistorialCasoRepuestos } from "./HistorialCasoRepuestos.js"; // ✅ necesario para la relación
import { Repuestos } from "./Repuestos.js";
import { SolicitudRepuestos } from "./SolicitudRepuestos.js";
import { EncuestaSatisfaccion } from "./Encuesta.js";
import { Notificaciones } from "./Notificaciones.js";
import { EstadoCaso } from "./EstadoCaso.js";
import { Incidencia } from "./Incidencia.js";
import { Puesto } from "./Puesto.js";

// ------------------- Relaciones -------------------

// Empleado ↔ Departamento
Empleado.belongsTo(Departamento, { foreignKey: "id_departamento" });
Departamento.hasMany(Empleado, { foreignKey: "id_departamento" });

// Empleado ↔ Puesto
Empleado.belongsTo(Puesto, { foreignKey: "id_puesto" });
Puesto.hasMany(Empleado, { foreignKey: "id_puesto" });

// Caso ↔ Empleado (Solicitante y Técnico)
Caso.belongsTo(Empleado, { foreignKey: "id_empleado_solicita" });
Empleado.hasMany(Caso, { foreignKey: "id_empleado_solicita" });

Caso.belongsTo(Empleado, { foreignKey: "id_tecnico", as: "Tecnico" });
Empleado.hasMany(Caso, { foreignKey: "id_tecnico", as: "CasosAsignados" });

// Caso ↔ TipoIncidencia, Prioridad, Incidencia, Estado
Caso.belongsTo(TipoIncidencia, { foreignKey: "id_tipo_incidencia", as: "TipoIncidencia" });
TipoIncidencia.hasMany(Caso, { foreignKey: "id_tipo_incidencia" });

Caso.belongsTo(Prioridad, { foreignKey: "id_prioridad" });
Prioridad.hasMany(Caso, { foreignKey: "id_prioridad" });

Caso.belongsTo(Incidencia, { foreignKey: "id_incidencia", as: "Incidencia" });
Incidencia.hasMany(Caso, { foreignKey: "id_incidencia" });

Caso.belongsTo(EstadoCaso, { foreignKey: "id_estado_actual", as: "EstadoActual" });
EstadoCaso.hasMany(Caso, { foreignKey: "id_estado_actual" });

// Caso ↔ HistorialCaso
Caso.hasMany(HistorialCaso, { foreignKey: "id_caso" });
HistorialCaso.belongsTo(Caso, { foreignKey: "id_caso" });

HistorialCaso.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasMany(HistorialCaso, { foreignKey: "id_empleado" });

HistorialCaso.belongsTo(EstadoCaso, { foreignKey: "id_estado" });
EstadoCaso.hasMany(HistorialCaso, { foreignKey: "id_estado" });

// ✅ HistorialCaso ↔ HistorialCasoRepuestos
HistorialCaso.hasMany(HistorialCasoRepuestos, { foreignKey: "id_historial" });
HistorialCasoRepuestos.belongsTo(HistorialCaso, { foreignKey: "id_historial" });

// SolicitudRepuestos ↔ Caso, Repuestos
SolicitudRepuestos.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasMany(SolicitudRepuestos, { foreignKey: "id_caso" });

SolicitudRepuestos.belongsTo(Repuestos, { foreignKey: "id_repuesto" });
Repuestos.hasMany(SolicitudRepuestos, { foreignKey: "id_repuesto" });

// EncuestaSatisfaccion ↔ Usuario (quien reporta)
EncuestaSatisfaccion.belongsTo(Empleado, { 
  foreignKey: "usuario_reporta", 
  as: "UsuarioReporta" 
});
Empleado.hasMany(EncuestaSatisfaccion, { 
  foreignKey: "usuario_reporta", 
  as: "EncuestasReportadas" 
});





// Notificaciones ↔ Caso, Empleado
Notificaciones.belongsTo(Caso, { foreignKey: "ID_CASO" });
Caso.hasMany(Notificaciones, { foreignKey: "ID_CASO" });

Notificaciones.belongsTo(Empleado, { foreignKey: "ID_EMPLEADO" });
Empleado.hasMany(Notificaciones, { foreignKey: "ID_EMPLEADO" });
