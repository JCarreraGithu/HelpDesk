import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Puesto = sequelize.define("Puesto", {
  id_puesto: {
    type: DataTypes.DECIMAL,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_PUESTO"
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "NOMBRE"
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: "DESCRIPCION"
  }
}, {
  tableName: "PUESTOS",
  timestamps: false
});
