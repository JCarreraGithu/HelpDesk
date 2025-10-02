// src/routes/IncidenciaRoutes.js
import express from "express";
import {
  getAllTipos,
  getTipoById,
  createTipo,
  updateTipo,
  deleteTipo
} from "../controllers/IncidenciaController.js";

const router = express.Router();

router.get("/", getAllTipos);
router.get("/:id_tipo", getTipoById); // ⚠ usar id_tipo
router.post("/", createTipo);
router.put("/:id_tipo", updateTipo);  // ⚠ usar id_tipo
router.delete("/:id_tipo", deleteTipo); // ⚠ usar id_tipo

export default router;
