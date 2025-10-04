import React, { useState } from "react";
import empleadoImg from "../assets/empleado.png"; // asegúrate de la ruta

interface FormularioEmpleadoProps {
  onClose: () => void;
  onSave: () => void;
}

const FormularioEmpleado: React.FC<FormularioEmpleadoProps> = ({ onClose, onSave }) => {
  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    id_departamento: "",
    id_puesto: "",
    rol: "",
    activo: "S"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmpleado({ ...empleado, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetch("http://localhost:4000/api/empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleado)
    })
      .then(res => res.json())
      .then(() => {
        onSave();
        onClose();
      })
      .catch(err => console.error(err));
  };

  const inputStyle = {
    padding: "0.45rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #555",
    fontSize: "0.9rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "#6c757d",
    color: "white",
    outline: "none",
    width: "100%"
  };

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s ease-in-out"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "2rem",
        padding: "1.5rem",
        background: "#2d2d2d",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        alignItems: "flex-start"
      }}
    >
      {/* 📝 Formulario */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        <h3 style={{ textAlign: "center", color: "#198754" }}>Agregar Empleado</h3>

        {/* Nombre */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>👤 Nombre:</span>
          <input
            name="nombre"
            placeholder="Escriba el nombre"
            value={empleado.nombre}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = "2px solid #198754")}
            onBlur={(e) => (e.target.style.border = "1px solid #555")}
          />
        </div>

        {/* Apellido */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>📝 Apellido:</span>
          <input
            name="apellido"
            placeholder="Escriba el apellido"
            value={empleado.apellido}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = "2px solid #198754")}
            onBlur={(e) => (e.target.style.border = "1px solid #555")}
          />
        </div>

        {/* Correo */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>📧 Correo:</span>
          <input
            name="correo"
            placeholder="Correo electrónico"
            value={empleado.correo}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = "2px solid #198754")}
            onBlur={(e) => (e.target.style.border = "1px solid #555")}
          />
        </div>

        {/* Teléfono */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>📞 Teléfono:</span>
          <input
            name="telefono"
            placeholder="Número de teléfono"
            value={empleado.telefono}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = "2px solid #198754")}
            onBlur={(e) => (e.target.style.border = "1px solid #555")}
          />
        </div>

        {/* Rol */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>🔑 Rol:</span>
          <select
            name="rol"
            value={empleado.rol}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="" disabled style={{ color: "#ccc" }}>Seleccione un rol</option>
            <option value="USUARIO">USUARIO</option>
            <option value="AGENTE">AGENTE</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Departamento */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>🏢 Departamento:</span>
          <select
            name="id_departamento"
            value={empleado.id_departamento}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="" disabled style={{ color: "#ccc" }}>Seleccione un departamento</option>
            <option value={1}>Soporte Técnico</option>
            <option value={2}>Sistemas</option>
            <option value={23}>Recursos Humanos</option>
            <option value={24}>Finanzas</option>
            <option value={25}>Ventas</option>
            <option value={26}>Marketing</option>
            <option value={27}>Logística</option>
            <option value={28}>Compras</option>
            <option value={29}>Desarrollo</option>
            <option value={30}>Legal</option>
          </select>
        </div>

        {/* Puesto */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>💼 Puesto:</span>
          <select
            name="id_puesto"
            value={empleado.id_puesto}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="" disabled style={{ color: "#ccc" }}>Seleccione un puesto</option>
            <option value={1}>Técnico de Soporte</option>
            <option value={2}>Analista de Sistemas</option>
            <option value={3}>Supervisor</option>
            <option value={4}>Administrador</option>
            <option value={5}>Desarrollador</option>
            <option value={6}>Montacarguista</option>
          </select>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={onClose}
            style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a6268")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c757d")}
          >
            Volver
          </button>

          <button
            onClick={handleSubmit}
            style={{ ...buttonStyle, backgroundColor: "#198754", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#157347")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#198754")}
          >
            Guardar
          </button>
        </div>
      </div>

      {/* 📸 Imagen al lado derecho */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={empleadoImg}
          alt="Empleado"
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        />
      </div>
    </div>
  );
};

export default FormularioEmpleado;
