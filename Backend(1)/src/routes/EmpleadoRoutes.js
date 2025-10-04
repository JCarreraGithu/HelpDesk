import { Router } from "express";
import {
  getEmpleados,
  getEmpleadoById,
  getEmpleadoByNombre,
  createEmpleado,
  updateEmpleado,
  toggleActivoEmpleado,
  getTecnicos
} from "../controllers/EmpleadoController.js";

const router = Router();

router.get("/", getEmpleados);
router.get("/tecnicos", getTecnicos); 
router.get("/buscar/nombre", getEmpleadoByNombre); // query param ?nombre=
router.get("/:id", getEmpleadoById);
router.post("/", createEmpleado);
router.patch("/:id", updateEmpleado);
router.get("/tecnicos", getTecnicos); 
router.patch("/activo/:id", toggleActivoEmpleado); // PATCH porque modificas solo un campo


export default router;
