import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Empleado } from "./Empleado.js";

export const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_USUARIO",
  },
  id_empleado: {
    type: DataTypes.NUMBER,
    allowNull: false,
    field: "ID_EMPLEADO",
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: "USERNAME",
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: "PASSWORD",
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "ULTIMO_LOGIN",
  },
  activo: {
    type: DataTypes.CHAR(1),
    defaultValue: "S",
    validate: { isIn: [["S", "N"]] },
    field: "ACTIVO",
  },
}, {
  tableName: "USUARIOS",
  timestamps: false,
});

// Relación Usuario ↔ Empleado
Usuario.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasOne(Usuario, { foreignKey: "id_empleado" });

