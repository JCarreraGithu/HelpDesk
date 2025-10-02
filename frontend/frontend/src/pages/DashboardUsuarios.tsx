import { useEffect, useState } from "react";
import empleadoImg from "../assets/empleado.png";

interface Usuario {
  id_usuario: number;
  username: string;
  activo: string;
  Empleado: { nombre: string; apellido: string; rol: string };
}

export default function DashboardUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ id_empleado: "", username: "", password: "" });

  // Estados para confirmar eliminación y edición
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [datosEditados, setDatosEditados] = useState({ username: "", activo: "" });

  const cargarUsuarios = async () => {
    const res = await fetch("http://localhost:4000/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleCrear = async () => {
    if (!nuevoUsuario.id_empleado || !nuevoUsuario.username || !nuevoUsuario.password) {
      alert("Por favor, completa todos los campos");
      return;
    }
    await fetch("http://localhost:4000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });
    setNuevoUsuario({ id_empleado: "", username: "", password: "" });
    setShowForm(false);
    cargarUsuarios();
  };

  const confirmarEliminar = async () => {
    if (!usuarioAEliminar) return;
    await fetch(`http://localhost:4000/api/usuarios/${usuarioAEliminar.id_usuario}`, { method: "DELETE" });
    setUsuarioAEliminar(null);
    cargarUsuarios();
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    setDatosEditados({ username: usuario.username, activo: usuario.activo });
  };

  const handleEditar = async () => {
    if (!usuarioEditar) return;
    await fetch(`http://localhost:4000/api/usuarios/${usuarioEditar.id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEditados),
    });
    setUsuarioEditar(null);
    cargarUsuarios();
  };

  return (
    <div style={{ padding: "1rem", minHeight: "100vh", backgroundColor: "#C0C0C0" }}>
      <h2 style={{ color: "#198754", borderBottom: "2px solid #198754", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
        Usuarios
      </h2>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          backgroundColor: "#198754",
          color: "#fff",
          padding: "0.8rem 1.5rem",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          marginBottom: "1.5rem",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#157347"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#198754"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        Agregar Usuario
      </button>

      {/* Modal Nuevo Usuario */}
      {showForm && (
        <div style={overlay}>
          <div style={modalContainer}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "1rem", color: "#198754" }}>Nuevo Usuario</h3>
              <div style={inputGroup}>
                <label>ID Empleado</label>
                <input placeholder="ID empleado" value={nuevoUsuario.id_empleado} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, id_empleado: e.target.value })} style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label>Username</label>
                <input placeholder="Username" value={nuevoUsuario.username} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })} style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label>Password</label>
                <input type="password" placeholder="Password" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button onClick={() => setShowForm(false)} style={btnGray}>Volver</button>
                <button onClick={handleCrear} style={btnGreen}>Crear</button>
              </div>
            </div>
            <div style={{ marginLeft: "2rem" }}>
              <img src={empleadoImg} alt="Empleado" style={{ width: "200px", borderRadius: "12px" }} />
            </div>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div style={tablaContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "12px", overflow: "hidden" }}>
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
            {usuarios.map((u) => (
              <tr key={u.id_usuario} style={{ transition: "background 0.3s", cursor: "default" }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#eef5f4")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td style={tdStyle}>{u.id_usuario}</td>
                <td style={tdStyle}>{u.Empleado?.nombre} {u.Empleado?.apellido} ({u.Empleado?.rol})</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "12px", color: "#fff", backgroundColor: u.activo === "S" ? "#198754" : "#dc3545", fontWeight: 600, fontSize: "0.9rem" }}>
                    {u.activo === "S" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => abrirModalEditar(u)} style={btnGray}>Modificar</button>
                  <button onClick={() => setUsuarioAEliminar(u)} style={btnRed}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Eliminación */}
      {usuarioAEliminar && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ marginBottom: "1rem", color: "#6c757d" }}>Confirmar Eliminación</h3>
            <p>¿Seguro que deseas dar de baja al usuario <b>{usuarioAEliminar.username}</b>?</p>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={() => setUsuarioAEliminar(null)} style={btnGray}>Cancelar</button>
              <button onClick={confirmarEliminar} style={btnRed}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edición */}
      {usuarioEditar && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ marginBottom: "1rem", color: "#0d6efd" }}>Editar Usuario</h3>
            <input
              value={datosEditados.username}
              onChange={(e) => setDatosEditados({ ...datosEditados, username: e.target.value })}
              placeholder="Nuevo Username"
              style={{ padding: "0.5rem 1rem", marginBottom: "1rem", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <select
              value={datosEditados.activo}
              onChange={(e) => setDatosEditados({ ...datosEditados, activo: e.target.value })}
              style={{ padding: "0.5rem 1rem", marginBottom: "1rem", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="S">Activo</option>
              <option value="N">Inactivo</option>
            </select>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={() => setUsuarioEditar(null)} style={btnGray}>Cancelar</button>
              <button onClick={handleEditar} style={btnBlue}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- estilos reutilizables --- */
const overlay: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};

const modalContainer: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  maxWidth: "800px",
  width: "90%",
  alignItems: "flex-start",
};

const modal: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  width: "400px",
  maxWidth: "90%",
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputGroup: React.CSSProperties = { display: "flex", flexDirection: "column", marginBottom: "1rem" };
const inputStyle: React.CSSProperties = { padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #c7ded3", width: "250px", transition: "all 0.2s", outline: "none" };
const btnGray: React.CSSProperties = { backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnGreen: React.CSSProperties = { backgroundColor: "#198754", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnBlue: React.CSSProperties = { backgroundColor: "#0d6efd", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const btnRed: React.CSSProperties = { backgroundColor: "#dc3545", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer" };
const tablaContainer: React.CSSProperties = { overflowX: "auto", backgroundColor: "#fff", padding: "1rem", borderRadius: "16px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" };
const thStyle: React.CSSProperties = { padding: "12px", textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "10px 12px" };
