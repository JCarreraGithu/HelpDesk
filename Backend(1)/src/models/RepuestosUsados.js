import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const RepuestosUsados = sequelize.define("RepuestosUsados", {
  id_uso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_USO"
  },
  id_caso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_CASO"
  },
  id_repuesto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ID_REPUESTO"
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "CANTIDAD"
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "COMENTARIO"
  },
  fecha_uso: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "FECHA_USO"
  }
}, {
  tableName: "REPUESTOS_USADOS",
  timestamps: false
});