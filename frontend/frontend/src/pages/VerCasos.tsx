import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ticketIcon from "../assets/ticket.png";
import clockIcon from "../assets/clock.png";
import alertIcon from "../assets/alert.jpeg";

interface Caso {
  id_caso: number;
  titulo: string;
  descripcion: string;
  estado_actual: string;
  fecha_creacion: string;
  tipo_incidencia: string;
  tecnico: string | null;
}

export default function VerCasos() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/casos");
        setCasos(res.data);
      } catch (error: any) {
        console.error("Error cargando casos:", error);
        setMensaje({
          tipo: "error",
          texto: "⚠️ No se pudieron cargar los casos.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCasos();
  }, []);

  const handleVerDetalle = (id_caso: number) => {
    localStorage.setItem("casoDetalle", JSON.stringify({ id_caso }));
    navigate("/dashboard/detalle-caso");
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Cargando casos...</p>;
  }

  return (
    <div
      style={{
        background: "#E8E8E8",
        maxWidth: "1900px",
        margin: "2rem auto",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        minHeight: "600px",
        borderRadius: "10px",
      }}
    >
      {/* 🔹 Encabezado */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          gap: "0.8rem",
        }}
      >
        <img src={ticketIcon} alt="Ticket Icon" style={{ width: "45px", height: "45px" }} />
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#2b6cb0",
          }}
        >
          Todos los casos
        </h1>
      </div>

      {/* 🔹 Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "#2b6cb0", color: "white" }}>
          <tr>
            <th style={{ padding: "1rem", textAlign: "left" }}>Código</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Título</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Tipo de Incidencia</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Detalles</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Estado</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Fecha</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Técnico Asignado</th>
            <th style={{ padding: "1rem", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {casos.length > 0 ? (
            casos.map((caso) => (
              <tr
                key={caso.id_caso}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f7fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <td style={{ padding: "1rem", color: "#16a34a", fontWeight: "bold" }}>
                  #{caso.id_caso}
                </td>
                <td style={{ padding: "1rem" }}>{caso.titulo}</td>
                <td style={{ padding: "1rem" }}>{caso.tipo_incidencia || "—"}</td>
                <td style={{ padding: "1rem", color: "#4a5568" }}>{caso.descripcion}</td>
                <td
                  style={{
                    padding: "1rem",
                    color:
                      caso.estado_actual === "Finalizado"
                        ? "#16a34a"
                        : caso.estado_actual === "Pendiente"
                        ? "#d97706"
                        : "#2563eb",
                    fontWeight: "bold",
                  }}
                >
                  {caso.estado_actual}
                </td>
                <td style={{ padding: "1rem" }}>
                  {new Date(caso.fecha_creacion).toLocaleString()}
                </td>
                <td style={{ padding: "1rem" }}>
                  {caso.tecnico ? caso.tecnico : "No asignado"}
                </td>
                <td style={{ textAlign: "center", padding: "1rem" }}>
                  <button
                    onClick={() => handleVerDetalle(caso.id_caso)}
                    style={{
                      background: "#2b6cb0",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "transform 0.2s, background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1e4e8c";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#2b6cb0";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                😕 No hay casos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Notificación flotante */}
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
