import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaIdBadge, FaExclamationCircle, FaClock, FaTasks, FaTimes } from "react-icons/fa";
import cerrarIcon from "../assets/cerrar.png";
import todosIcon from "../assets/todos.png";
import cambiarIcon from "../assets/cambiar.png";
import ModalCerrarCaso from "../components/ModalCerrarCaso";
import ModalActualizarEstado from "../components/ModalActualizarEstado";
import ModalAsignarTecnico from "../components/ModalAsignarTecnico";
import ReactDOM from "react-dom";

interface Historial {
  id_historial: number;
  fecha: string;
  comentario: string;
  estado: string;
  empleado: string;
  repuestos: { id_repuesto: number; cantidad: number }[];
}

interface Caso {
  id_caso: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_cierre?: string | null;
  tiempo_resolucion?: string | null;
  empleado: string;
  tecnico: string | null;
  tipo_incidencia: string;
  incidencia: string;
  prioridad: string;
  estado_actual: string;
  historial: Historial[];
}

export default function DetalleCaso() {
  const [caso, setCaso] = useState<Caso | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [comentario, setComentario] = useState<string>("");

  const [showCerrarModal, setShowCerrarModal] = useState(false);
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);

  useEffect(() => {
  const userData = localStorage.getItem("usuarioLogeado");
  if (userData) setUsuario(JSON.parse(userData));

  const fetchCaso = () => {
    const data = localStorage.getItem("casoDetalle");
    if (data) {
      const { id_caso } = JSON.parse(data);
      setLoading(true);
      axios
        .get(`http://localhost:4000/api/casos/id/${id_caso}`)
        .then((res) => setCaso(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  // Ejecutar al montar
  fetchCaso();

  // 🔥 Escuchar cambios en localStorage (cuando cambias de notificación)
  const handleStorageChange = () => {
    fetchCaso();
  };

  window.addEventListener("storage", handleStorageChange);

  // 🔁 También actualiza al volver a abrir el componente (por seguridad)
  window.addEventListener("focus", fetchCaso);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("focus", fetchCaso);
  };
}, []);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Cargando caso...</p>;
  if (!caso)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        ⚠️ Caso no encontrado
      </p>
    );

  const campos = [
    { label: "Título", value: caso.titulo, icon: <FaTasks />, color: "#d1e7dd" },
    { label: "Empleado", value: caso.empleado, icon: <FaUser />, color: "#cfe2ff" },
    { label: "Técnico asignado", value: caso.tecnico || "No asignado", icon: <FaIdBadge />, color: "#ffe5b4" },
    { label: "Tipo de incidencia", value: caso.tipo_incidencia, icon: <FaExclamationCircle />, color: "#f8d7da" },
    { label: "Prioridad", value: caso.prioridad, icon: <FaClock />, color: "#ffe5b4" },
    { label: "Estado actual", value: caso.estado_actual, icon: <FaTasks />, color: "#d1c4e9" },
    { label: "Fecha creación", value: new Date(caso.fecha_creacion).toLocaleString(), icon: <FaClock />, color: "#d1c4e9" },
  ];

  return (
    <div style={{ maxWidth: "1700px", padding: "1rem", backgroundColor: "#C0C0C0", minHeight: "100vh", margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(160deg, #f9fafc, #e6f0eb)", padding: "2rem", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
        
        {/* Título + Botones */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>
            Caso #{caso.id_caso} - {caso.titulo}
          </h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            {caso.estado_actual !== "Finalizado" && (
              <>
                <button
                  onClick={() => {
                    if (caso.estado_actual === "Cerrado" || caso.estado_actual === "Finalizado") {
                      Swal.fire("⚠️ Atención", "Este caso ya está cerrado", "info");
                      return;
                    }
                    setShowCerrarModal(true);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "transparent",
                    border: "2px solid #dc3545",
                    color: "#dc3545",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#dc354520")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <img src={cerrarIcon} alt="Cerrar" style={{ width: "40px", height: "40px", filter: "drop-shadow(0 0 3px #dc3545)" }} />
                  Cerrar Caso
                </button>

                <button
                  onClick={() => setShowAsignarModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "transparent",
                    border: "2px solid #198754",
                    color: "#198754",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#19875420")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <img src={todosIcon} alt="Asignar" style={{ width: "35px", height: "35px", filter: "drop-shadow(0 0 3px #198754)" }} />
                  Asignar Técnico
                </button>

                <button
                  onClick={() => setShowModalEstado(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "transparent",
                    border: "2px solid #ffc107",
                    color: "#b08900",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ffc10720")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <img src={cambiarIcon} alt="Estado" style={{ width: "35px", height: "35px", filter: "drop-shadow(0 0 3px #ffc107)" }} />
                  Cambiar Estado
                </button>
              </>
            )}
          </div>
        </div>

       {/* Campos del caso */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(200px, 1fr))", gap: "1rem", maxWidth: "800px", margin: "0 auto 2rem auto" }}>
  {campos.map((campo, idx) => (
    <div key={idx} style={{ backgroundColor: campo.color, padding: "1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", justifyContent: "center" }}>
      {campo.icon}
      <div style={{ textAlign: "center" }}>
        <strong>{campo.label}:</strong> {campo.value}
      </div>
    </div>
  ))}

  {/* Fecha de cierre */}
  {caso.fecha_cierre && (
    <div style={{ backgroundColor: "#f8d7da", padding: "1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", justifyContent: "center" }}>
      <FaClock style={{ color: "#dc3545" }} />
      <div style={{ textAlign: "center" }}>
        <strong>Fecha cierre:</strong> {new Date(caso.fecha_cierre).toLocaleString()}
      </div>
    </div>
  )}

  {/* Tiempo de resolución */}
  {caso.tiempo_resolucion && (
    <div style={{ backgroundColor: "#d1e7dd", padding: "1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", justifyContent: "center" }}>
      <FaClock style={{ color: "#198754" }} />
      <div style={{ textAlign: "center" }}>
        <strong>Tiempo resolución:</strong> {caso.tiempo_resolucion}
      </div>
    </div>
  )}
</div>


        {/* Historial */}
        <div>
          <h3 style={{ borderBottom: "2px solid #198754", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Actividad</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {caso.historial
              ?.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
              .map(h => (
                <li key={h.id_historial} style={{ backgroundColor: "#fff", marginBottom: "0.8rem", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
                    <FaUser style={{ color: "#198754" }} /> {h.empleado}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{h.comentario}</span>
                    <span style={{ fontSize: "0.85rem", color: "#666" }}>
                      {new Date(h.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#198754", marginTop: "0.3rem" }}>
                    {h.estado}
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* MODALES (se mantienen como antes) */}
        {showCerrarModal && caso && usuario && (
          <ModalCerrarCaso
            idCaso={caso.id_caso}
            idEmpleado={usuario.id_empleado}
            onClose={() => setShowCerrarModal(false)}
            onSuccess={() => window.location.reload()}
          />
        )}
        {showModalEstado && caso && usuario && (
          <ModalActualizarEstado
            idCaso={caso.id_caso}
            usuario={usuario}
            onClose={() => setShowModalEstado(false)}
            onSuccess={() => window.location.reload()}
          />
        )}
        {showAsignarModal && caso && usuario && (
          <ModalAsignarTecnico
            idCaso={caso.id_caso}
            usuario={usuario}
            onClose={() => setShowAsignarModal(false)}
            onSuccess={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
}
