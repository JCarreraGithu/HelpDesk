import { Router } from "express";
import {
  crearSolicitudRepuesto,
  listarSolicitudesPorCaso
} from "../controllers/SolicitarRepuestosController.js";

const router = Router();

router.post("/", crearSolicitudRepuesto);
router.get("/caso/:id", listarSolicitudesPorCaso);

export default router;