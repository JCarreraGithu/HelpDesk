import React, { useState } from "react";
import empleadoImg from "../assets/empleado.png";

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

  const [modalError, setModalError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "telefono" && !/^\d*$/.test(value)) {
      setModalError(true);
      return; // no actualiza el valor si hay letra
    }

    setEmpleado({ ...empleado, [name]: value });
  };

  const handleSubmit = () => {
    if (!empleado.telefono.match(/^\d*$/)) {
      setModalError(true);
      return;
    }

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
    <>
      {/* Modal de error */}
      {modalError && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
          >
            <h3 style={{ color: "#dc3545", marginBottom: "1rem" }}>Error</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Por favor, escribe solo caracteres numéricos en el campo Teléfono.
            </p>
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#dc3545",
                color: "white",
                cursor: "pointer"
              }}
              onClick={() => setModalError(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
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
            />
          </div>

          {/* Rol */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>🔑 Rol:</span>
            <select name="rol" value={empleado.rol} onChange={handleChange} style={selectStyle}>
              <option value="" disabled style={{ color: "#ccc" }}>Seleccione un rol</option>
              <option value="USUARIO">USUARIO</option>
              <option value="AGENTE">AGENTE</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={onClose}
              style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
            >
              Volver
            </button>

            <button
              onClick={handleSubmit}
              style={{ ...buttonStyle, backgroundColor: "#198754", color: "white" }}
            >
              Guardar
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={empleadoImg}
            alt="Empleado"
            style={{ width: "180px", height: "180px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}
          />
        </div>
      </div>
    </>
  );
};

export default FormularioEmpleado;
