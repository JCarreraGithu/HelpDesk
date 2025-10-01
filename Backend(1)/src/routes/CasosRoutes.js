import { Router } from "express";
import { 
  getCasos,
  getCasoById,
  getCasoByTitulo,
  createCaso,
  updateCaso,
  asignarTecnico
} from "../controllers/CasoController.js";

import { cerrarCaso } from "../controllers/CasoController.js";

const router = Router();

router.get("/", getCasos); // Mostrar todos los casos
router.get("/id/:id", getCasoById); // Buscar por ID
router.get("/titulo/:titulo", getCasoByTitulo); // Buscar por título
router.post("/", createCaso); // Crear caso
router.put("/:id", updateCaso); // Actualizar caso
router.put("/cerrar/:id", cerrarCaso);
router.put("/asignar-tecnico/:id_caso", asignarTecnico);


export default router;
