import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EstadoCaso = sequelize.define('EstadoCaso', {
  ID_ESTADO: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_ESTADO"
  },
  nombre: {                  // 👈 nombre en minúscula para JS
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "NOMBRE"          // 👈 columna real en Oracle
  }
}, {
  tableName: "ESTADO_CASO",
  timestamps: false
});
