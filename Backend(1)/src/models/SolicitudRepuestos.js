import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SolicitudRepuestos = sequelize.define("SolicitudRepuestos", {
  id_caso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_CASO",
    primaryKey: true
  },
  id_repuesto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_REPUESTO",
    primaryKey: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "CANTIDAD"
  },
  comentario: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: "COMENTARIO"
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "FECHA_SOLICITUD"
  }
}, {
  tableName: "SOLICITUD_REPUESTOS",
  timestamps: false
});