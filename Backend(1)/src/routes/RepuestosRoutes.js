import { Router } from "express";
import {
  crearRepuesto,
  listarRepuestos,
  buscarRepuesto,
  editarRepuesto,
  eliminarRepuesto,
   buscarRepuestoPorNombre
} from "../controllers/RepuestosController.js";

const router = Router();

router.post("/", crearRepuesto);
router.get("/", listarRepuestos);
router.get("/:id", buscarRepuesto);
router.put("/:id", editarRepuesto);
router.delete("/:id", eliminarRepuesto);
router.get("/buscar", buscarRepuestoPorNombre);

export default router;
