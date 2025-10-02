import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Repuesto = sequelize.define("Repuesto", {
  id_repuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255)
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  }
}, {
  tableName: "repuestos",
  timestamps: false
});

export default Repuesto;
