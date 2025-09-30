// src/pages/Repuestos.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Package, Plus } from "lucide-react";

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: string;
}

const Repuestos = () => {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState(0);
  const [precio, setPrecio] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRepuestos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/repuestos");
      setRepuestos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId === null) {
        await axios.post("http://localhost:4000/api/repuestos", {
          nombre,
          descripcion,
          stock,
          precio_unitario: precio,
        });
      } else {
        await axios.put(`http://localhost:4000/api/repuestos/${editingId}`, {
          nombre,
          descripcion,
          stock,
          precio_unitario: precio,
        });
      }
      setNombre("");
      setDescripcion("");
      setStock(0);
      setPrecio("");
      setEditingId(null);
      fetchRepuestos();
    } catch (err) {
      console.error("Error al guardar repuesto:", err);
    }
  };

  const handleEdit = (repuesto: Repuesto) => {
    setNombre(repuesto.nombre);
    setDescripcion(repuesto.descripcion);
    setStock(repuesto.stock);
    setPrecio(repuesto.precio_unitario);
    setEditingId(repuesto.id_repuesto);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Desea eliminar este repuesto?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/repuestos/${id}`);
      fetchRepuestos();
    } catch (err) {
      console.error("Error al eliminar repuesto:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-gray-800">
        <Package size={28} className="text-green-600" />
        Repuestos
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
      >
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Stock"
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio unitario"
            className="flex-1 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 flex items-center gap-2 rounded-lg hover:bg-green-600 transition"
          >
            <Plus size={18} />
            {editingId === null ? "Agregar" : "Actualizar"}
          </button>
        </div>
      </form>

      <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-green-100 text-gray-700">
            <th className="border p-3 text-left">Nombre</th>
            <th className="border p-3 text-left">Descripción</th>
            <th className="border p-3 text-left">Stock</th>
            <th className="border p-3 text-left">Precio</th>
            <th className="border p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {repuestos.map((r) => (
            <tr
              key={r.id_repuesto}
              className="hover:bg-green-50 transition-all"
            >
              <td className="border p-3">{r.nombre}</td>
              <td className="border p-3">{r.descripcion}</td>
              <td className="border p-3">{r.stock}</td>
              <td className="border p-3">{r.precio_unitario}</td>
              <td className="border p-3 flex gap-3">
                <button
                  onClick={() => handleEdit(r)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(r.id_repuesto)}
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

export default Repuestos;
