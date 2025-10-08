import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface ModalActualizarEstadoProps {
  idCaso: number;
  usuario: any;
  onClose: () => void;
  onSuccess: () => void;
}

const estados = [
  { id: 1, nombre: "Recibido" },
  { id: 2, nombre: "En Proceso" },
  { id: 3, nombre: "Finalizado" },
  { id: 4, nombre: "Cerrado" },
];

const ModalActualizarEstado: React.FC<ModalActualizarEstadoProps> = ({
  idCaso,
  usuario,
  onClose,
  onSuccess,
}) => {
  const [nuevoEstado, setNuevoEstado] = useState<number>(2);
  const [comentario, setComentario] = useState<string>("");

  const handleActualizar = async () => {
    if (!comentario.trim()) {
      Swal.fire("⚠️ Campo requerido", "Por favor, ingresa un comentario.", "warning");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/casos/${idCaso}`, {
        id_estado_actual: nuevoEstado,
        detalles: comentario,
        id_empleado: usuario.id_empleado,
      });

      Swal.fire({
        title: "✅ Estado actualizado",
        text: "El estado del caso se ha cambiado correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("❌ Error", "No se pudo actualizar el estado del caso.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">
          Cambiar Estado del Caso
        </h2>

        <label className="block mb-2 font-semibold text-gray-700">Nuevo Estado:</label>
        <select
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
        >
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold text-gray-700">Comentario:</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 resize-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe brevemente el motivo del cambio..."
          rows={3}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleActualizar}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalActualizarEstado;
