import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EncuestaSatisfaccion = sequelize.define("EncuestaSatisfaccion", {
  id_encuesta: {
    type: DataTypes.DECIMAL,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_ENCUESTA"
  },
  id_caso: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    field: "ID_CASO"
  },
  calificacion: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    field: "CALIFICACION"
  },
  comentario: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: "COMENTARIO"
  },
  fecha_respuesta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "FECHA_RESPUESTA"
  },
  usuario_reporta: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    field: "USUARIO_REPORTA"
  },
  calif_tiempo_respuesta: {
    type: DataTypes.DECIMAL(1,0),
    allowNull: true,
    field: "CALIF_TIEMPO_RESPUESTA"
  },
  calif_trato_tecnico: {
    type: DataTypes.DECIMAL(1,0),
    allowNull: true,
    field: "CALIF_TRATO_TECNICO"
  },
  calif_solucion: {
    type: DataTypes.DECIMAL(1,0),
    allowNull: true,
    field: "CALIF_SOLUCION"
  },
  calif_comunicacion: {
    type: DataTypes.DECIMAL(1,0),
    allowNull: true,
    field: "CALIF_COMUNICACION"
  },
  recomendaria: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    field: "RECOMENDARIA"
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "FECHA_CREACION"
  }
}, {
  tableName: "ENCUESTA_SATISFACCION",
  timestamps: false
});
