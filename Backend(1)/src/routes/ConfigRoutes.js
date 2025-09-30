import { Router } from "express";
import { getTiposIncidencia } from "../controllers/TipoIncidenciaController.js";
import { getPrioridades } from "../controllers/PrioridadController.js";

const router = Router();

router.get("/tipos-incidencia", getTiposIncidencia);
router.get("/prioridades", getPrioridades);

export default router;
