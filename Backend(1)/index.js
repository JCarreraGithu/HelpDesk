import express from "express";
import { sequelize, testConnection } from "./src/config/db.js";
import empleadoRoutes from "./src/routes/EmpleadoRoutes.js";
import casoRoutes from "./src/routes/CasosRoutes.js";
import historialCasoRoutes from "./src/routes/HistorialCasoRoutes.js";
import "./src/models/associations.js";
import cors from "cors";
import authRoutes from "./src/routes/AuthRoutes.js";
import usuariosRoutes from "./src/routes/UsuariosRoutes.js"; // 🔹 CORREGIDO
import configRoutes from "./src/routes/ConfigRoutes.js";
import RepuestosRoutes from "./src/routes/RepuestosRoutes.js";
import incidenciasRoutes from "./src/routes/IncidenciasRoutes.js";
import notiRoutes from "./src/routes/NotificacionesRoutes.js";
import DepartamentoRoutes from "./src/routes/DepartamentoRoutes.js";
import PuestoRoutes from "./src/routes/PuestoRoutes.js";



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
app.use("/api/config", configRoutes);
app.use("/api/repuestos", RepuestosRoutes);
app.use("/api/incidencias", incidenciasRoutes);
app.use("/api/notificaciones", notiRoutes);
app.use("/api/departamentos", DepartamentoRoutes);
app.use("/api/puestos", PuestoRoutes);



app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  try {
    await testConnection();
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err);
  }
});


