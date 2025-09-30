<<<<<<< HEAD
// src/models/associations.js
=======
>>>>>>> c288cad (se agregan endoints)
import { Empleado } from "./Empleado.js";
import { Departamento } from "./Departamento.js";
import { Caso } from "./Caso.js";
import { TipoIncidencia } from "./TipoIncidencias.js";
import { Prioridad } from "./Prioridad.js";
import { HistorialCaso } from "./HistorialCaso.js";
<<<<<<< HEAD
import { SLA } from "./SLA.js";
=======
>>>>>>> c288cad (se agregan endoints)
import { Repuestos } from "./Repuestos.js";
import { SolicitudRepuestos } from "./SolicitudRepuestos.js";
import { EncuestaSatisfaccion } from "./EncuestaSatisfaccion.js";
import { Notificaciones } from "./Notificaciones.js";
<<<<<<< HEAD
import { SlaView } from "./SlaView.js";


// Relación Empleado ↔ Departamento
Empleado.belongsTo(Departamento, { foreignKey: "id_departamento" });
Departamento.hasMany(Empleado, { foreignKey: "id_departamento" });

// Relación Casos ↔ Empleado
Caso.belongsTo(Empleado, { foreignKey: "id_empleado_solicita" });
Empleado.hasMany(Caso, { foreignKey: "id_empleado_solicita" });

// Casos ↔ TipoIncidencia
Caso.belongsTo(TipoIncidencia, { foreignKey: "id_tipo_incidencia" });
TipoIncidencia.hasMany(Caso, { foreignKey: "id_tipo_incidencia" });

// Casos ↔ Prioridad
Caso.belongsTo(Prioridad, { foreignKey: "id_prioridad" });
Prioridad.hasMany(Caso, { foreignKey: "id_prioridad" });

// Casos ↔ SLA
Caso.belongsTo(SLA, { foreignKey: "id_sla" });
SLA.hasMany(Caso, { foreignKey: "id_sla" });

// HistorialCaso ↔ Casos
=======
import { EstadoCaso } from "./EstadoCaso.js";
import { Incidencia } from "./Incidencia.js";

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
>>>>>>> c288cad (se agregan endoints)
HistorialCaso.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasMany(HistorialCaso, { foreignKey: "id_caso" });

// HistorialCaso ↔ Empleado
HistorialCaso.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasMany(HistorialCaso, { foreignKey: "id_empleado" });

<<<<<<< HEAD
// HistorialCaso ↔ Estado_Caso
import { EstadoCaso } from "./EstadoCaso.js";
HistorialCaso.belongsTo(EstadoCaso, { foreignKey: "id_estado" });
EstadoCaso.hasMany(HistorialCaso, { foreignKey: "id_estado" });

// Repuestos ↔ SolicitudRepuestos
SolicitudRepuestos.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasMany(SolicitudRepuestos, { foreignKey: "id_caso" });

SolicitudRepuestos.belongsTo(Repuestos, { foreignKey: "id_repuesto" });
Repuestos.hasMany(SolicitudRepuestos, { foreignKey: "id_repuesto" });

// EncuestaSatisfaccion ↔ Casos
EncuestaSatisfaccion.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasOne(EncuestaSatisfaccion, { foreignKey: "id_caso" });

// Notificaciones ↔ Casos y Empleado
=======
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

// Notificaciones ↔ Caso y Empleado
>>>>>>> c288cad (se agregan endoints)
Notificaciones.belongsTo(Caso, { foreignKey: "id_caso" });
Caso.hasMany(Notificaciones, { foreignKey: "id_caso" });

Notificaciones.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasMany(Notificaciones, { foreignKey: "id_empleado" });
<<<<<<< HEAD


Caso.belongsTo(SlaView, { foreignKey: "id_sla" });
SlaView.hasOne(Caso, { foreignKey: "id_sla" });
=======
>>>>>>> c288cad (se agregan endoints)
