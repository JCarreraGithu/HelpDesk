import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EstadoCaso = sequelize.define('EstadoCaso', {
  ID_ESTADO: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true
  },
  NOMBRE: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: "ESTADO_CASO",
  timestamps: false
});
