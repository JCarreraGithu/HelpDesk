import { Router } from "express";
import {
  crearUsuario,
  listarUsuarios,
  buscarUsuario,
  editarUsuario,
  eliminarUsuario,
} from "../controllers/UsuariosController.js";

const router = Router();

router.post("/", crearUsuario);
router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;
