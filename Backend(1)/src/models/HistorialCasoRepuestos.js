// models/HistorialCasoRepuestos.js
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/db.js";
import { HistorialCaso } from "./HistorialCaso.js";
import { Repuestos } from "./Repuestos.js";

export const HistorialCasoRepuestos = sequelize.define('HistorialCasoRepuestos', {
  id_historial_repuesto: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    defaultValue: Sequelize.literal("historialcasorepuestos_seq.NEXTVAL"),
    field: "ID_HISTORIAL_REPUESTO"
  },
  id_historial: {
    type: DataTypes.NUMBER,
    allowNull: false,
    field: "ID_HISTORIAL"
  },
  id_repuesto: {
    type: DataTypes.NUMBER,
    allowNull: false,
    field: "ID_REPUESTO"
  },
  cantidad: {
    type: DataTypes.NUMBER,
    defaultValue: 1,
    field: "CANTIDAD"
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: "COMENTARIO"
  }
}, {
  tableName: 'HISTORIALCASOREPUESTOS',
  timestamps: false
});

