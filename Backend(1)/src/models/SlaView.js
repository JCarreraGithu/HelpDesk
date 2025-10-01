import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SlaView = sequelize.define('SlaView', {
  id_caso: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    field: "ID_CASO"
  },
  tiempo_resolucion: {
    type: DataTypes.STRING,
    field: "TIEMPO_RESOLUCION"
  },
  tiempo_primer_respuesta: {
    type: DataTypes.STRING,
    field: "TIEMPO_PRIMER_RESPUESTA"
  }
}, {
  tableName: "SLA_VIEW",
  timestamps: false
});
