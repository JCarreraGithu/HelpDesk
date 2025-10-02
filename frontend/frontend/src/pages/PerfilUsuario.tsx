import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Usuario {
  id_usuario: number;
  id_empleado: number;
  username: string;
  password: string;
  ultimo_login: string | null;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [idEmpleado, setIdEmpleado] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId === null) {
        await axios.post("http://localhost:4000/api/usuarios", {
          id_empleado: idEmpleado,
          username,
          password,
        });
      } else {
        await axios.put(`http://localhost:4000/api/usuarios/${editingId}`, {
          id_empleado: idEmpleado,
          username,
          password,
        });
      }
      setIdEmpleado(0);
      setUsername("");
      setPassword("");
      setEditingId(null);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setIdEmpleado(usuario.id_empleado);
    setUsername(usuario.username);
    setPassword(usuario.password);
    setEditingId(usuario.id_usuario);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Desea eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-gray-800">
        <Plus size={28} className="text-blue-600" />
        Usuarios
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
      >
        <input
          type="number"
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(Number(e.target.value))}
          placeholder="ID Empleado"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Plus size={18} />
          {editingId === null ? "Agregar" : "Actualizar"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="border p-3 text-left">ID Usuario</th>
            <th className="border p-3 text-left">ID Empleado</th>
            <th className="border p-3 text-left">Username</th>
            <th className="border p-3 text-left">Ultimo Login</th>
            <th className="border p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario} className="hover:bg-blue-50 transition-all">
              <td className="border p-3">{u.id_usuario}</td>
              <td className="border p-3">{u.id_empleado}</td>
              <td className="border p-3">{u.username}</td>
              <td className="border p-3">{u.ultimo_login ?? "-"}</td>
              <td className="border p-3 flex gap-3">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(u.id_usuario)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
