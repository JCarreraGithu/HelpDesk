import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/departamentos");
      const data = await res.json();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  // Solo letras permitidas
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
        await fetch(`http://localhost:4000/api/departamentos/${editando.id_departamento}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire({
          icon: "success",
          title: "Departamento actualizado correctamente",
          confirmButtonColor: "#198754",
        });
      } else {
        await fetch("http://localhost:4000/api/departamentos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire({
          icon: "success",
          title: "Departamento creado correctamente",
          confirmButtonColor: "#198754",
        });
      }

      setFormData({ nombre: "", descripcion: "" });
      setEditando(null);
      setMostrarModal(false);
      fetchDepartamentos();
    } catch (error) {
      console.error("Error al guardar departamento:", error);
    }
  };

  const handleEditar = (departamento) => {
    setEditando(departamento);
    setFormData({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion,
    });
    setMostrarModal(true);
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar este departamento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      await fetch(`http://localhost:4000/api/departamentos/${id}`, {
        method: "DELETE",
      });
      Swal.fire({
        icon: "success",
        title: "Departamento eliminado",
        confirmButtonColor: "#198754",
      });
      fetchDepartamentos();
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>🏢 Gestión de Departamentos</h2>

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
        ➕ Agregar Departamento
      </button>

      {/* Tabla de Departamentos */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#4a7c59", color: "white" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Nombre</th>
            <th style={{ padding: "10px" }}>Descripción</th>
            <th style={{ padding: "10px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No hay departamentos registrados
              </td>
            </tr>
          ) : (
            departamentos.map((d) => (
              <motion.tr
                key={d.id_departamento}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                <td style={{ padding: "10px" }}>{d.id_departamento}</td>
                <td style={{ padding: "10px" }}>{d.nombre}</td>
                <td style={{ padding: "10px" }}>{d.descripcion}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEditar(d)}
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
                    onClick={() => handleEliminar(d.id_departamento)}
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

      {/* Modal flotante */}
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
              {editando ? "✏️ Editar Departamento" : "➕ Nuevo Departamento"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del departamento"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
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
