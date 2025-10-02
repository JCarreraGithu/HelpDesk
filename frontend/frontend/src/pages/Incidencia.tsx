// src/pages/Incidencias.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, AlertCircle } from "lucide-react";

interface Incidencia {
  id_tipo: number;
  tipo: string;
  descripcion: string;
}

const Incidencias = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // 🟢 Cargar incidencias existentes
  const fetchIncidencias = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/tipos-incidencia");
      setIncidencias(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo.trim() || !descripcion.trim()) return;

    try {
      if (editingId === null) {
        await axios.post("http://localhost:4000/api/tipos-incidencia", {
          tipo,
          descripcion,
        });
      } else {
        await axios.put(`http://localhost:4000/api/tipos-incidencia/${editingId}`, {
          tipo,
          descripcion,
        });
      }

      setTipo("");
      setDescripcion("");
      setEditingId(null);
      fetchIncidencias();
    } catch (err) {
      console.error("Error al guardar incidencia:", err);
    }
  };

  const handleEdit = (inc: Incidencia) => {
    setTipo(inc.tipo);
    setDescripcion(inc.descripcion);
    setEditingId(inc.id_tipo);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Desea eliminar esta incidencia?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/tipos-incidencia/${id}`);
      fetchIncidencias();
    } catch (err) {
      console.error("Error al eliminar incidencia:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-gray-800">
        <AlertCircle size={28} className="text-red-600" />
        Tipos de Incidencia
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
      >
        <input
          type="text"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          placeholder="Tipo"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 flex items-center gap-2 rounded-lg hover:bg-red-600 transition"
        >
          <Plus size={18} />
          {editingId === null ? "Agregar" : "Actualizar"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-red-100 text-gray-700">
            <th className="border p-3 text-left">Tipo</th>
            <th className="border p-3 text-left">Descripción</th>
            <th className="border p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidencias.map((i) => (
            <tr key={i.id_tipo} className="hover:bg-red-50 transition-all">
              <td className="border p-3">{i.tipo}</td>
              <td className="border p-3">{i.descripcion}</td>
              <td className="border p-3 flex gap-3">
                <button
                  onClick={() => handleEdit(i)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(i.id_tipo)}
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

export default Incidencias;
