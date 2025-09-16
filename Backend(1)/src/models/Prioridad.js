import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Prioridad = sequelize.define('Prioridad', {
  id_prioridad: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true, field: "ID_PRIORIDAD" },
  nombre: { type: DataTypes.STRING(50), allowNull: false, field: "NOMBRE" }
}, {
  tableName: 'PRIORIDAD',
  timestamps: false
});
