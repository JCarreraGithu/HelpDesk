import { Router } from "express";
import {
getIncidencias,
getIncidenciaById,
createIncidencia,
updateIncidencia,
deleteIncidencia,
} from "../controllers/IncidenciasController.js";

const router = Router();

router.get("/", getIncidencias);
router.get("/:id", getIncidenciaById);
router.post("/", createIncidencia);
router.put("/:id", updateIncidencia);
router.delete("/:id", deleteIncidencia);

export default router;
