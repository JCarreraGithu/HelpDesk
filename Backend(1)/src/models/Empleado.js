import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Puesto } from "./Puestos.js";

export const Empleado = sequelize.define("Empleado", {
  id_empleado: { 
    type: DataTypes.DECIMAL, 
    primaryKey: true, 
    autoIncrement: true, 
    field: "ID_EMPLEADO" 
  },
  id_departamento: { 
    type: DataTypes.DECIMAL, 
    allowNull: false, 
    field: "ID_DEPARTAMENTO" 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    field: "NOMBRE" 
  },
  apellido: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    field: "APELLIDO" 
  },
  correo: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    unique: true, 
    field: "CORREO" 
  },
  telefono: { 
    type: DataTypes.STRING(20), 
    allowNull: true, 
    field: "TELEFONO" 
  },
  id_puesto: { 
    type: DataTypes.DECIMAL, 
    allowNull: false, 
    field: "ID_PUESTO" 
  },
  rol: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    validate: { isIn: [['USUARIO','AGENTE','SUPERVISOR','ADMIN']] }, 
    field: "ROL" 
  },
  activo: { 
    type: DataTypes.CHAR(1), 
    defaultValue: 'S', 
    validate: { isIn: [['S','N']] }, 
    field: "ACTIVO" 
  }
}, {
  tableName: "EMPLEADO",
  timestamps: false
});

// Relación Empleado ↔ Puesto
Empleado.belongsTo(Puesto, { foreignKey: "id_puesto" });
Puesto.hasMany(Empleado, { foreignKey: "id_puesto" });
