import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EstadoCaso = sequelize.define('EstadoCaso', {
  id_estado: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true, field: "ID_ESTADO" },
  nombre: { type: DataTypes.STRING(50), allowNull: false, field: "NOMBRE" }
}, {
  tableName: 'ESTADO_CASO',
  timestamps: false
});
