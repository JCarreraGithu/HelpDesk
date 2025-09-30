<<<<<<< HEAD
// src/models/Repuestos.js
=======
>>>>>>> c288cad (se agregan endoints)
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Repuestos = sequelize.define("Repuestos", {
  id_repuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_REPUESTO"
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "NOMBRE"
  },
  descripcion: {
    type: DataTypes.STRING(255),
    field: "DESCRIPCION"
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
<<<<<<< HEAD
    validate: {
      min: 0
    },
=======
    validate: { min: 0 },
>>>>>>> c288cad (se agregan endoints)
    field: "STOCK"
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
<<<<<<< HEAD
    validate: {
      min: 0
    },
=======
    validate: { min: 0 },
>>>>>>> c288cad (se agregan endoints)
    field: "PRECIO_UNITARIO"
  }
}, {
  tableName: "REPUESTOS",
  timestamps: false
});
