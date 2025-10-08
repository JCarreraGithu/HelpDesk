import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Departamento = sequelize.define("Departamento", {
  id_departamento: {
    type: DataTypes.DECIMAL,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_DEPARTAMENTO",
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "NOMBRE",
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: "DESCRIPCION",
  },
}, {
  tableName: "DEPARTAMENTOS",
  timestamps: false,
});
