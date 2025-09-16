import { oracledb } from "../config/db.js";

// 🔹 Función para leer LOB (CLOB → string)
async function readLob(lob) {
  return new Promise((resolve, reject) => {
    if (lob === null) return resolve(null);

    let data = "";
    lob.setEncoding("utf8");
    lob.on("data", (chunk) => (data += chunk));
    lob.on("end", () => resolve(data));
    lob.on("error", (err) => reject(err));
  });
}

// 🔹 Obtener todos los casos
export const getCasos = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(`
      SELECT ID_CASO, ID_EMPLEADO_SOLICITA, ID_TIPO_INCIDENCIA, TITULO, DESCRIPCION, ID_PRIORIDAD, FECHA_CREACION, ID_SLA 
      FROM CASOS
    `);

    const casos = [];
    for (const row of result.rows) {
      casos.push({
        ID_CASO: row[0],
        ID_EMPLEADO_SOLICITA: row[1],
        ID_TIPO_INCIDENCIA: row[2],
        TITULO: row[3],
        DESCRIPCION: await readLob(row[4]),
        ID_PRIORIDAD: row[5],
        FECHA_CREACION: row[6],
        ID_SLA: row[7],
      });
    }

    res.json(casos);
  } catch (error) {
    console.error("❌ Error en getCasos:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 Obtener caso por ID
export const getCasoById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT ID_CASO, ID_EMPLEADO_SOLICITA, ID_TIPO_INCIDENCIA, TITULO, DESCRIPCION, ID_PRIORIDAD, FECHA_CREACION, ID_SLA 
       FROM CASOS WHERE ID_CASO = :id`,
      { id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }

    const row = result.rows[0];
    const caso = {
      ID_CASO: row[0],
      ID_EMPLEADO_SOLICITA: row[1],
      ID_TIPO_INCIDENCIA: row[2],
      TITULO: row[3],
      DESCRIPCION: await readLob(row[4]),
      ID_PRIORIDAD: row[5],
      FECHA_CREACION: row[6],
      ID_SLA: row[7],
    };

    res.json(caso);
  } catch (error) {
    console.error("❌ Error en getCasoById:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 Crear caso
export const crearCaso = async (req, res) => {
  const { id_empleado_solicita, id_tipo_incidencia, titulo, descripcion, id_prioridad } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(
      `INSERT INTO Casos (id_empleado_solicita, id_tipo_incidencia, titulo, descripcion, id_prioridad)
       VALUES (:id_empleado_solicita, :id_tipo_incidencia, :titulo, :descripcion, :id_prioridad)`,
      { id_empleado_solicita, id_tipo_incidencia, titulo, descripcion, id_prioridad },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Caso creado correctamente" });
  } catch (err) {
    console.error("❌ Error en crearCaso:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 Actualizar caso
export const updateCaso = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { id_empleado_solicita, id_tipo_incidencia, titulo, descripcion, id_prioridad } = req.body;

    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `UPDATE Casos 
       SET id_empleado_solicita = :id_empleado_solicita,
           id_tipo_incidencia = :id_tipo_incidencia,
           titulo = :titulo,
           descripcion = :descripcion,
           id_prioridad = :id_prioridad
       WHERE id_caso = :id`,
      { id_empleado_solicita, id_tipo_incidencia, titulo, descripcion, id_prioridad, id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }

    res.json({ message: "Caso actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error en updateCaso:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 Eliminar caso
export const deleteCaso = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `DELETE FROM Casos WHERE id_caso = :id`,
      { id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }

    res.json({ message: "Caso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteCaso:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};
