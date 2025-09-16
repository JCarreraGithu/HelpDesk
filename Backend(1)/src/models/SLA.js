import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SLA = sequelize.define('SLA', {
  id_sla: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true, field: "ID_SLA" },
  tiempo_resolucion: { type: DataTypes.STRING, allowNull: false, field: "TIEMPO_RESOLUCION" },
  tiempo_primer_respuesta: { type: DataTypes.STRING, allowNull: false, field: "TIEMPO_PRIMER_RESPUESTA" },
  tiempo_maximo: { type: DataTypes.STRING, allowNull: false, field: "TIEMPO_MAXIMO" },
  tiempo_minimo: { type: DataTypes.STRING, allowNull: false, field: "TIEMPO_MINIMO" }
}, {
  tableName: 'SLA',
  timestamps: false
});
