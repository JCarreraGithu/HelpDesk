import { Router } from "express";
import {
  getPuestos,
  getPuestoById,
  createPuesto,
  updatePuesto,
  deletePuesto
} from "../controllers/PuestoController.js";

const router = Router();

router.get("/", getPuestos);
router.get("/:id", getPuestoById);
router.post("/", createPuesto);
router.patch("/:id", updatePuesto);
router.delete("/:id", deletePuesto);

export default router;
