import express from "express";
import { getCasos, getCasoById, crearCaso, updateCaso, deleteCaso } from "../controllers/casos.controller.js";

const router = express.Router();

// Rutas CRUD
router.get("/", getCasos);          // Listar todos
router.get("/:id", getCasoById);    // Obtener por ID
router.post("/", crearCaso);        // Crear
router.put("/:id", updateCaso);     // Actualizar
router.delete("/:id", deleteCaso);  // Eliminar

export default router;
