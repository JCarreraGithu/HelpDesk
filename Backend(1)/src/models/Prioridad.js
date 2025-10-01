import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Prioridad = sequelize.define("Prioridad", {
    id_prioridad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "ID_PRIORIDAD" // <-- esto mapea la columna real
    },
    nombre: {
        type: DataTypes.STRING,
        field: "NOMBRE"
    }
}, {
    tableName: "PRIORIDAD",
    timestamps: false
});
