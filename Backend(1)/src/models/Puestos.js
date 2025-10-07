import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Puesto = sequelize.define(
  "Puesto",
  {
    id_puesto: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID_PUESTO",
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "NOMBRE",
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "DESCRIPCION",
    },
  },
  {
    tableName: "PUESTOS",
    timestamps: false,
  }
);
