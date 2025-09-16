import { Router } from "express";
import {
  getEmpleados,
  getEmpleadoById,
  getEmpleadoByNombre,
  createEmpleado,
  updateEmpleado,
  toggleActivoEmpleado
} from "../controllers/EmpleadoController.js";

const router = Router();

router.get("/", getEmpleados);
router.get("/buscar/nombre", getEmpleadoByNombre); // query param ?nombre=
router.get("/:id", getEmpleadoById);
router.post("/", createEmpleado);
router.put("/:id", updateEmpleado);
router.patch("/activo/:id", toggleActivoEmpleado); // PATCH porque modificas solo un campo


export default router;
