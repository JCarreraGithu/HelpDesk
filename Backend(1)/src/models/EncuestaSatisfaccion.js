// src/models/EncuestaSatisfaccion.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EncuestaSatisfaccion = sequelize.define("EncuestaSatisfaccion", {
  id_encuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_ENCUESTA"
  },
  id_caso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_CASO"
  },
  calificacion: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    field: "CALIFICACION"
  },
  comentario: {
    type: DataTypes.STRING(500),
    field: "COMENTARIO"
  },
  fecha_respuesta: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "FECHA_RESPUESTA"
  }
}, {
  tableName: "ENCUESTA_SATISFACCION",
  timestamps: false
});
