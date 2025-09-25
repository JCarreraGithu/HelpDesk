import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Empleado } from "./Empleado.js";

export const Login = sequelize.define("Login", {
  id_login: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_LOGIN"
  },
  id_empleado: {
    type: DataTypes.NUMBER,
    allowNull: false,
    field: "ID_EMPLEADO"
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: "USERNAME"
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: "PASSWORD"
  },
  activo: {
    type: DataTypes.CHAR(1),
    defaultValue: "S",
    validate: { isIn: [["S","N"]] },
    field: "ACTIVO"
  }
}, {
  tableName: "LOGIN",
  timestamps: false
});

// Relación Login ↔ Empleado
Login.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasOne(Login, { foreignKey: "id_empleado" });
