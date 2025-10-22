import { Router } from "express";
import { getTiposIncidencia } from "../controllers/TipoIncidenciaController.js";
import { getPrioridades } from "../controllers/PrioridadController.js";
import { getEstadosCaso } from "../controllers/EstadoCasoController.js";

const router = Router();

router.get("/tipos-incidencia", getTiposIncidencia);
router.get("/prioridades", getPrioridades);
router.get("/estados-caso", getEstadosCaso);

export default router;
