import { Router } from "express";
import {
  getDepartamentos,
  getDepartamentoById,
  buscarDepartamentoPorNombre,
  crearDepartamento,
  actualizarDepartamento,
  eliminarDepartamento,
} from "../controllers/DepartamentosControllers.js";

const router = Router();

// Rutas CRUD
router.get("/", getDepartamentos); // listar todos
router.get("/:id", getDepartamentoById); // obtener por ID
router.get("/buscar/nombre", buscarDepartamentoPorNombre); // buscar por nombre
router.post("/", crearDepartamento); // crear nuevo
router.put("/:id", actualizarDepartamento); // actualizar
router.delete("/:id", eliminarDepartamento); // eliminar

export default router;
