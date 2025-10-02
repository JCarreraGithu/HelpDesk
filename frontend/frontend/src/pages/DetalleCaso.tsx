import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaIdBadge, FaExclamationCircle, FaClock, FaTasks, FaTimes } from "react-icons/fa";

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
  tecnico?: string;
  historial?: Historial[];
}

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  stock: number;
}

export default function DetalleCaso() {
  const location = useLocation();
  const navigate = useNavigate();
  const casoDesdeState = location.state?.caso;

  const [caso, setCaso] = useState<CasoDetalle | null>(casoDesdeState || null);
  const [modalTipo, setModalTipo] = useState<"" | "cerrar" | "tecnico" | "estado">("");
  const [detalles, setDetalles] = useState("");
  const [complicacion, setComplicacion] = useState("");
  const [materiales, setMateriales] = useState<{ repuesto: Repuesto; cantidad: number }[]>([]);
  const [repuestosDisponibles, setRepuestosDisponibles] = useState<Repuesto[]>([]);
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState<{id_empleado: number, nombre: string, apellido: string}[]>([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | "">("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<number | "">("");
  const [comentarioTecnico, setComentarioTecnico] = useState("");
  const [comentarioEstado, setComentarioEstado] = useState("");

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogeado") || "{}");

  const estadosDisponibles = [
    { id: 1, nombre: "Abierto" },
    { id: 2, nombre: "En Proceso" },
    { id: 3, nombre: "Esperando Repuesto" },
    { id: 4, nombre: "Finalizado" },
  ];

  useEffect(() => {
    const fetchCaso = async () => {
      if (!casoDesdeState) {
        const data = localStorage.getItem("casoDetalle");
        if (data) {
          const { id_caso } = JSON.parse(data);
          try {
            const res = await axios.get(`http://localhost:4000/api/casos/id/${id_caso}`);
            setCaso(res.data);
          } catch (error) {
            console.error("Error al cargar el caso:", error);
          }
        }
      } else {
        setCaso(casoDesdeState);
      }
    };

    const fetchTecnicos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/empleados/tecnicos");
        setTecnicosDisponibles(res.data);
      } catch (error) {
        console.error("Error cargando técnicos:", error);
      }
    };

    const fetchRepuestos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/repuestos");
        setRepuestosDisponibles(res.data);
      } catch (error) {
        console.error("Error cargando repuestos:", error);
      }
    };

    fetchCaso();
    fetchTecnicos();
    fetchRepuestos();
  }, [casoDesdeState]);

  if (!caso) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando caso...</p>;

  const campos = [
    { label: "Título", value: caso.titulo, icon: <FaTasks />, color: "#d1e7dd" },
    { label: "Empleado", value: caso.empleado || usuarioLogueado.nombre || "N/A", icon: <FaUser />, color: "#cfe2ff" },
    { label: "Técnico asignado", value: caso.tecnico || "N/A", icon: <FaIdBadge />, color: "#ffe5b4" },
    { label: "Tipo de incidencia", value: caso.tipo_incidencia || "N/A", icon: <FaExclamationCircle />, color: "#f8d7da" },
    { label: "Prioridad", value: caso.prioridad || "N/A", icon: <FaClock />, color: "#ffe5b4" },
    { label: "Estado actual", value: caso.estado_actual || "N/A", icon: <FaTasks />, color: "#d1c4e9" },
    { label: "Fecha creación", value: caso.fecha_creacion ? new Date(caso.fecha_creacion).toLocaleString() : "N/A", icon: <FaClock />, color: "#d1c4e9" },
  ];

  // ------------------ FUNCIONES ------------------
  const toggleMaterial = (repuesto: Repuesto) => {
    const existe = materiales.find(m => m.repuesto.id_repuesto === repuesto.id_repuesto);
    if (existe) {
      setMateriales(materiales.filter(m => m.repuesto.id_repuesto !== repuesto.id_repuesto));
    } else {
      setMateriales([...materiales, { repuesto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    setMateriales(prev =>
      prev.map(m => m.repuesto.id_repuesto === id ? { ...m, cantidad } : m)
    );
  };

  const cerrarCaso = async () => {
    try {
      await axios.put(`http://localhost:4000/api/casos/cerrar/${caso.id_caso}`, {
        id_empleado: usuarioLogueado.id_empleado,
        detalles,
        complicacion,
        materiales: materiales.map(m => ({ id_repuesto: m.repuesto.id_repuesto, cantidad: m.cantidad })),
      });

      const res = await axios.get(`http://localhost:4000/api/casos/id/${caso.id_caso}`);
      setCaso(res.data);
      setModalTipo("");
      setDetalles(""); setComplicacion(""); setMateriales([]);
      alert("✅ Caso cerrado correctamente");
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo cerrar el caso");
    }
  };

  const asignarTecnico = async () => {
    if (!tecnicoSeleccionado) { alert("Selecciona un técnico."); return; }

    try {
      await axios.put(`http://localhost:4000/api/casos/asignar-tecnico/${caso.id_caso}`, { 
        id_tecnico: tecnicoSeleccionado,
        comentario: comentarioTecnico
      });

      const res = await axios.get(`http://localhost:4000/api/casos/id/${caso.id_caso}`);
      setCaso(res.data);
      setTecnicoSeleccionado(""); setComentarioTecnico(""); setModalTipo("");
      alert("✅ Técnico asignado y registrado en historial");
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo asignar el técnico");
    }
  };

  const cambiarEstado = async () => {
    if (!estadoSeleccionado) { alert("Selecciona un estado."); return; }

    try {
      await axios.put(`http://localhost:4000/api/casos/${caso.id_caso}`, {
        id_estado_actual: estadoSeleccionado,
        detalles: comentarioEstado || `Cambio de estado a ${estadosDisponibles.find(e => e.id === estadoSeleccionado)?.nombre}`,
        id_empleado: usuarioLogueado.id_empleado
      });

      const res = await axios.get(`http://localhost:4000/api/casos/id/${caso.id_caso}`);
      setCaso(res.data);
      setEstadoSeleccionado(""); setComentarioEstado(""); setModalTipo("");
      alert("✅ Estado actualizado y registrado en historial");
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo actualizar el estado");
    }
  };

  // ------------------ MODAL ------------------
  const Modal = ({ children, onClose }: {children: React.ReactNode, onClose: () => void}) => (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
    }}>
      <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", minWidth: "300px", maxWidth: "500px", width: "90%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", border: "none", background: "transparent", cursor: "pointer" }}>
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1700px", padding: "1rem", backgroundColor: "#C0C0C0", minHeight: "100vh", boxSizing: "border-box" , margin: "0 auto"}}>
      <div style={{ background: "linear-gradient(160deg, #f9fafc, #e6f0eb)", padding: "2rem", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
        
        {/* Título + botones */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>
            {caso.titulo} #{caso.id_caso}
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {caso.estado_actual !== "Finalizado" && (
              <>
                <button onClick={() => setModalTipo("cerrar")} style={{ backgroundColor: "#dc3545", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Cerrar Caso</button>
                <button onClick={() => setModalTipo("tecnico")} style={{ backgroundColor: "#198754", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Asignar Técnico</button>
                <button onClick={() => setModalTipo("estado")} style={{ backgroundColor: "#ffc107", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Cambiar Estado</button>
              </>
            )}
          </div>
        </div>

        {/* Campos del caso */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(200px, 1fr))", gap: "1rem", margin: "0 auto 2rem auto", maxWidth: "800px" }}>
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
                <li key={h.id_historial} style={{ backgroundColor: "#fff", marginBottom: "0.8rem", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>{h.empleado}</div>
                  <div>{h.comentario}</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>{new Date(h.fecha).toLocaleString()}</div>
                  <div style={{ fontSize: "0.85rem", color: "#198754" }}>{h.estado}</div>
                </li>
              ))}
          </ul>
        </div>

        {/* ------------------- MODALES ------------------- */}
        {modalTipo === "cerrar" && (
  <Modal onClose={() => setModalTipo("")}>
    <h4>Cerrar Caso</h4>

    <textarea
      placeholder="Detalles"
      value={detalles}
      onChange={e => setDetalles(e.target.value)}
      style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", marginBottom: "0.5rem" }}
    />

    <textarea
      placeholder="Complicaciones (opcional)"
      value={complicacion}
      onChange={e => setComplicacion(e.target.value)}
      style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", marginBottom: "0.5rem" }}
    />

    <h5>Repuestos usados</h5>
    <div style={{
      maxHeight: "200px",    // altura máxima del scroll
      overflowY: "auto",     // activamos scroll vertical
      border: "1px solid #ccc",
      padding: "0.5rem",
      borderRadius: "8px",
      marginBottom: "0.5rem"
    }}>
      {repuestosDisponibles.map(r => {
        const seleccionado = materiales.find(m => m.repuesto.id_repuesto === r.id_repuesto);
        return (
          <div key={r.id_repuesto} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input type="checkbox" checked={!!seleccionado} onChange={() => toggleMaterial(r)} style={{ marginRight: "0.5rem" }} />
            <span style={{ flex: 1 }}>{r.nombre} (Stock: {r.stock})</span>
            {seleccionado && (
              <input
                type="number"
                min={1}
                value={seleccionado.cantidad}
                onChange={e => actualizarCantidad(r.id_repuesto, parseInt(e.target.value))}
                style={{ width: "60px", marginLeft: "0.5rem" }}
              />
            )}
          </div>
        );
      })}
    </div>

    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
      <button onClick={() => setModalTipo("")} style={{ backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Volver</button>
      <button onClick={cerrarCaso} style={{ backgroundColor: "#dc3545", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Cerrar Caso</button>
    </div>
  </Modal>
)}


        {modalTipo === "tecnico" && (
          <Modal onClose={() => setModalTipo("")}>
            <h4>Asignar Técnico</h4>
            <select value={tecnicoSeleccionado} onChange={e => setTecnicoSeleccionado(Number(e.target.value))} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", marginBottom: "0.5rem" }}>
              <option value="">-- Seleccione un técnico --</option>
              {tecnicosDisponibles.map(t => <option key={t.id_empleado} value={t.id_empleado}>{t.nombre} {t.apellido}</option>)}
            </select>
            <textarea placeholder="Comentario (opcional)" value={comentarioTecnico} onChange={e => setComentarioTecnico(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}/>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button onClick={() => setModalTipo("")} style={{ backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Volver</button>
              <button onClick={asignarTecnico} style={{ backgroundColor: "#198754", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Asignar</button>
            </div>
          </Modal>
        )}

        {modalTipo === "estado" && (
          <Modal onClose={() => setModalTipo("")}>
            <h4>Cambiar Estado</h4>
            <select value={estadoSeleccionado} onChange={e => setEstadoSeleccionado(Number(e.target.value))} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", marginBottom: "0.5rem" }}>
              <option value="">-- Seleccione un estado --</option>
              {estadosDisponibles.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
            <textarea placeholder="Comentario (opcional)" value={comentarioEstado} onChange={e => setComentarioEstado(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}/>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button onClick={() => setModalTipo("")} style={{ backgroundColor: "#6c757d", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Volver</button>
              <button onClick={cambiarEstado} style={{ backgroundColor: "#ffc107", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Actualizar</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
