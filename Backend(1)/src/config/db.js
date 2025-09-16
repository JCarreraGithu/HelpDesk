import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "oracle",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectOptions: {
    connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
  },
  logging: false
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la DB exitosa");
  } catch (error) {
    console.error("❌ Error DB:", error);
  }
};
 