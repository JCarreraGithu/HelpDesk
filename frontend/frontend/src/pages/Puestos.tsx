import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function Puestos() {
  const [puestos, setPuestos] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetchPuestos();
  }, []);

  const fetchPuestos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/puestos");
      const data = await res.json();
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener puestos:", error);
    }
  };

  // 🔤 Solo letras (sin números ni signos)
  const handleChange = (e) => {
    const { name, value } = e.target;
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/;
    if (value === "" || soloLetras.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await fetch(`http://localhost:4000/api/puestos/${editando.id_puesto}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire({
          icon: "success",
          title: "Puesto actualizado correctamente",
          confirmButtonColor: "#198754",
        });
      } else {
        await fetch("http://localhost:4000/api/puestos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire({
          icon: "success",
          title: "Puesto creado correctamente",
          confirmButtonColor: "#198754",
        });
      }

      setFormData({ nombre: "", descripcion: "" });
      setEditando(null);
      setMostrarModal(false);
      fetchPuestos();
    } catch (error) {
      console.error("Error al guardar puesto:", error);
    }
  };

  const handleEditar = (puesto) => {
    setEditando(puesto);
    setFormData({ nombre: puesto.nombre, descripcion: puesto.descripcion });
    setMostrarModal(true);
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar este puesto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      await fetch(`http://localhost:4000/api/puestos/${id}`, {
        method: "DELETE",
      });
      Swal.fire({
        icon: "success",
        title: "Puesto eliminado",
        confirmButtonColor: "#198754",
      });
      fetchPuestos();
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>📋 Gestión de Puestos</h2>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => {
          setEditando(null);
          setFormData({ nombre: "", descripcion: "" });
          setMostrarModal(true);
        }}
        style={{
          backgroundColor: "#198754",
          color: "white",
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        ➕ Agregar Puesto
      </button>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#4a7c59", color: "white" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Descripción</th>
            <th style={{ padding: "10px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {puestos.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No hay puestos registrados
              </td>
            </tr>
          ) : (
            puestos.map((p) => (
              <motion.tr
                key={p.id_puesto}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                <td style={{ padding: "10px" }}>{p.id_puesto}</td>
                <td style={{ padding: "10px" }}>{p.nombre}</td>
                <td style={{ padding: "10px" }}>{p.descripcion}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEditar(p)}
                    style={{
                      marginRight: "0.5rem",
                      backgroundColor: "#ffc107",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.6rem",
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id_puesto)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.6rem",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔲 Modal flotante */}
      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              width: "400px",
            }}
          >
            <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>
              {editando ? "✏️ Editar Puesto" : "➕ Nuevo Puesto"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del puesto"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  title="Ingrese el nombre del puesto (solo letras)"
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  title="Ingrese una breve descripción (solo letras)"
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#198754",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
