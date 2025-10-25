import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 🖼️ Íconos
import fileIcon from "../assets/file.png";
import calendarImg from "../assets/calendar.png";

interface Caso {
  id_caso: number;
  titulo: string;
  descripcion: string;
  estado_actual: string;
  prioridad?: string;
  fecha_creacion: string;
}

interface Estado {
  ID_ESTADO: number;
  NOMBRE: string;
}

interface Prioridad {
  ID_PRIORIDAD: number;
  NOMBRE: string;
}

export default function VerCasos() {
  const navigate = useNavigate();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<"fecha" | "estado" | "prioridad" | null>(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [prioridades, setPrioridades] = useState<Prioridad[]>([]);

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resCasos, resEstados, resPrioridades] = await Promise.all([
          axios.get("http://localhost:4000/api/casos"),
          axios.get("http://localhost:4000/api/config/estados-caso"),
          axios.get("http://localhost:4000/api/config/prioridades"),
        ]);
        setCasos(resCasos.data);
        setEstados(resEstados.data);
        setPrioridades(resPrioridades.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "No se pudieron obtener los datos del servidor.",
          timer: 2500,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 🔹 Filtrar casos
  const casosFiltrados = casos.filter((c) => {
    if (!filtroSeleccionado) return true;

    if (filtroSeleccionado === "fecha" && fechaFiltro) {
      const fechaCaso = new Date(c.fecha_creacion).toISOString().split("T")[0];
      return fechaCaso === fechaFiltro;
    }

    if (filtroSeleccionado === "estado" && estadoFiltro) {
      return c.estado_actual?.toLowerCase() === estadoFiltro.toLowerCase();
    }

    if (filtroSeleccionado === "prioridad" && prioridadFiltro) {
      return c.prioridad?.toLowerCase() === prioridadFiltro.toLowerCase();
    }

    return true;
  });

  // 🔹 Ir a detalle
  const handleVerDetalle = (id_caso: number) => {
    localStorage.setItem("casoDetalle", JSON.stringify({ id_caso }));
    navigate("/dashboard/detalle-caso");
  };

  // 🔹 Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroSeleccionado(null);
    setFechaFiltro("");
    setEstadoFiltro("");
    setPrioridadFiltro("");
  };

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
      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#2d3748",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <img src={fileIcon} alt="Casos" style={{ width: "24px", height: "24px" }} />
          📋 Casos Registrados
        </h1>

        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          style={{
            background: "#2b6cb0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.6rem 1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ⚙️ Click para configurar un filtro
        </button>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #cbd5e0",
            borderRadius: "10px",
            padding: "1rem",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ color: "#2b6cb0", marginBottom: "1rem" }}>Selecciona un tipo de filtro:</h4>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {["fecha", "estado", "prioridad"].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroSeleccionado(tipo as any)}
                style={{
                  background: filtroSeleccionado === tipo ? "#2b6cb0" : "#e2e8f0",
                  color: filtroSeleccionado === tipo ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                {tipo === "fecha" && "Por Fecha"}
                {tipo === "estado" && "Por Estado"}
                {tipo === "prioridad" && "Por Prioridad"}
              </button>
            ))}

            <button
              onClick={limpiarFiltros}
              style={{
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              🔄 Mostrar todos
            </button>
          </div>

          {/* Filtro por fecha (sin librerías) */}
          {filtroSeleccionado === "fecha" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "#C0C0C0",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              {/* Ícono calendario */}
              <label
                htmlFor="fechaFiltro"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#222",
                  borderRadius: "12px",
                  padding: "0.8rem",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
              >
                <img
                  src={calendarImg}
                  alt="Seleccionar fecha"
                  style={{ width: "50px", height: "50px" }}
                />
              </label>

              {/* Input de tipo date */}
              <input
                id="fechaFiltro"
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                style={{
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #999",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              />

              {/* Fecha visible */}
              <p style={{ fontWeight: "bold", margin: 0 }}>
                {fechaFiltro ? `📅 ${fechaFiltro}` : "Selecciona una fecha"}
              </p>
            </div>
          )}

          {/* Filtro por estado */}
          {filtroSeleccionado === "estado" && (
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ fontWeight: "bold", marginRight: "1rem" }}>
                Selecciona un estado:
              </label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Selecciona --</option>
                {estados.map((e) => (
                  <option key={e.ID_ESTADO} value={e.NOMBRE}>
                    {e.NOMBRE}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro por prioridad */}
          {filtroSeleccionado === "prioridad" && (
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ fontWeight: "bold", marginRight: "1rem" }}>
                Selecciona una prioridad:
              </label>
              <select
                value={prioridadFiltro}
                onChange={(e) => setPrioridadFiltro(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Selecciona --</option>
                {prioridades.map((p) => (
                  <option key={p.ID_PRIORIDAD} value={p.NOMBRE}>
                    {p.NOMBRE}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
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
            <th style={{ padding: "1rem", textAlign: "left" }}>Prioridad</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Fecha</th>
            <th style={{ padding: "1rem", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {casosFiltrados.length > 0 ? (
            casosFiltrados.map((caso) => (
              <tr key={caso.id_caso} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "1rem" }}>{caso.titulo}</td>
                <td style={{ padding: "1rem" }}>{caso.descripcion}</td>
                <td style={{ padding: "1rem" }}>{caso.estado_actual}</td>
                <td style={{ padding: "1rem" }}>{caso.prioridad || "—"}</td>
                <td style={{ padding: "1rem" }}>
                  {new Date(caso.fecha_creacion).toLocaleDateString()}
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
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                😕 No hay casos que coincidan con el filtro
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
