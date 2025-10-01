import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Repuestos = sequelize.define("Repuestos", {
  id_repuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_REPUESTO"
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "NOMBRE"
  },
  descripcion: {
    type: DataTypes.STRING(255),
    field: "DESCRIPCION"
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
    field: "STOCK"
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
    field: "PRECIO_UNITARIO"
  }
}, {
  tableName: "REPUESTOS",
  timestamps: false
});
