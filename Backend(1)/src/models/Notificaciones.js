import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; 


export const Notificaciones = sequelize.define(
  "Notificaciones",
  {
    ID_NOTIFICACION: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID_NOTIFICACION", // 🔹 nombre exacto en Oracle
    },
    ID_CASO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "CASOS",
        key: "ID_CASO",
      },
      field: "ID_CASO",
    },
    ID_EMPLEADO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "EMPLEADO",
        key: "ID_EMPLEADO",
      },
      field: "ID_EMPLEADO",
    },
    MENSAJE: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "MENSAJE",
    },
    ESTADO: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Encolado",
      field: "ESTADO",
    },
  },
  {
    tableName: "NOTIFICACIONES", // 🔹 nombre exacto de la tabla
    freezeTableName: true,        // evita que Sequelize pluralice
    timestamps: false,
  }
);