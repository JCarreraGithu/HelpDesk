import oracledb from "oracledb";
import { initOraclePool } from "../config/dboracle.js";

/**
 * Controlador que ejecuta el procedimiento PL/SQL PKG_REPORTES.GENERAR_REPORTE
 */
export const generarReporte = async (req, res) => {
  const { categoria, tipo_reporte, p_filtro, fecha_inicio, fecha_fin } = req.body || {};

  // 🧩 Validaciones básicas
  if (!categoria || !tipo_reporte || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      ok: false,
      msg: "Faltan parámetros requeridos (categoria, tipo_reporte, fecha_inicio, fecha_fin)",
    });
  }

  try {
    // Asegurar que el pool Oracle esté disponible
    await initOraclePool();
    const conn = await oracledb.getConnection();

    // 🧠 Ejecutar el procedimiento PL/SQL
    const result = await conn.execute(
      `
      BEGIN
        PKG_REPORTES.GENERAR_REPORTE(
          :p_categoria,
          :p_tipo_reporte,
          :p_filtro,
          TO_DATE(:p_fecha_inicio, 'YYYY-MM-DD'),
          TO_DATE(:p_fecha_fin, 'YYYY-MM-DD'),
          :p_resultado
        );
      END;
      `,
      {
        p_categoria: { val: categoria, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_tipo_reporte: { val: tipo_reporte, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_filtro: { val: p_filtro || null, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_fecha_inicio: { val: fecha_inicio, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_fecha_fin: { val: fecha_fin, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_resultado: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 📤 Leer el cursor
    const rs = result.outBinds.p_resultado;
    const rows = [];
    let batch;
    do {
      batch = await rs.getRows(500);
      rows.push(...batch);
    } while (batch.length > 0);
    await rs.close();

    // 🔠 Normalizar las claves a minúsculas
    const data = rows.map((row) => {
      const obj = {};
      for (const key of Object.keys(row)) {
        obj[key.toLowerCase()] = row[key];
      }
      return obj;
    });

    await conn.close();

    // 📦 Devolver respuesta
    return res.json({ ok: true, data });
  } catch (err) {
    console.error("❌ Error en generarReporte:", err);
    return res.status(500).json({
      ok: false,
      msg: "Error al generar reporte",
      error: err.message,
    });
  }
};