import { useEffect, useState } from "react";

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

  // Estado para confirmar eliminación
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  // Estado para modificar usuario
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [datosEditados, setDatosEditados] = useState({ username: "", activo: "" });

  const cargarUsuarios = async () => {
    const res = await fetch("http://localhost:4000/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

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
    setUsuarioAEliminar(null); // Cierra el modal
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
      <h2
        style={{
          color: "#198754",
          borderBottom: "2px solid #198754",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        Usuarios
      </h2>

      {/* Botón alternar Formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
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
        {showForm ? "Cancelar" : "Agregar Usuario"}
      </button>

      {/* Formulario */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "16px",
            marginBottom: "2rem",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#198754" }}>Nuevo Usuario</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="ID empleado"
              value={nuevoUsuario.id_empleado}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, id_empleado: e.target.value })}
              style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #c7ded3", width: "120px" }}
            />
            <input
              placeholder="Username"
              value={nuevoUsuario.username}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
              style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #c7ded3", width: "200px" }}
            />
            <input
              placeholder="Password"
              type="password"
              value={nuevoUsuario.password}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
              style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #c7ded3", width: "200px" }}
            />
          </div>
          <button
            onClick={handleCrear}
            style={{
              backgroundColor: "#198754",
              color: "#fff",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#157347"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#198754"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Crear
          </button>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "16px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "12px", overflow: "hidden" }}>
          <thead style={{ backgroundColor: "#d9ebe3" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Empleado</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Usuario</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Activo</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id_usuario}
                style={{ transition: "background 0.3s", cursor: "default" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#eef5f4")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "10px 12px" }}>{u.id_usuario}</td>
                <td style={{ padding: "10px 12px" }}>{u.Empleado?.nombre} {u.Empleado?.apellido} ({u.Empleado?.rol})</td>
                <td style={{ padding: "10px 12px" }}>{u.username}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "12px",
                      color: "#fff",
                      backgroundColor: u.activo === "S" ? "#198754" : "#dc3545",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {u.activo === "S" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => abrirModalEditar(u)}
                    style={{
                      backgroundColor: "#808080",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#C0C0C0"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#808080"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => setUsuarioAEliminar(u)}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#C0C0C0"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#808080"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
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

      {/* Modal de edición */}
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
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
};

const btnGray: React.CSSProperties = {
  backgroundColor: "#6c757d",
  color: "#fff",
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const btnRed: React.CSSProperties = {
  backgroundColor: "#dc3545",
  color: "#fff",
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const btnBlue: React.CSSProperties = {
  backgroundColor: "#0d6efd",
  color: "#fff",
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
