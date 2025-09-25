import express from "express";
import { sequelize, testConnection } from "./src/config/db.js";
import empleadoRoutes from "./src/routes/EmpleadoRoutes.js";
import casoRoutes from "./src/routes/CasosRoutes.js";
import historialCasoRoutes from "./src/routes/HistorialCasoRoutes.js";
import "./src/models/associations.js";
import cors from "cors";
import authRoutes from "./src/routes/AuthRoutes.js";
import usuariosRoutes from "./src/routes/UsuariosRoutes.js"; // 🔹 CORREGIDO

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173"  // URL del frontend
}));

const PORT = process.env.PORT || 4000;

app.use("/api/empleados", empleadoRoutes);
app.use("/api/casos", casoRoutes);
app.use("/historial", historialCasoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  try {
    await testConnection();
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err);
  }
});
