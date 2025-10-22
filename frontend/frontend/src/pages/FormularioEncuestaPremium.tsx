import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom"; // ✅ agregamos useNavigate

const FormularioEncuestaPremium: React.FC = () => {
  const { idCaso } = useParams();
  const navigate = useNavigate(); // ✅ inicializamos navigate
  const [ratings, setRatings] = useState({
    calificacion_general: 0,
    tiempo_respuesta: 0,
    resolucion_problema: 0,
    atencion_personal: 0,
    comunicacion: 0,
  });
  const [comentario, setComentario] = useState("");
  const [recomendaria, setRecomendaria] = useState<"S" | "N" | null>(null);
  const [idCasoFinal, setIdCasoFinal] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    if (idCaso) setIdCasoFinal(Number(idCaso));
    else {
      const casoGuardado = localStorage.getItem("casoEncuesta");
      if (casoGuardado) setIdCasoFinal(JSON.parse(casoGuardado).id_caso);
    }
  }, [idCaso]);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogeado");
    if (userData) {
      const usuario = JSON.parse(userData);
      setUsuarioId(usuario.id_usuario);
    }
  }, []);

  const handleRating = (key: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const renderStars = (key: keyof typeof ratings) => {
    const value = ratings[key];
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => handleRating(key, n)}
            style={{
              fontSize: "2rem",
              color: value >= n ? "#FFD700" : "#ccc",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idCasoFinal)
      return Swal.fire("Error", "No se encontró el ID del caso.", "error");
    if (Object.values(ratings).some((r) => r === 0))
      return Swal.fire(
        "Atención",
        "Por favor califica todas las categorías.",
        "warning"
      );
    if (!recomendaria)
      return Swal.fire(
        "Atención",
        "Por favor selecciona si nos recomendarías.",
        "warning"
      );
    if (!usuarioId)
      return Swal.fire(
        "Error",
        "No se encontró el usuario logeado.",
        "error"
      );

    const datosEnvio = {
      id_caso: idCasoFinal,
      calificacion: ratings.calificacion_general,
      comentario,
      usuario_reporta: usuarioId,
      calif_tiempo_respuesta: ratings.tiempo_respuesta,
      calif_trato_tecnico: ratings.atencion_personal,
      calif_solucion: ratings.resolucion_problema,
      calif_comunicacion: ratings.comunicacion,
      recomendaria,
    };

    try {
      await axios.post("http://localhost:4000/api/encuestas", datosEnvio);

      Swal.fire("¡Gracias!", "Tu encuesta fue enviada con éxito.", "success").then(() => {
        // ✅ Redirigir al dashboard de casos
        navigate("/dashboard/ver-casos");
      });

    } catch (err: any) {
      console.error("Error al enviar encuesta:", err.response?.data || err);
      Swal.fire(
        "Error",
        `Hubo un problema: ${err.response?.data?.msg || "Error desconocido"}`,
        "error"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          Encuesta de Satisfacción
        </h2>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Califica tu experiencia con el soporte técnico del caso <strong>#{idCasoFinal}</strong>
        </p>

        {[
          { key: "calificacion_general", label: "Calificación general" },
          { key: "tiempo_respuesta", label: "Tiempo de respuesta" },
          { key: "resolucion_problema", label: "Resolución del problema" },
          { key: "atencion_personal", label: "Atención del personal" },
          { key: "comunicacion", label: "Comunicación" },
        ].map((item) => (
          <div key={item.key} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
              {item.label}
            </label>
            {renderStars(item.key as keyof typeof ratings)}
          </div>
        ))}

        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
          ¿Nos recomendarías?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <button
            type="button"
            onClick={() => setRecomendaria("S")}
            style={{
              padding: "10px 20px",
              borderRadius: "15px",
              fontWeight: "bold",
              background: recomendaria === "S" ? "green" : "#ccc",
              color: recomendaria === "S" ? "#fff" : "#000",
            }}
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => setRecomendaria("N")}
            style={{
              padding: "10px 20px",
              borderRadius: "15px",
              fontWeight: "bold",
              background: recomendaria === "N" ? "red" : "#ccc",
              color: recomendaria === "N" ? "#fff" : "#000",
            }}
          >
            No
          </button>
        </div>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario adicional..."
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "15px",
            background: "#6a11cb",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Enviar encuesta
        </button>
      </form>
    </div>
  );
};

export default FormularioEncuestaPremium;
