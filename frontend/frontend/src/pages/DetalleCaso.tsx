import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaIdBadge, FaExclamationCircle, FaClock, FaTasks } from "react-icons/fa";
import cerrarIcon from "../assets/cerrar.png";
import todosIcon from "../assets/todos.png";
import cambiarIcon from "../assets/cambiar.png";

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

  const [showCerrarModal, setShowCerrarModal] = useState(false);
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);

  // Estados para el modal de cambiar estado
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [comentarioEstado, setComentarioEstado] = useState("");

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

    fetchCaso();
    const handleStorageChange = () => fetchCaso();
    window.addEventListener("storage", handleStorageChange);
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

  const botonEstilo = (color: string, textColor?: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    background: "transparent",
    border: `2px solid ${color}`,
    color: textColor || color,
    padding: "0.6rem 1.2rem",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const handleGuardarEstado = async () => {
    if (!nuevoEstado || !comentarioEstado) {
      Swal.fire("⚠️ Atención", "Debe completar todos los campos", "warning");
      return;
    }
    try {
      await axios.patch(`http://localhost:4000/api/casos/${caso?.id_caso}/estado`, {
        estado: nuevoEstado,
        comentario: comentarioEstado,
        id_empleado: usuario.id_empleado,
      });
      Swal.fire("✅ Éxito", "Estado actualizado correctamente", "success");
      setShowModalEstado(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      Swal.fire("❌ Error", "No se pudo actualizar el estado", "error");
    }
  };

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
                  onClick={() => setShowCerrarModal(true)}
                  style={botonEstilo("#dc3545")}
                >
                  <img src={cerrarIcon} alt="Cerrar" style={{ width: "40px", height: "40px", filter: "drop-shadow(0 0 3px #dc3545)" }} />
                  Cerrar Caso
                </button>

                <button
                  onClick={() => setShowAsignarModal(true)}
                  style={botonEstilo("#198754")}
                >
                  <img src={todosIcon} alt="Asignar" style={{ width: "35px", height: "35px", filter: "drop-shadow(0 0 3px #198754)" }} />
                  Asignar Técnico
                </button>

                <button
                  onClick={() => {
                    setNuevoEstado(caso.estado_actual);
                    setComentarioEstado("");
                    setShowModalEstado(true);
                  }}
                  style={botonEstilo("#ffc107", "#b08900")}
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

        {/* MODAL CAMBIAR ESTADO */}
        {showModalEstado && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h3 style={{ color: "#b08900", textAlign: "center", marginBottom: "1rem" }}>Cambiar Estado</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Estado:</label>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Abierto">Abierto</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Comentario:</label>
                <textarea
                  value={comentarioEstado}
                  onChange={(e) => setComentarioEstado(e.target.value)}
                  style={{ ...inputStyle, height: "80px" }}
                  placeholder="Escriba un comentario"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button onClick={() => setShowModalEstado(false)} style={btnGray}>Cancelar</button>
                <button onClick={handleGuardarEstado} style={btnYellow}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Estilos --- */
const modalOverlay: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
};

const modalBox: React.CSSProperties = {
  background: "#2d2d2d",
  padding: "2rem",
  borderRadius: "12px",
  width: "400px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  color: "#fff"
};

const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.3rem", fontWeight: "bold" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" };
const btnGray: React.CSSProperties = { padding: "0.5rem 1rem", borderRadius: "6px", background: "#6c757d", color: "#fff", border: "none", cursor: "pointer" };
const btnYellow: React.CSSProperties = { padding: "0.5rem 1rem", borderRadius: "6px", background: "#ffc107", color: "#333", border: "none", cursor: "pointer" };
