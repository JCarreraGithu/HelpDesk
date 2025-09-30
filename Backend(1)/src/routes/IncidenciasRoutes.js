import { Router } from "express";
import { getIncidencias } from "../controllers/IncidenciasController.js";

const router = Router();

router.get("/", getIncidencias);

export default router;
