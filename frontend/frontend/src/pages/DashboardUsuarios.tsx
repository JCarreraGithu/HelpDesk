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

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: "DELETE" });
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
                <td style={{ padding: "10px 12px" }}>
                  <button
                    onClick={() => handleEliminar(u.id_usuario)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#b02a37"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#dc3545"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
