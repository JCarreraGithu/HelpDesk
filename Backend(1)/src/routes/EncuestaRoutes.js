import express from "express";
import { createEncuesta, getEncuestas } from "../controllers/EncuestaController.js";

const router = express.Router();

router.get("/", getEncuestas);
router.post("/", createEncuesta);

export default router;