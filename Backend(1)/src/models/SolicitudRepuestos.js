// src/models/SolicitudRepuestos.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SolicitudRepuestos = sequelize.define("SolicitudRepuestos", {
  id_caso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: "ID_CASO"
  },
  id_repuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: "ID_REPUESTO"
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    },
    field: "CANTIDAD"
  }
}, {
  tableName: "SOLICITUD_REPUESTOS",
  timestamps: false
});
