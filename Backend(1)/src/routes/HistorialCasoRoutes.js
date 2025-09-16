import { Router } from "express";
import { 
  getHistorial,
  getHistorialById,
  getHistorialByCaso,
  createHistorial,
  updateHistorial
} from "../controllers/HistorialCasoController.js";

const router = Router();

router.get("/", getHistorial); // Todos los registros
router.get("/id/:id", getHistorialById); // Buscar por ID
router.get("/caso/:id_caso", getHistorialByCaso); // Buscar por caso
router.post("/", createHistorial); // Crear registro
router.put("/:id", updateHistorial); // Actualizar registro

export default router;
