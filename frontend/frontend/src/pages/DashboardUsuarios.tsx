import { useEffect, useState } from "react";

interface Usuario {
  id_usuario: number;
  username: string;
  activo: string;
  Empleado: { nombre: string; apellido: string; rol: string };
}

export default function DashboardUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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
    await fetch("http://localhost:4000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });
    cargarUsuarios();
  };

  const handleEliminar = async (id: number) => {
    await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: "DELETE" });
    cargarUsuarios();
  };

  return (
    <div>
      <h2>Usuarios</h2>

      <div>
        <input placeholder="ID empleado" onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, id_empleado: e.target.value })} />
        <input placeholder="Username" onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} />
        <button onClick={handleCrear}>Crear Usuario</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empleado</th>
            <th>Usuario</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.Empleado?.nombre} {u.Empleado?.apellido} ({u.Empleado?.rol})</td>
              <td>{u.username}</td>
              <td>{u.activo}</td>
              <td>
                <button onClick={() => handleEliminar(u.id_usuario)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
