import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Empleado from "./Empleado.js"; // Asegúrate de tener el modelo Empleado

const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Empleado,
      key: "id_empleado",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: "Usuarios",
  timestamps: false,
});

export default Usuario;
