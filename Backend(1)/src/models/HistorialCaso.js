import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const HistorialCaso = sequelize.define('HistorialCaso', {
  id_historial: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true, field: "ID_HISTORIAL" },
  id_caso: { type: DataTypes.NUMBER, field: "ID_CASO" },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "FECHA" },
  comentario: { type: DataTypes.TEXT, field: "COMENTARIO" },
  id_estado: { type: DataTypes.NUMBER, field: "ID_ESTADO" },
  id_empleado: { type: DataTypes.NUMBER, field: "ID_EMPLEADO" }
}, {
  tableName: 'HISTORIAL_CASO',
  timestamps: false
});

