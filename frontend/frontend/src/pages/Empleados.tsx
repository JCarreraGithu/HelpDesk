import React, { useState, useEffect } from "react";
import FormularioEmpleado from "./FormularioEmpleado"; // ✅ sigue importado

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // 🔹 Traer empleados desde API
  const fetchEmpleados = async () => {
    const res = await fetch("http://localhost:4000/api/empleados");
    const data = await res.json();
    setEmpleados(data);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // 🔹 Buscar por nombre
  const buscarEmpleado = async () => {
    if (!busqueda.trim()) {
      fetchEmpleados();
      return;
    }
    const res = await fetch(`http://localhost:4000/api/empleados/buscar/nombre?nombre=${busqueda}`);
    const data = await res.json();
    setEmpleados(data);
  };

  return (
    <div>
      {/* 🔍 Barra de búsqueda */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            width: "250px",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "0.9rem",
            outline: "none",
            transition: "all 0.2s ease-in-out"
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #0d6efd")}
          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
        />
        <button 
          onClick={buscarEmpleado} 
          style={{ 
            backgroundColor: "#0d6efd", 
            color: "white", 
            padding: "0.45rem 1rem", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          Buscar
        </button>
        <button 
          onClick={fetchEmpleados} 
          style={{ 
            backgroundColor: "#6c757d", 
            color: "white", 
            padding: "0.45rem 1rem", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          Ver Todos
        </button>
      </div>

      {/* 👇 Botón para abrir el modal */}
      <button
        onClick={() => setMostrarModal(true)}
        style={{
          backgroundColor: "#198754",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "8px",
          marginBottom: "1rem",
          cursor: "pointer"
        }}
      >
        + Agregar Empleado
      </button>

   {mostrarModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // fondo semi-transparente
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
        minWidth: "600px",  // Aumentamos el mínimo
        maxWidth: "900px",  // Aumentamos el máximo
        width: "90%",
      }}
    >
      <FormularioEmpleado
        onClose={() => setMostrarModal(false)}
        onSave={fetchEmpleados}
      />
    </div>
  </div>
)}



      {/* Lista de empleados */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f1f1" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Puesto</th>
            <th>Rol</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id_empleado}>
              <td>{emp.id_empleado}</td>
              <td>{emp.nombre}</td>
              <td>{emp.apellido}</td>
              <td>{emp.correo}</td>
              <td>{emp.telefono}</td>
              <td>{emp.Puesto?.nombre}</td>
              <td>{emp.rol}</td>
              <td>{emp.activo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Empleados;
