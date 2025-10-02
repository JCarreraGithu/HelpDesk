import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

interface Historial {
  id_historial: number;
  fecha: string;
  comentario: string;
  estado: string;
  empleado: string;
}

interface Caso {
  id_caso: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estado_actual: string;
  empleado: string;
  tecnico?: string | null;
  tipo_incidencia: string;
  fecha_creacion: string;
  incidencia?: string | null;
  historial?: Historial[];
}

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: string;
}

interface Tecnico {
  id_empleado: number;
  nombre: string;
  apellido: string;
}

export default function VerCasos() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [casoActivo, setCasoActivo] = useState<Caso | null>(null);
  const [mostrarFormularioFinalizar, setMostrarFormularioFinalizar] = useState(false);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<{ repuesto: Repuesto; cantidad: number }[]>([]);
  const [complicacion, setComplicacion] = useState("");
  const [detalles, setDetalles] = useState("");
  const [repuestosDisponibles, setRepuestosDisponibles] = useState<Repuesto[]>([]);
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState<Tecnico[]>([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | "">("");

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/casos");
        setCasos(res.data);
      } catch (error) {
        console.error("Error cargando casos:", error);
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

    const fetchTecnicos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/empleados/tecnicos");
        setTecnicosDisponibles(res.data);
      } catch (error) {
        console.error("Error cargando técnicos:", error);
      }
    };

    fetchCasos();
    fetchRepuestos();
    fetchTecnicos();
  }, []);

  const abrirModal = async (caso: Caso) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/casos/id/${caso.id_caso}`);
      setCasoActivo(res.data);
    } catch (error) {
      console.error("Error cargando detalle de caso:", error);
      setCasoActivo(caso);
    }
    setMostrarFormularioFinalizar(false);
    setMaterialesSeleccionados([]);
    setComplicacion("");
    setDetalles("");
    setTecnicoSeleccionado("");
  };

  const cerrarModal = () => setCasoActivo(null);

  const toggleMaterial = (repuesto: Repuesto) => {
    const existe = materialesSeleccionados.find((m) => m.repuesto.id_repuesto === repuesto.id_repuesto);
    if (existe) {
      setMaterialesSeleccionados(materialesSeleccionados.filter((m) => m.repuesto.id_repuesto !== repuesto.id_repuesto));
    } else {
      setMaterialesSeleccionados([...materialesSeleccionados, { repuesto, cantidad: 1 }]);
    }
  };

  const limpiarLista = () => setMaterialesSeleccionados([]);

  const actualizarCantidad = (id: number, cantidad: number) => {
    setMaterialesSeleccionados(prev =>
      prev.map(m => m.repuesto.id_repuesto === id ? { ...m, cantidad } : m)
    );
  };

  const aplicarFinalizacion = async () => {
    if (!casoActivo) return;

    try {
      await axios.put(`http://localhost:4000/api/casos/cerrar/${casoActivo.id_caso}`, {
        id_empleado: 2, // ID del usuario logueado
        detalles,
        complicacion,
        materiales: materialesSeleccionados.map(m => ({
          id_repuesto: m.repuesto.id_repuesto,
          cantidad: m.cantidad
        }))
      });

      setCasos(prev =>
        prev.map(c =>
          c.id_caso === casoActivo.id_caso ? { ...c, estado_actual: "Finalizado" } : c
        )
      );

      cerrarModal();
    } catch (error) {
      console.error("Error cerrando caso:", error);
      alert("No se pudo cerrar el caso. Intenta de nuevo.");
    }
  };

  const asignarTecnico = async () => {
    if (!casoActivo || tecnicoSeleccionado === "") {
      alert("Selecciona un técnico antes de asignar.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/casos/asignar-tecnico/${casoActivo.id_caso}`,
        { id_tecnico: Number(tecnicoSeleccionado) }
      );

      alert("✅ Técnico asignado correctamente");

      // Aquí usamos la ruta correcta para buscar por ID
      const casoActualizado = await axios.get(
        `http://localhost:4000/api/casos/id/${casoActivo.id_caso}`
      );
      setCasoActivo(casoActualizado.data);
      setCasos(prev =>
        prev.map(c => c.id_caso === casoActualizado.data.id_caso ? casoActualizado.data : c)
      );
      setTecnicoSeleccionado("");
    } catch (error: any) {
      console.error("Error asignando técnico:", error);
      alert("❌ No se pudo asignar el técnico. Revisa la consola.");
    }
  };

  return (
    <div style={{ background:"#D3D3D3", padding: "2rem", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#198754" }}>Listado de Casos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", backgroundColor: "#808080" }}>
        <thead style={{ backgroundColor: "#d9ebe3" }}>
          <tr>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Título</th>
            <th style={{ padding: "12px" }}>Prioridad</th>
            <th style={{ padding: "12px" }}>Estado</th>
            <th style={{ padding: "12px" }}>Técnico</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={caso.id_caso} style={{ backgroundColor: caso.estado_actual === "Finalizado" ? "#e6f4ea" : "#f9f9f9" }}>
              <td style={{ padding: "10px" }}>{caso.id_caso}</td>
              <td style={{ padding: "10px", color: "#0d6efd", cursor: "pointer" }} onClick={() => abrirModal(caso)}>
                {caso.titulo}
              </td>
              <td style={{ padding: "10px" }}>{caso.prioridad}</td>
              <td style={{ padding: "10px" }}>{caso.estado_actual}</td>
              <td style={{ padding: "10px" }}>{caso.tecnico || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {casoActivo && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "12px",
            width: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", position: "relative"
          }}>
            <button onClick={cerrarModal} style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#198754"
            }}>
              <FaArrowLeft />
            </button>

            <h3 style={{ color: "#198754" }}>📝 Detalle del Caso #{casoActivo.id_caso}</h3>
            <p><strong>📌 Título:</strong> {casoActivo.titulo}</p>
            <p><strong>🧾 Descripción:</strong> {casoActivo.descripcion}</p>
            <p><strong>👤 Empleado:</strong> {casoActivo.empleado}</p>
            <p><strong>⚠️ Prioridad:</strong> {casoActivo.prioridad}</p>
            <p><strong>📍 Estado actual:</strong> {casoActivo.estado_actual}</p>
            <p><strong>🗂️ Tipo de incidencia:</strong> {casoActivo.tipo_incidencia}</p>
            <p><strong>👷 Técnico asignado:</strong> {casoActivo.tecnico || "—"}</p>
            <p><strong>🕒 Fecha de creación:</strong> {new Date(casoActivo.fecha_creacion).toLocaleString()}</p>
            {casoActivo.incidencia && <p><strong>🔎 Incidencia:</strong> {casoActivo.incidencia}</p>}

            {/* Historial */}
            <h4 style={{ marginTop: "1.5rem", color: "#198754" }}>📜 Historial</h4>
            {casoActivo.historial && casoActivo.historial.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
                <thead style={{ backgroundColor: "#d9ebe3" }}>
                  <tr>
                    <th style={{ padding: "8px" }}>ID</th>
                    <th style={{ padding: "8px" }}>Fecha</th>
                    <th style={{ padding: "8px" }}>Comentario</th>
                    <th style={{ padding: "8px" }}>Estado</th>
                    <th style={{ padding: "8px" }}>Empleado</th>
                  </tr>
                </thead>
                <tbody>
                  {casoActivo.historial.map((h) => (
                    <tr key={h.id_historial} style={{ backgroundColor: "#f9f9f9" }}>
                      <td style={{ padding: "8px" }}>{h.id_historial}</td>
                      <td style={{ padding: "8px" }}>{new Date(h.fecha).toLocaleString()}</td>
                      <td style={{ padding: "8px" }}>{h.comentario}</td>
                      <td style={{ padding: "8px" }}>{h.estado}</td>
                      <td style={{ padding: "8px" }}>{h.empleado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay historial disponible.</p>
            )}

            {/* Asignar técnico */}
            {casoActivo.estado_actual !== "Finalizado" && (
              <div style={{ marginTop: "1rem" }}>
                <h4 style={{ color: "#198754", marginBottom: "0.5rem" }}>👷‍♂️ Asignar técnico</h4>
                <select
                  value={tecnicoSeleccionado}
                  onChange={e => setTecnicoSeleccionado(e.target.value ? parseInt(e.target.value) : "")}
                  style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
                >
                  <option value="">Seleccionar técnico</option>
                  {tecnicosDisponibles.map(t => (
                    <option key={t.id_empleado} value={t.id_empleado}>
                      {t.nombre} {t.apellido}
                    </option>
                  ))}
                </select>
                <button
                  onClick={asignarTecnico}
                  style={{
                    backgroundColor: "#198754",
                    color: "#fff",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ✅ Asignar Técnico
                </button>
              </div>
            )}

            {/* Botón cerrar caso */}
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                onClick={() => { if (casoActivo.estado_actual !== "Finalizado") setMostrarFormularioFinalizar(true); }}
                disabled={casoActivo.estado_actual === "Finalizado"}
                style={{
                  backgroundColor: casoActivo.estado_actual === "Finalizado" ? "#6c757d" : "#0d6efd",
                  color: "#fff",
                  padding: "0.6rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: casoActivo.estado_actual === "Finalizado" ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                }}
              >
                {casoActivo.estado_actual === "Finalizado" ? "Caso Cerrado" : "🔄 Cerrar Caso"}
              </button>
            </div>

            {/* Formulario finalización */}
            {mostrarFormularioFinalizar && casoActivo.estado_actual !== "Finalizado" && (
              <div style={{ marginTop: "2rem", backgroundColor: "#eaf4f1", padding: "1rem", borderRadius: "12px" }}>
                <h4 style={{ color: "#198754", marginBottom: "1rem" }}>🛠️ Finalizar caso</h4>
                <label style={{ fontWeight: "bold" }}>🔧 Materiales utilizados:</label>
                <div style={{ marginBottom: "0.5rem" }}>
                  <select onChange={e => {
                    const rep = repuestosDisponibles.find(r => r.id_repuesto === parseInt(e.target.value));
                    if (rep) toggleMaterial(rep);
                  }} style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}>
                    <option value="">Seleccionar repuesto</option>
                    {repuestosDisponibles.map(r => (
                      <option key={r.id_repuesto} value={r.id_repuesto}>
                        {r.nombre} (Stock: {r.stock})
                      </option>
                    ))}
                  </select>
                </div>
                {materialesSeleccionados.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <button onClick={limpiarLista} style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem"
                    }}>🧹 Limpiar lista</button>
                    {materialesSeleccionados.map(m => (
                      <div key={m.repuesto.id_repuesto} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ flex: 1 }}>{m.repuesto.nombre}</span>
                        <input
                          type="number"
                          min={1}
                          value={m.cantidad}
                          onChange={e => actualizarCantidad(m.repuesto.id_repuesto, parseInt(e.target.value))}
                          style={{ width: "60px", marginLeft: "1rem", padding: "0.3rem" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <label style={{ fontWeight: "bold" }}>🧠 ¿Encontraste alguna complicación?</label>
                <textarea value={complicacion} onChange={e => setComplicacion(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "8px", fontSize: "1rem" }} />
                <label style={{ fontWeight: "bold" }}>🗒️ Comentarios adicionales:</label>
                <textarea value={detalles} onChange={e => setDetalles(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "8px", fontSize: "1rem" }} />
                <div style={{ textAlign: "center" }}>
                  <button onClick={aplicarFinalizacion} style={{
                    backgroundColor: "#198754",
                    color: "#fff",
                    padding: "0.6rem 2rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}>
                    💾 Guardar y Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
