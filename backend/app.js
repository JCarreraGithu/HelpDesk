import express from "express";
import empleadosRoutes from "./src/routes/empleados.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use("/api/empleados", empleadosRoutes);

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
