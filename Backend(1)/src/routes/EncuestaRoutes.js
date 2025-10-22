import { Router } from "express";
import { getEncuestas, createEncuesta } from "../controllers/EncuestaController.js";

const router = Router();

router.get("/", getEncuestas);       // Obtener todas
router.post("/", createEncuesta);    // Insertar nueva

export default router;
