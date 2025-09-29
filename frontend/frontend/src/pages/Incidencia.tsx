import { useEffect, useState } from "react";
import axios from "axios";

// 🖼️ Importar íconos
import alertIcon from "../assets/alert.jpeg";
import clockIcon from "../assets/clock.png";
import fileIcon from "../assets/file.png";

export default function Incidencia() {
  const [tipoIncidencia, setTipoIncidencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  const idEmpleadoLogueado = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoIncidencia.trim() || !descripcion.trim()) {
      setMensaje({ tipo: "error", texto: "⚠️ Completa todos los campos." });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/incidencias", {
        id_empleado_solicita: idEmpleadoLogueado,
        tipo_incidencia: tipoIncidencia, // ahora es texto, no ID
        descripcion,
      });

      setMensaje({ tipo: "success", texto: "Incidencia creada correctamente" });
      setDescripcion("");
      setTipoIncidencia("");
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Error al crear la incidencia" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h1 style={{ textAlign: "left", fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#2d3748" }}>
        📝 Reportar Incidencia
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Tipo de Incidencia (texto en lugar de combobox) */}
        <div style={{ background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <img src={fileIcon} alt="Tipo" style={{ width: "20px", height: "20px" }} />
            Tipo de Incidencia
          </label>
          <input
            type="text"
            value={tipoIncidencia}
            onChange={(e) => setTipoIncidencia(e.target.value)}
            placeholder="Ejemplo: Problema con impresora"
            style={{
              width: "70%",
              maxWidth: "500px",
              padding: ".7rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e0",
            }}
          />
        </div>

        {/* Descripción */}
        <div style={{ background: "#edf2f7", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <img src={alertIcon} alt="Descripción" style={{ width: "20px", height: "20px" }} />
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe la incidencia con detalle..."
            rows={4}
            style={{
              width: "70%",
              maxWidth: "500px",
              padding: ".8rem",
              borderRadius: "6px",
              border: "1px solid #a0aec0",
              resize: "vertical",
            }}
          />
        </div>

        {/* Botón */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#a0aec0" : "#2b6cb0",
              color: "#fff",
              padding: "0.9rem 1.5rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              justifyContent: "center",
            }}
          >
            <img src={clockIcon} alt="Guardar" style={{ width: "20px", height: "20px" }} />
            {loading ? "Guardando..." : "Crear Incidencia"}
          </button>
        </div>
      </form>

      {/* Notificación flotante */}
      {mensaje && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: mensaje.tipo === "success" ? "#48bb78" : "#f56565",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <img
            src={mensaje.tipo === "success" ? clockIcon : alertIcon}
            alt="Estado"
            style={{ width: "20px", height: "20px" }}
          />
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}
