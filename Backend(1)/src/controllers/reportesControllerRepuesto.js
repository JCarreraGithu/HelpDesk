import { ejecutarReporte } from "../config/dboracle.js";// ✅ usamos tu función existente

const reportesControllerRepuesto = {
  // 📊 1️⃣ Reporte: Todos los repuestos
  getTotales: async (req, res) => {
    try {
      const rows = await ejecutarReporte({
        categoria: "repuestos",
        tipo_reporte: "totales",
        filtro: null,
        fecha_inicio: null,
        fecha_fin: null,
      });
      res.json(rows);
    } catch (err) {
      console.error("Error en getTotales:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // 📉 2️⃣ Reporte: Repuestos con stock bajo
  getStockBajo: async (req, res) => {
    try {
      const filtro = req.query.umbral || "5"; // umbral por defecto
      const rows = await ejecutarReporte({
        categoria: "repuestos",
        tipo_reporte: "stock_bajo",
        filtro,
        fecha_inicio: null,
        fecha_fin: null,
      });
      res.json(rows);
    } catch (err) {
      console.error("Error en getStockBajo:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // 🔍 3️⃣ Reporte: Buscar por nombre
  getPorNombre: async (req, res) => {
    try {
      const filtro = req.query.nombre || "";
      const rows = await ejecutarReporte({
        categoria: "repuestos",
        tipo_reporte: "por_nombre",
        filtro,
        fecha_inicio: null,
        fecha_fin: null,
      });
      res.json(rows);
    } catch (err) {
      console.error("Error en getPorNombre:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // 💰 4️⃣ Reporte: Rango de precios
  getPorPrecio: async (req, res) => {
    try {
      const { min = 0, max = 999999 } = req.query;
      const filtro = `${min},${max}`;
      const rows = await ejecutarReporte({
        categoria: "repuestos",
        tipo_reporte: "por_precio",
        filtro,
        fecha_inicio: null,
        fecha_fin: null,
      });
      res.json(rows);
    } catch (err) {
      console.error("Error en getPorPrecio:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

export default reportesControllerRepuesto;