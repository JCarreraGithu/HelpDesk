import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TipoIncidencia = sequelize.define('TipoIncidencia', {
  ID_TIPO: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
  type: DataTypes.STRING,
  field: "TIPO"
}

}, {
  tableName: "TIPO_INCIDENCIA",
  timestamps: false
});
