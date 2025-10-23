import { Router } from "express";
import {
  crearRepuesto,
  listarRepuestos,
  buscarRepuesto,
  editarRepuesto,
  eliminarRepuesto,
  buscarRepuestoPorNombre,
  descontarStock
} from "../controllers/RepuestosController.js";

import { registrarUsoRepuesto } from "../controllers/RepuestosUsadosController.js";

const router = Router();

router.post("/", crearRepuesto);
router.get("/", listarRepuestos);
router.get("/:id", buscarRepuesto);
router.put("/:id", editarRepuesto);
router.delete("/:id", eliminarRepuesto);
router.get("/buscar/nombre", buscarRepuestoPorNombre);
router.post("/usados", registrarUsoRepuesto);
router.put("/:id/descontar", descontarStock);

export default router;