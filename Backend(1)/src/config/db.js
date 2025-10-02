import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("helpdesk", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3306
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a MySQL correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error);
  }
};
