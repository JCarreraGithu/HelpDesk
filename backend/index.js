import express from "express";
import { initOracle } from "./src/config/db.js";
import casosRoutes from "./src/routes/casos.routes.js";

const app = express();
app.use(express.json());

// Rutas
app.use("/api/casos", casosRoutes);

const PORT = process.env.PORT || 4000;

initOracle().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Conectado a Oracle`);
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});