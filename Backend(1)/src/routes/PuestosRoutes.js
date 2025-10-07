import { Router } from "express";
import {
  getPuestos,
  getPuestoById,
  buscarPuestoPorNombre,
  crearPuesto,
  actualizarPuesto,
  eliminarPuesto,
} from "../controllers/PuestosController.js";

const router = Router();

router.get("/", getPuestos);
router.get("/:id", getPuestoById);
router.get("/buscar/nombre", buscarPuestoPorNombre);
router.post("/", crearPuesto);
router.put("/:id", actualizarPuesto);
router.delete("/:id", eliminarPuesto);

export default router;
