    import { Router } from "express";
    import { generarReporte } from "../controllers/reportesController.js";
import { generarReporteEncuesta } from "../controllers/2ReportesController.js";
    

    const router = Router();

    router.post("/Encuestas/Encuestas", generarReporteEncuesta);
 router.post("/", generarReporte);

    export default router;