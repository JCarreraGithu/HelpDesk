import { Empleado } from "./Empleado.js";
import { Departamento } from "./Departamento.js";
import { Caso } from "./Caso.js";
import { TipoIncidencia } from "./TipoIncidencias.js";
import { Prioridad } from "./Prioridad.js";
import { HistorialCaso } from "./HistorialCaso.js";
import { Repuestos } from "./Repuestos.js";
import { SolicitudRepuestos } from "./SolicitudRepuestos.js";
import { EncuestaSatisfaccion } from "./EncuestaSatisfaccion.js";
import { Notificaciones } from "./Notificaciones.js";
import { EstadoCaso } from "./EstadoCaso.js";
import { Incidencia } from "./Incidencia.js";
import { Puesto } from "./Puesto.js";
import { HistorialCasoRepuestos } from "./HistorialCasoRepuestos.js";


// ------------------- Relaciones -------------------

// Empleado ↔ Departamento
Empleado.belongsTo(Departamento, { foreignKey: "id_departamento" });
Departamento.hasMany(Empleado, { foreignKey: "id_departamento" });

// Caso ↔ Empleado
Caso.belongsTo(Empleado, { foreignKey: "id_empleado_solicita" });
Empleado.hasMany(Caso, { foreignKey: "id_empleado_solicita" });

// Relación Caso ↔ TipoIncidencia
Caso.belongsTo(TipoIncidencia, { foreignKey: "id_tipo_incidencia", as: "TipoIncidencia" });
TipoIncidencia.hasMany(Caso, { foreignKey: "id_tipo_incidencia" });

// Caso ↔ Prioridad
Caso.belongsTo(Prioridad, { foreignKey: "id_prioridad" });
Prioridad.hasMany(Caso, { foreignKey: "id_prioridad" });

// Relación Caso ↔ Incidencia
Caso.belongsTo(Incidencia, { foreignKey: "id_incidencia", as: "Incidencia" });
Incidencia.hasMany(Caso, { foreignKey: "id_incidencia" });

// Caso ↔ EstadoCaso (Estado Actual)
Caso.belongsTo(EstadoCaso, { foreignKey: "id_estado_actual", as: "EstadoActual" });
EstadoCaso.hasMany(Caso, { foreignKey: "id_estado_actual" });

// HistorialCaso ↔ Caso
HistorialCaso.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasMany(HistorialCaso, { foreignKey: "id_caso" });

// HistorialCaso ↔ Empleado
HistorialCaso.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasMany(HistorialCaso, { foreignKey: "id_empleado" });

// HistorialCaso ↔ EstadoCaso
HistorialCaso.belongsTo(EstadoCaso, { foreignKey: "id_estado" });
EstadoCaso.hasMany(HistorialCaso, { foreignKey: "id_estado" });

// SolicitudRepuestos ↔ Caso
SolicitudRepuestos.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasMany(SolicitudRepuestos, { foreignKey: "id_caso" });

// SolicitudRepuestos ↔ Repuestos
SolicitudRepuestos.belongsTo(Repuestos, { foreignKey: "id_repuesto" });
Repuestos.hasMany(SolicitudRepuestos, { foreignKey: "id_repuesto" });

// EncuestaSatisfaccion ↔ Caso
EncuestaSatisfaccion.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasOne(EncuestaSatisfaccion, { foreignKey: "id_caso" });
// Notificaciones ↔ Caso
Notificaciones.belongsTo(Caso, { foreignKey: "ID_CASO" });
Caso.hasMany(Notificaciones, { foreignKey: "ID_CASO" });

Notificaciones.belongsTo(Empleado, { foreignKey: "ID_EMPLEADO" });
Empleado.hasMany(Notificaciones, { foreignKey: "ID_EMPLEADO" });


Caso.belongsTo(Empleado, { foreignKey: "id_tecnico", as: "Tecnico" });
Empleado.hasMany(Caso, { foreignKey: "id_tecnico", as: "CasosAsignados" });


// Relación con Puesto
Empleado.belongsTo(Puesto, { foreignKey: "id_puesto" });
Puesto.hasMany(Empleado, { foreignKey: "id_puesto" });


// HistorialCaso ↔ HistorialCasoRepuestos
HistorialCasoRepuestos.belongsTo(HistorialCaso, { foreignKey: "id_historial" });
HistorialCaso.hasMany(HistorialCasoRepuestos, { foreignKey: "id_historial" });

// HistorialCasoRepuestos ↔ Repuestos
HistorialCasoRepuestos.belongsTo(Repuestos, { foreignKey: "id_repuesto" });
Repuestos.hasMany(HistorialCasoRepuestos, { foreignKey: "id_repuesto" });