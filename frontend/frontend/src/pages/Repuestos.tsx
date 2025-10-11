import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: number;
}

export default function Repuestos() {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    nombre: "",
    descripcion: "",
    stock: "",
    precio_unitario: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [repuestoEditar, setRepuestoEditar] = useState<Repuesto | null>(null);
  const [datosEditados, setDatosEditados] = useState({
    nombre: "",
    descripcion: "",
    stock: "",
    precio_unitario: "",
  });

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const fetchRepuestos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/repuestos");
      const data = await res.json();
      setRepuestos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setRepuestos([]);
    }
  };

  // --- Validación al escribir ---
  const handleChange = (campo: string, value: string, editar = false) => {
    let valido = value;

    // Stock solo números positivos
    if (campo === "stock") {
      valido = value.replace(/[^0-9]/g, "");
    }
    // Precio solo positivos y decimales
    if (campo === "precio_unitario") {
      valido = value.replace(/[^0-9.]/g, "");
      const partes = valido.split(".");
      if (partes.length > 2) valido = partes[0] + "." + partes[1];
    }

    if (editar) {
      setDatosEditados({ ...datosEditados, [campo]: valido });
    } else {
      setNuevoRepuesto({ ...nuevoRepuesto, [campo]: valido });
    }
  };

  const camposValidos = (datos: typeof nuevoRepuesto) => {
    return (
      datos.nombre.trim().length > 0 &&
      datos.descripcion.trim().length > 0 &&
      datos.stock.trim().length > 0 &&
      datos.precio_unitario.trim().length > 0
    );
  };

  const handleCrearRepuesto = async () => {
    const { nombre, descripcion, stock, precio_unitario } = nuevoRepuesto;

    await fetch("http://localhost:4000/api/repuestos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        stock: Number(stock),
        precio_unitario: Number(precio_unitario),
      }),
    });

    setNuevoRepuesto({ nombre: "", descripcion: "", stock: "", precio_unitario: "" });
    setShowForm(false);
    fetchRepuestos();
    MySwal.fire({ icon: "success", title: "Repuesto creado", confirmButtonColor: "#198754" });
  };

  const abrirModalEditar = (repuesto: Repuesto) => {
    setRepuestoEditar(repuesto);
    setDatosEditados({
      nombre: repuesto.nombre,
      descripcion: repuesto.descripcion,
      stock: repuesto.stock.toString(),
      precio_unitario: repuesto.precio_unitario.toString(),
    });
  };

  const handleEditarRepuesto = async () => {
    if (!repuestoEditar) return;
    const { nombre, descripcion, stock, precio_unitario } = datosEditados;

    await fetch(`http://localhost:4000/api/repuestos/${repuestoEditar.id_repuesto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        stock: Number(stock),
        precio_unitario: Number(precio_unitario),
      }),
    });

    setRepuestoEditar(null);
    fetchRepuestos();
    MySwal.fire({ icon: "success", title: "Repuesto actualizado", confirmButtonColor: "#198754" });
  };

  const eliminarRepuesto = async (repuesto: Repuesto) => {
    const result = await MySwal.fire({
      title: `¿Eliminar ${repuesto.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
    });
    if (result.isConfirmed) {
      await fetch(`http://localhost:4000/api/repuestos/${repuesto.id_repuesto}`, {
        method: "DELETE",
      });
      fetchRepuestos();
      MySwal.fire({ icon: "success", title: "Repuesto eliminado", confirmButtonColor: "#198754" });
    }
  };

  return (
    <div style={{ padding: "1rem", minHeight: "600px", backgroundColor: "#C0C0C0" }}>
      <h2 style={{ textAlign: "center", color: "#0d6efd", marginBottom: "1.5rem" }}>Repuestos Registrados</h2>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        style={btnGreen}
      >
        ➕ Agregar Repuesto
      </motion.button>

      {/* FORMULARIO CREAR */}
      {showForm && (
        <div style={modalOverlay}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={modalBox}>
            <h3 style={{ color: "#198754", textAlign: "center", marginBottom: "1rem" }}>Nuevo Repuesto</h3>

            {["nombre", "descripcion", "stock", "precio_unitario"].map((campo) => (
              <div key={campo} style={{ marginBottom: "0.8rem" }}>
                <label style={labelStyle}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</label>
                <input
                  placeholder={campo}
                  value={nuevoRepuesto[campo as keyof typeof nuevoRepuesto]}
                  onChange={(e) => handleChange(campo, e.target.value)}
                  style={inputStyle}
                  type={campo === "stock" || campo === "precio_unitario" ? "number" : "text"}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={() => setShowForm(false)} style={btnGray}>Cancelar</button>
              <button
                onClick={handleCrearRepuesto}
                style={{ ...btnGreen, opacity: camposValidos(nuevoRepuesto) ? 1 : 0.5, cursor: camposValidos(nuevoRepuesto) ? "pointer" : "not-allowed" }}
                disabled={!camposValidos(nuevoRepuesto)}
              >
                Crear
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* FORMULARIO EDITAR */}
      {repuestoEditar && (
        <div style={modalOverlay}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={modalBox}>
            <h3 style={{ color: "#198754", textAlign: "center", marginBottom: "1rem" }}>Editar Repuesto</h3>

            {["nombre", "descripcion", "stock", "precio_unitario"].map((campo) => (
              <div key={campo} style={{ marginBottom: "0.8rem" }}>
                <label style={labelStyle}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</label>
                <input
                  placeholder={campo}
                  value={datosEditados[campo as keyof typeof datosEditados]}
                  onChange={(e) => handleChange(campo, e.target.value, true)}
                  style={inputStyle}
                  type={campo === "stock" || campo === "precio_unitario" ? "number" : "text"}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={() => setRepuestoEditar(null)} style={btnGray}>Cancelar</button>
              <button
                onClick={handleEditarRepuesto}
                style={{ ...btnGreen, opacity: camposValidos(datosEditados) ? 1 : 0.5, cursor: camposValidos(datosEditados) ? "pointer" : "not-allowed" }}
                disabled={!camposValidos(datosEditados)}
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* TABLA */}
      <div style={{ overflowX: "auto", backgroundColor: "#fff", padding: "1rem", borderRadius: "16px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", marginTop: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#d9ebe3" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Precio Unitario</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {repuestos.map(r => (
              <tr key={r.id_repuesto}>
                <td style={tdStyle}>{r.id_repuesto}</td>
                <td style={tdStyle}>{r.nombre}</td>
                <td style={tdStyle}>{r.descripcion}</td>
                <td style={tdStyle}>{r.stock}</td>
                <td style={tdStyle}>Q{Number(r.precio_unitario).toFixed(2)}</td>
                <td style={{ padding: "10px 12px", display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => abrirModalEditar(r)} style={btnBlue}>Editar</button>
                  <button onClick={() => eliminarRepuesto(r)} style={btnRed}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- Estilos Reutilizables --- */
const btnGray: React.CSSProperties = { backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnGreen: React.CSSProperties = { backgroundColor: "#198754", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none" };
const btnBlue: React.CSSProperties = { backgroundColor: "#0d6efd", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnRed: React.CSSProperties = { backgroundColor: "#dc3545", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const thStyle: React.CSSProperties = { padding: "12px", textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "10px 12px" };
const inputStyle: React.CSSProperties = { padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #198754", width: "100%", outline: "none", backgroundColor: "#3b3b3b", color: "#fff", fontSize: "1rem" };
const labelStyle: React.CSSProperties = { color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" };
const modalOverlay: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalBox: React.CSSProperties = { background: "#2d2d2d", padding: "2rem", borderRadius: "12px", boxShadow: "0px 4px 15px rgba(0,0,0,0.3)", width: "500px" };
