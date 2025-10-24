import { Router } from "express";
import reportesControllerRepuesto from "../controllers/reportesControllerRepuesto.js";

const router = Router();

// 📊 1️⃣ Todos los repuestos
router.get("/totales", reportesControllerRepuesto.getTotales);

// 📉 2️⃣ Stock bajo
router.get("/stock-bajo", reportesControllerRepuesto.getStockBajo);

// 🔍 3️⃣ Buscar por nombre
router.get("/buscar", reportesControllerRepuesto.getPorNombre);

// 💰 4️⃣ Rango de precios
router.get("/precio", reportesControllerRepuesto.getPorPrecio);

export default router;
