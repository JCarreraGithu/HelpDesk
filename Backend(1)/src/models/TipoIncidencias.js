import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TipoIncidencia = sequelize.define('TipoIncidencia', {
  id_tipo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true, field: "ID_TIPO" },
  tipo: { type: DataTypes.STRING(100), allowNull: false, field: "TIPO" }
}, {
  tableName: 'TIPO_INCIDENCIA',
  timestamps: false
});
