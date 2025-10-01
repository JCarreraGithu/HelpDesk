import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaIdBadge,
  FaExclamationCircle,
  FaClock,
  FaTasks,
} from "react-icons/fa";

interface Historial {
  id_historial: number;
  fecha: string;
  comentario: string;
  estado: string;
  empleado: string;
}

interface CasoDetalle {
  id_caso: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  empleado?: string;
  tipo_incidencia?: string;
  prioridad?: string;
  estado_actual?: string;
  historial?: Historial[];
}

export default function DetalleCaso() {
  const location = useLocation();
  const navigate = useNavigate();
  const casoDesdeState = location.state?.caso;

  const [caso, setCaso] = useState<CasoDetalle | null>(
    casoDesdeState || null
  );

  useEffect(() => {
    const fetchCaso = async () => {
      if (!casoDesdeState) {
        const data = localStorage.getItem("casoDetalle");
        if (data) {
          const { id_caso } = JSON.parse(data);
          try {
            // ✅ ruta corregida: /id/:id
            const res = await axios.get(
              `http://localhost:4000/api/casos/id/${id_caso}`
            );
            setCaso(res.data);
          } catch (error) {
            console.error("Error al cargar el caso:", error);
          }
        }
      } else {
        setCaso(casoDesdeState);
      }
    };
    fetchCaso();
  }, [casoDesdeState]);

  if (!caso) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando caso...
      </p>
    );
  }

  const campos = [
    {
      label: "Título",
      value: caso.titulo,
      icon: <FaTasks />,
      color: "#d1e7dd",
    },
    {
      label: "Empleado",
      value: caso.empleado || "N/A",
      icon: <FaUser />,
      color: "#cfe2ff",
    },
    {
      label: "Tipo de incidencia",
      value: caso.tipo_incidencia || "N/A",
      icon: <FaExclamationCircle />,
      color: "#f8d7da",
    },
    {
      label: "Prioridad",
      value: caso.prioridad || "N/A",
      icon: <FaClock />,
      color: "#ffe5b4",
    },
    {
      label: "Estado actual",
      value: caso.estado_actual || "N/A",
      icon: <FaTasks />,
      color: "#d1c4e9",
    },
    {
      label: "Fecha creación",
      value: caso.fecha_creacion
        ? new Date(caso.fecha_creacion).toLocaleString()
        : "N/A",
      icon: <FaClock />,
      color: "#d1c4e9",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        backgroundColor: "#C0C0C0",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg, #f9fafc, #e6f0eb)",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "'Inter', Arial, sans-serif",
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#198754",
            fontSize: "2rem",
            borderBottom: "2px solid #198754",
            paddingBottom: "0.5rem",
          }}
        >
          Detalle del Caso #{caso.id_caso}
        </h2>

        {/* Tarjetas de campos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {campos.map((campo) => (
            <div
              key={campo.label}
              style={{
                backgroundColor: campo.color,
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ fontSize: "1.8rem", color: "#198754" }}>
                {campo.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{campo.label}:</p>
                <p style={{ margin: 0, color: "#555" }}>{campo.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Descripción */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
            display: "inline-block",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "600px",
            minWidth: "150px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            Descripción
          </h3>
          <p style={{ margin: 0 }}>
            {caso.descripcion || "No hay descripción disponible."}
          </p>
        </div>

        {/* Historial */}
        <h3
          style={{
            color: "#198754",
            marginBottom: "1rem",
            borderBottom: "1px solid #198754",
            paddingBottom: "0.3rem",
          }}
        >
          Historial
        </h3>
        {caso.historial && caso.historial.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#d9ebe3" }}>
              <tr>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Fecha
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Comentario
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Estado
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Empleado
                </th>
              </tr>
            </thead>
            <tbody>
              {caso.historial.map((h) => (
                <tr
                  key={h.id_historial}
                  style={{
                    borderBottom: "1px solid #ddd",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#eef5f4")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={{ padding: "10px 15px" }}>{h.id_historial}</td>
                  <td style={{ padding: "10px 15px" }}>
                    {new Date(h.fecha).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 15px" }}>{h.comentario}</td>
                  <td style={{ padding: "10px 15px" }}>{h.estado}</td>
                  <td style={{ padding: "10px 15px" }}>{h.empleado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay historial disponible.</p>
        )}

        {/* Botón volver */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "#198754",
              color: "#fff",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.1rem",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#157347";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,0,0,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#198754";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.2)";
            }}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
