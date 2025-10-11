import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

interface Incidencia {
  id_incidencia: number;
  nombre: string;
  id_tipo: number | null;
}

export default function DashboardIncidencias() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [incidenciaEditar, setIncidenciaEditar] = useState<Incidencia | null>(null);
  const [datosEditados, setDatosEditados] = useState({ nombre: "", id_tipo: "" });
  const [nuevaIncidencia, setNuevaIncidencia] = useState({ nombre: "", id_tipo: "" });

  const fetchIncidencias = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/incidencias");
      const data = await res.json();
      setIncidencias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setIncidencias([]);
    }
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  const handleCrearIncidencia = async () => {
    if (!nuevaIncidencia.nombre.trim()) {
      MySwal.fire({ icon: "warning", title: "Ingrese el nombre de la incidencia", confirmButtonColor: "#dc3545" });
      return;
    }
    await fetch("http://localhost:4000/api/incidencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nuevaIncidencia.nombre,
        id_tipo: nuevaIncidencia.id_tipo || null,
      }),
    });
    setNuevaIncidencia({ nombre: "", id_tipo: "" });
    setShowForm(false);
    fetchIncidencias();
    MySwal.fire({ icon: "success", title: "Incidencia creada", confirmButtonColor: "#198754" });
  };

  const abrirModalEditar = (incidencia: Incidencia) => {
    setIncidenciaEditar(incidencia);
    setDatosEditados({ nombre: incidencia.nombre, id_tipo: incidencia.id_tipo?.toString() || "" });
  };

  const handleEditarIncidencia = async () => {
    if (!incidenciaEditar) return;
    await fetch(`http://localhost:4000/api/incidencias/${incidenciaEditar.id_incidencia}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: datosEditados.nombre,
        id_tipo: datosEditados.id_tipo || null,
      }),
    });
    setIncidenciaEditar(null);
    fetchIncidencias();
    MySwal.fire({ icon: "success", title: "Incidencia actualizada", confirmButtonColor: "#198754" });
  };

  const eliminarIncidencia = async (id: number) => {
    const result = await MySwal.fire({
      title: "¿Eliminar incidencia?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
    });
    if (result.isConfirmed) {
      await fetch(`http://localhost:4000/api/incidencias/${id}`, { method: "DELETE" });
      fetchIncidencias();
      MySwal.fire({ icon: "success", title: "Incidencia eliminada", confirmButtonColor: "#198754" });
    }
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "#C0C0C0", minHeight: "600px" }}>
      <h2 style={{ color: "#0d6efd", textAlign: "center", marginBottom: "1.5rem" }}>Incidencias</h2>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#198754",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "0.7rem 1.5rem",
          cursor: "pointer",
          marginBottom: "1rem",
          boxShadow: "0px 4px 10px #CCCCCC",
          fontSize: "1rem",
        }}
      >
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>➕</span>
        <span>Nuevo</span>
      </motion.button>

      {/* Modal Crear */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={modalStyle}>
            <h3 style={{ marginBottom: "1rem", color: "#198754", textAlign: "center" }}>Nueva Incidencia</h3>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={labelStyle}>Nombre:</label>
              <input
                placeholder="Nombre"
                value={nuevaIncidencia.nombre}
                onChange={e => setNuevaIncidencia({ ...nuevaIncidencia, nombre: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={labelStyle}>ID Tipo (opcional):</label>
              <input
                placeholder="ID Tipo"
                value={nuevaIncidencia.id_tipo}
                onChange={e => setNuevaIncidencia({ ...nuevaIncidencia, id_tipo: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={() => setShowForm(false)} style={btnGray}>Cancelar</button>
              <button onClick={handleCrearIncidencia} style={btnGreen}>Crear</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Editar */}
      {incidenciaEditar && (
        <div style={modalOverlayStyle}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={modalStyle}>
            <h3 style={{ marginBottom: "1rem", color: "#198754", textAlign: "center" }}>Editar Incidencia</h3>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={labelStyle}>Nombre:</label>
              <input
                value={datosEditados.nombre}
                onChange={e => setDatosEditados({ ...datosEditados, nombre: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={labelStyle}>ID Tipo (opcional):</label>
              <input
                value={datosEditados.id_tipo}
                onChange={e => setDatosEditados({ ...datosEditados, id_tipo: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={() => setIncidenciaEditar(null)} style={btnGray}>Cancelar</button>
              <button onClick={handleEditarIncidencia} style={btnGreen}>Guardar</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabla */}
      <div style={{ overflowX: "auto", backgroundColor: "#fff", padding: "1rem", borderRadius: "16px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#d9ebe3" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map(i => (
              <tr key={i.id_incidencia} style={{ transition: "background 0.3s" }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = "#eef5f4"}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td style={tdStyle}>{i.id_incidencia}</td>
                <td style={tdStyle}>{i.nombre}</td>
                <td style={tdStyle}>{i.id_tipo || "-"}</td>
                <td style={{ padding: "10px 12px", display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => abrirModalEditar(i)} style={btnBlue}>Editar</button>
                  <button onClick={() => eliminarIncidencia(i.id_incidencia)} style={btnRed}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- Estilos reutilizables --- */
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  background: "#2d2d2d",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
  width: "500px"
};

const labelStyle: React.CSSProperties = { color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" };
const inputStyle: React.CSSProperties = { padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #198754", width: "100%", outline: "none", backgroundColor: "#3b3b3b", color: "#fff", fontSize: "1rem" };

const thStyle: React.CSSProperties = { padding: "12px", textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "10px 12px" };
const btnGray: React.CSSProperties = { backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnGreen: React.CSSProperties = { backgroundColor: "#198754", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnBlue: React.CSSProperties = { backgroundColor: "#0d6efd", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnRed: React.CSSProperties = { backgroundColor: "#dc3545", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer" };
