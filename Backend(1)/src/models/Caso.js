
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";



export const Caso = sequelize.define('Caso', {
  id_caso: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_CASO"
  },
  id_empleado_solicita: {
    type: DataTypes.NUMBER,
    allowNull: false,
    field: "ID_EMPLEADO_SOLICITA"
  },
  id_tipo_incidencia: {
    type: DataTypes.NUMBER,
    allowNull: false,
    field: "ID_TIPO_INCIDENCIA"
  },
  id_incidencia: {
    type: DataTypes.NUMBER,
    allowNull: true, // puede ser null
    field: "ID_INCIDENCIA"
  },
  id_tecnico: {  // ✅ Nuevo campo
    type: DataTypes.NUMBER,
    allowNull: true,
    field: "ID_TECNICO"
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: "TITULO"
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: "DESCRIPCION"
  },
  id_prioridad: {
    type: DataTypes.NUMBER,
    field: "ID_PRIORIDAD"
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "FECHA_CREACION"
  },
  id_estado_actual: {
    type: DataTypes.NUMBER,
    field: "ID_ESTADO_ACTUAL"
  },
  fecha_cierre: {
    type: DataTypes.DATE,
    field: "FECHA_CIERRE"
  }
}, {
  tableName: 'CASOS',
  timestamps: false
});
