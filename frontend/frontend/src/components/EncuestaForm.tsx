import React, { useState } from "react";
import axios from "axios";

interface Props {
  idCaso: number;
  idEmpleado: number; // ✅ nuevo prop obligatorio
  onEncuestaRespondida: (data: {
    calificacion: number;
    comentario: string;
  }) => void;
}

export default function EncuestaForm({ idCaso, idEmpleado, onEncuestaRespondida }: Props) {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarEncuesta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion === 0) return alert("Selecciona una calificación");

    setEnviando(true);
    try {
      await axios.post("http://localhost:4000/api/encuestas", {
  id_caso: idCaso,
  calificacion,
  comentario,
  usuario_reporta: idEmpleado,
  calif_tiempo_respuesta: 0,
  calif_trato_tecnico: 0,
  calif_solucion: 0,
  calif_comunicacion: 0,
  recomendaria: "N"
});

      onEncuestaRespondida({ calificacion, comentario });
    } catch (err) {
      console.error("Error al enviar encuesta:", err);
      alert("Hubo un error al enviar la encuesta");
    } finally {
      setEnviando(false);
    }
  };


  return (
    <form onSubmit={enviarEncuesta}>
      <label style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}>
        Calificación del servicio
      </label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => setCalificacion(n)}
            style={{
              fontSize: "2rem",
              color: calificacion >= n ? "#FFD700" : "#ccc",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            ★
          </span>
        ))}
      </div>

      <label style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}>
        Comentario adicional
      </label>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={4}
        placeholder="Escribe tu opinión..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      />

      <button
        type="submit"
        disabled={enviando}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: "#198754",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {enviando ? "Enviando..." : "Enviar encuesta"}
      </button>
    </form>
  );
}