// src/models/Notificaciones.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Notificaciones = sequelize.define("Notificaciones", {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_NOTIFICACION"
  },
  id_caso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_CASO"
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_EMPLEADO"
  },
  mensaje: {
    type: DataTypes.STRING(255),
    field: "MENSAJE"
  },
  estado: {
    type: DataTypes.STRING(50),
    validate: {
      isIn: [["Encolado", "Enviado", "Visto"]]
    },
    field: "ESTADO"
  }
}, {
  tableName: "NOTIFICACIONES",
  timestamps: false
});
