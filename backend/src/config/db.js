import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

async function initOracle() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT // ej: localhost:1521/XEPDB1
    });
    console.log("✅ Conectado a Oracle");
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  }
}

export { initOracle, oracledb };
