// routes/TipoIncidenciasRoutes.js
import { Router } from "express";
import { getTiposIncidencia } from "../controllers/TipoIncidenciaController.js";

const router = Router();

// Endpoint para obtener todos los tipos de incidencia
router.get("/tipos-incidencia", getTiposIncidencia);

export default router;
