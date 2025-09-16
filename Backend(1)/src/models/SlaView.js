import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SlaView = sequelize.define('SlaView', {
  id_sla: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    field: "ID_SLA"
  },
  tiempo_resolucion_minutos: {
    type: DataTypes.INTEGER,
    field: "TIEMPO_RESOLUCION_MINUTOS"
  },
  tiempo_primer_respuesta_minutos: {
    type: DataTypes.INTEGER,
    field: "TIEMPO_PRIMER_RESPUESTA_MINUTOS"
  },
  tiempo_maximo_minutos: {
    type: DataTypes.INTEGER,
    field: "TIEMPO_MAXIMO_MINUTOS"
  },
  tiempo_minimo_minutos: {
    type: DataTypes.INTEGER,
    field: "TIEMPO_MINIMO_MINUTOS"
  }
}, {
  tableName: "SLA_VIEW",
  timestamps: false
});
