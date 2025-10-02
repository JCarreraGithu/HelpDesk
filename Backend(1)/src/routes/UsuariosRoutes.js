import express from "express";
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../controllers/UsuarioController.js";

const router = express.Router();

router.get("/", getUsuarios);
router.get("/:id", getUsuario);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

export default router;
