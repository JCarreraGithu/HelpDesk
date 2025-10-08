import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSyncAlt, FaTimes } from "react-icons/fa";

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

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #198754",
    backgroundColor: "#2d2d2d",
    color: "white",
    outline: "none",
    width: "100%",
    marginBottom: "1rem",
    transition: "all 0.2s ease-in-out",
  };

  const selectStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #0dcaf0",
    backgroundColor: "#2d2d2d",
    color: "white",
    outline: "none",
    width: "100%",
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        style={{
          background: "#2d2d2d",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          padding: "1.5rem",
          width: "400px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ color: "#198754", fontSize: "1.25rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaSyncAlt /> Cambiar Estado
          </h2>
          <button onClick={onClose} style={{ color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}>
            <FaTimes size={20} />
          </button>
        </div>

        <label style={{ color: "#fff", fontWeight: 600, marginBottom: "0.3rem" }}>Nuevo Estado:</label>
        <select
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(Number(e.target.value))}
          style={selectStyle}
        >
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        <label style={{ color: "#fff", fontWeight: 600, marginBottom: "0.3rem" }}>Comentario:</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          style={{ ...inputStyle, height: "100px", resize: "none" }}
          placeholder="Describe brevemente el motivo del cambio..."
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={onClose}
            style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a6268")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c757d")}
          >
            Cancelar
          </button>
          <button
            onClick={handleActualizar}
            style={{ ...buttonStyle, backgroundColor: "#198754", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#157347")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#198754")}
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalActualizarEstado;
