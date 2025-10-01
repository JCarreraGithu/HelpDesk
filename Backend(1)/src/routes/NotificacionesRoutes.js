// routes/notificacionRoutes.js
import { Router } from "express";
import { getNotificaciones, marcarVisto } from "../controllers/NotificacionesController.js";

const router = Router();

router.get("/:id_empleado", getNotificaciones);
router.put("/:id", marcarVisto);

export default router;
