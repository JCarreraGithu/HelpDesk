import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Incidencia = sequelize.define(
  "Incidencia",
  {
    id_incidencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID_INCIDENCIA",
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      field: "NOMBRE",
    },
    id_tipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ID_TIPO",
    },
  },
  {
    tableName: "INCIDENCIAS",
    timestamps: false,
    freezeTableName: true, // ✅ evita que Sequelize pluralice el nombre
  }
);
