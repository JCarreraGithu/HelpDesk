import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();

// 🧩 Configuración base
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool;

/* ============================================================
   🔹 Inicializar el Pool de Conexiones
   ============================================================ */
export async function initOraclePool() {
  if (pool) return pool;

  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1
  });

  console.log("✅ Pool Oracle (oracledb) listo");
  return pool;
}

/* ============================================================
   🔹 Cerrar el Pool
   ============================================================ */
export async function closeOraclePool() {
  if (pool) {
    await pool.close(0);
    pool = null;
    console.log("🛑 Pool Oracle cerrado correctamente");
  }
}

/* ============================================================
   🔹 Obtener el Pool (para uso interno)
   ============================================================ */
export function getOraclePool() {
  if (!pool) {
    throw new Error("El pool de Oracle no está inicializado. Llama a initOraclePool() primero.");
  }
  return pool;
}

/* ============================================================
   🔹 Ejecutar el Procedimiento PL/SQL: PKG_REPORTES.GENERAR_REPORTE
   ============================================================ */
export async function ejecutarReporte({ categoria, tipo_reporte, filtro = null, fecha_inicio, fecha_fin }) {
  await initOraclePool();
  let conn;

  try {
    const pool = getOraclePool();
    conn = await pool.getConnection();

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
        p_filtro: { val: filtro, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_fecha_inicio: { val: fecha_inicio, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_fecha_fin: { val: fecha_fin, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_resultado: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const rs = result.outBinds.p_resultado;

    // 🔹 Leer los datos del cursor
    const rows = [];
    let batch;
    do {
      batch = await rs.getRows(100);
      rows.push(...batch);
    } while (batch.length > 0);

    await rs.close();

    // 🔹 Normalizar claves (opcional: minúsculas)
    const normalized = rows.map((row) => {
      const o = {};
      for (const k of Object.keys(row)) {
        o[k.toLowerCase()] = row[k];
      }
      return o;
    });

    return normalized;
  } catch (err) {
    console.error("❌ Error ejecutarReporte:", err);
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}
