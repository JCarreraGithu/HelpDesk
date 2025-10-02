// src/models/TipoIncidencia.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const TipoIncidencia = sequelize.define("TipoIncidencia", {
  id_tipo: {           // ⚠ llave primaria correcta
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: "tipo_incidencia",
  timestamps: false
});

export default TipoIncidencia;
