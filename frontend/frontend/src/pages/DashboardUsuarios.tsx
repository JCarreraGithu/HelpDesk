import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import empleadoImg from "../assets/empleado.png";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

interface Usuario {
  id_usuario: number;
  username: string;
  activo: string;
  Empleado: { nombre: string; apellido: string; rol: string };
}

export default function DashboardUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ id_empleado: "", username: "", password: "" });
  const [showForm, setShowForm] = useState(false);

  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [datosEditados, setDatosEditados] = useState({ username: "", activo: "" });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [erroresPassword, setErroresPassword] = useState<string[]>([]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/usuarios");
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

const [idBuscar, setIdBuscar] = useState("");
const [usuarioEncontrado, setUsuarioEncontrado] = useState<Usuario | null>(null);

const buscarPorId = async () => {
  if (!idBuscar.trim()) {
    MySwal.fire({ icon: "warning", title: "Ingrese un ID", confirmButtonColor: "#dc3545" });
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/api/usuarios/${idBuscar}`);
    if (!res.ok) {
      MySwal.fire({ icon: "error", title: "Usuario no encontrado", confirmButtonColor: "#dc3545" });
      setUsuarioEncontrado(null);
      return;
    }
    const data = await res.json();
    setUsuarioEncontrado(data);
    MySwal.fire({
      icon: "success",
      title: "Usuario encontrado",
      text: `Username: ${data.username}`,
      confirmButtonColor: "#198754"
    });
  } catch (error) {
    console.error(error);
    MySwal.fire({ icon: "error", title: "Error al buscar", confirmButtonColor: "#dc3545" });
  }
};


  const handleCrearUsuario = async () => {
    if (!nuevoUsuario.id_empleado || !nuevoUsuario.username || !nuevoUsuario.password) {
      MySwal.fire({ icon: "warning", title: "Complete todos los campos", confirmButtonColor: "#dc3545" });
      return;
    }
    if (erroresPassword.length > 0) {
      MySwal.fire({ icon: "error", title: "Contraseña inválida", text: "Revise los requisitos", confirmButtonColor: "#dc3545" });
      return;
    }
    await fetch("http://localhost:4000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });
    setNuevoUsuario({ id_empleado: "", username: "", password: "" });
    setShowForm(false);
    setMostrarPassword(false);
    fetchUsuarios();
    MySwal.fire({ icon: "success", title: "Usuario creado", confirmButtonColor: "#198754" });
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    setDatosEditados({ username: usuario.username, activo: usuario.activo });
  };

  const handleEditarUsuario = async () => {
    if (!usuarioEditar) return;
    await fetch(`http://localhost:4000/api/usuarios/${usuarioEditar.id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEditados),
    });
    setUsuarioEditar(null);
    fetchUsuarios();
    MySwal.fire({ icon: "success", title: "Usuario actualizado", confirmButtonColor: "#198754" });
  };

  const darBajaUsuario = async (usuario: Usuario) => {
    const result = await MySwal.fire({
      title: `¿Eliminar a ${usuario.username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
    });
    if (result.isConfirmed) {
      await fetch(`http://localhost:4000/api/usuarios/${usuario.id_usuario}`, { method: "DELETE" });
      fetchUsuarios();
      MySwal.fire({ icon: "success", title: "Usuario eliminado", confirmButtonColor: "#198754" });
    }
  };

  const mostrarDetalleUsuario = (usuario: Usuario) => {
    MySwal.fire({
      title: `${usuario.Empleado.nombre} ${usuario.Empleado.apellido}`,
      html: `
        <div style="display:flex;gap:20px;align-items:center;">
          <div style="text-align:center;">
            <img src="${empleadoImg}" style="width:120px;border-radius:50%;border:3px solid #0d6efd;" />
          </div>
          <div style="flex:1;font-size:15px;">
            <p>🛠 Rol: ${usuario.Empleado.rol}</p>
            <p>Usuario: ${usuario.username}</p>
            <p>Activo: ${usuario.activo === "S" ? "Sí" : "No"}</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: "500px",
    });
  };

  const validarPassword = (pass: string) => {
    const errores: string[] = [];
    if (!/[A-Z]/.test(pass)) errores.push("Debe contener al menos una mayúscula");
    if (!/[0-9]/.test(pass)) errores.push("Debe contener al menos un número");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pass)) errores.push("Debe contener al menos un carácter especial");
    if (pass.length < 8) errores.push("Debe tener al menos 8 caracteres");
    if (pass.length > 20) errores.push("No puede tener más de 20 caracteres");
    setErroresPassword(errores);
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "#C0C0C0", minHeight: "600px" }}>
      <h2 style={{ color: "#0d6efd", textAlign: "center", marginBottom: "1.5rem" }}>Usuarios Registrados</h2>

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
        <span>Dar click para agregar Usuario</span>
      </motion.button>

      {showForm && (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  }}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        background: "#2d2d2d",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
        width: "500px"
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#198754", textAlign: "center" }}>Nuevo Usuario</h3>

      <div style={{ marginBottom: "0.8rem" }}>
        <label style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" }}>Escriba el código de empleado:</label>
        <input
          placeholder="Código de empleado"
          value={nuevoUsuario.id_empleado}
          onChange={e => setNuevoUsuario({ ...nuevoUsuario, id_empleado: e.target.value })}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #198754",
            width: "100%",
            outline: "none",
            backgroundColor: "#3b3b3b",
            color: "#fff",
            fontSize: "1rem",
            "::placeholder": { color: "#fff" }
          }}
        />
      </div>

      <div style={{ marginBottom: "0.8rem" }}>
        <label style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" }}>Escriba el username:</label>
        <input
          placeholder="Username"
          value={nuevoUsuario.username}
          onChange={e => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #0dcaf0",
            width: "100%",
            outline: "none",
            backgroundColor: "#444444",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
      </div>

      <div style={{ marginBottom: "0.8rem", position: "relative" }}>
        <label style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" }}>Escriba la contraseña:</label>
        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={(e) => {
            const pass = e.target.value;
            setNuevoUsuario({ ...nuevoUsuario, password: pass });
            validarPassword(pass);
          }}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ffc107",
            width: "100%",
            outline: "none",
            backgroundColor: "#333333",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
        <span
          onClick={() => setMostrarPassword(!mostrarPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#fff",
            fontSize: "0.9rem"
          }}
        >
          {mostrarPassword ? "Ocultar" : "Mostrar"}
        </span>
      </div>

      {erroresPassword.length > 0 && (
        <ul style={{ color: "#ff4d4f", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          {erroresPassword.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
        <button onClick={() => setShowForm(false)} style={btnGray}>Cancelar</button>
        <button onClick={handleCrearUsuario} style={btnGreen}>Crear</button>
      </div>
    </motion.div>
  </div>
)}

{usuarioEditar && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        background: "#2d2d2d",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
        width: "500px",
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#198754", textAlign: "center" }}>Editar Usuario</h3>

      {/* Username */}
      <div style={{ marginBottom: "0.8rem" }}>
        <label style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" }}>
          Escriba el username:
        </label>
        <input
          placeholder="Username"
          value={datosEditados.username}
          onChange={e => setDatosEditados({ ...datosEditados, username: e.target.value })}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #0dcaf0",
            width: "100%",
            outline: "none",
            backgroundColor: "#444444",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Activo */}
      <div style={{ marginBottom: "0.8rem" }}>
        <label style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem", display: "block" }}>
          Activo:
        </label>
        <select
          value={datosEditados.activo}
          onChange={e => setDatosEditados({ ...datosEditados, activo: e.target.value })}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #198754",
            width: "100%",
            outline: "none",
            backgroundColor: "#3b3b3b",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          <option value="S">Sí</option>
          <option value="N">No</option>
        </select>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
        <button onClick={() => setUsuarioEditar(null)} style={btnGray}>Cancelar</button>
        <button onClick={handleEditarUsuario} style={btnGreen}>Guardar</button>
      </div>
    </motion.div>
  </div>
)}
{/* 🔍 Búsqueda por ID */}
<div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
  <input
    type="number"
    placeholder="Buscar usuario por ID..."
    value={idBuscar}
    onChange={(e) => setIdBuscar(e.target.value)}
    style={{
      padding: "0.6rem 1rem",
      borderRadius: "8px",
      border: "1px solid #0d6efd",
      width: "200px",
      outline: "none",
      fontSize: "1rem"
    }}
  />
  <button onClick={buscarPorId} style={btnBlue}>
    Buscar
  </button>
 <button
  onClick={() => {
    setUsuarioEncontrado(null); // 👈 limpia la búsqueda
    fetchUsuarios(); // vuelve a cargar todos los usuarios
  }}
  style={btnGray}
>
  Ver todos
</button>
</div>

      {/* Tabla de usuarios */}
      <div style={{ overflowX: "auto", backgroundColor: "#fff", padding: "1rem", borderRadius: "16px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#d9ebe3" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Empleado</th>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Activo</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
           {(usuarioEncontrado ? [usuarioEncontrado] : usuarios).map(u => (

              <tr key={u.id_usuario} onClick={() => mostrarDetalleUsuario(u)} style={{ cursor: "pointer", transition: "background 0.3s" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#eef5f4")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td style={tdStyle}>{u.id_usuario}</td>
                <td style={tdStyle}>{u.Empleado.nombre} {u.Empleado.apellido} ({u.Empleado.rol})</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={{ ...tdStyle, fontWeight: "bold", color: u.activo === "S" ? "#198754" : "#dc3545" }}>
                  {u.activo === "S" ? "Activo" : "Inactivo"}
                </td>
                <td style={{ padding: "10px 12px", display: "flex", gap: "0.5rem" }}>
                  <button onClick={(e) => { e.stopPropagation(); abrirModalEditar(u); }} style={btnBlue}>Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); darBajaUsuario(u); }} style={btnRed}>Eliminar</button>
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
const btnGray: React.CSSProperties = { backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnGreen: React.CSSProperties = { backgroundColor: "#198754", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnBlue: React.CSSProperties = { backgroundColor: "#0d6efd", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnRed: React.CSSProperties = { backgroundColor: "#dc3545", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const thStyle: React.CSSProperties = { padding: "12px", textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "10px 12px" };
const inputStyle: React.CSSProperties = {
  padding: "0.6rem 1rem",
  marginBottom: "0.5rem",
  borderRadius: "8px",
  border: "1px solid #c7ded3",
  width: "100%",
  outline: "none",
  backgroundColor: "#808080",
  color: "#fff",
  fontSize: "1rem",
};
