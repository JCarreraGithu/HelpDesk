    import { Router } from "express";
    import { generarReporte } from "../controllers/reportesController.js";

    

    const router = Router();

 router.post("/", generarReporte);

    export default router;