import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🖼️ Íconos
import fileIcon from "../assets/file.png";
import clockIcon from "../assets/clock.png";
import alertIcon from "../assets/alert.jpeg";

interface Caso {
  id_caso: number;
  titulo: string;
  descripcion: string;
  estado_actual: string;
  fecha_creacion: string;
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
        background: "#D3D3D3",
        maxWidth: "1900px",
        margin: "2rem auto",
        padding: "1rem",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "left",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#2d3748",
        }}
      >
        📋 Casos Registrados
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#2b6cb0", color: "white" }}>
          <tr>
            <th style={{ padding: "1rem", textAlign: "left" }}>Título</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Descripción</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Estado</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Fecha</th>
            <th style={{ padding: "1rem", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {casos.length > 0 ? (
            casos.map((caso) => (
              <tr key={caso.id_caso} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "1rem" }}>{caso.titulo}</td>
                <td style={{ padding: "1rem" }}>{caso.descripcion}</td>
                <td style={{ padding: "1rem" }}>{caso.estado_actual}</td>
                <td style={{ padding: "1rem" }}>
                  {new Date(caso.fecha_creacion).toLocaleString()}
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
                      transition: "background 0.3s",
                    }}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                😕 No hay casos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
