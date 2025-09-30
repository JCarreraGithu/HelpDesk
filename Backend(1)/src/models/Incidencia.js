import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Incidencia = sequelize.define("Incidencia", {
  id_incidencia: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_INCIDENCIA"
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    field: "NOMBRE"
  }
}, {
  tableName: "INCIDENCIAS",
  timestamps: false
});
