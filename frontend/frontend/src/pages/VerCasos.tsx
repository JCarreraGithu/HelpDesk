import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaSave } from "react-icons/fa";

interface Caso {
  id_caso: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  empleado: string;
  tipo_incidencia: string;
  fecha_creacion: string;
}

export default function VerCasos() {
  const [casos, setCasos] = useState<Caso[]>([
    {
      id_caso: 101,
      titulo: "Error de inicio de sesión",
      descripcion: "El usuario no puede acceder al sistema con sus credenciales.",
      prioridad: "Alta",
      estado: "Abierto",
      empleado: "Ana Gómez",
      tipo_incidencia: "Software",
      fecha_creacion: "2025-09-25T10:30:00",
    },
    {
      id_caso: 102,
      titulo: "Impresora bloqueada",
      descripcion: "La impresora del área de finanzas no imprime.",
      prioridad: "Media",
      estado: "En proceso",
      empleado: "Luis Pérez",
      tipo_incidencia: "Hardware",
      fecha_creacion: "2025-09-26T09:15:00",
    },
  ]);

  const [casoActivo, setCasoActivo] = useState<Caso | null>(null);
  const [mostrarOpcionesEstado, setMostrarOpcionesEstado] = useState(false);
  const [mostrarFormularioFinalizar, setMostrarFormularioFinalizar] = useState(false);
  const [mostrarFormularioCancelar, setMostrarFormularioCancelar] = useState(false);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<{ nombre: string; cantidad: number }[]>([]);
  const [complicacion, setComplicacion] = useState("");
  const [detalles, setDetalles] = useState("");
  const [razonCancelacion, setRazonCancelacion] = useState("");

  const materialesDisponibles = ["Cable Ethernet", "Teclado", "Mouse", "RAM", "Procesador"];

  const abrirModal = (caso: Caso) => {
    setCasoActivo(caso);
    setMostrarOpcionesEstado(false);
    setMostrarFormularioFinalizar(false);
    setMostrarFormularioCancelar(false);
    setMaterialesSeleccionados([]);
    setComplicacion("");
    setDetalles("");
    setRazonCancelacion("");
  };

  const cerrarModal = () => {
    setCasoActivo(null);
  };

  const toggleMaterial = (nombre: string) => {
    const existe = materialesSeleccionados.find((m) => m.nombre === nombre);
    if (existe) {
      setMaterialesSeleccionados(materialesSeleccionados.filter((m) => m.nombre !== nombre));
    } else {
      setMaterialesSeleccionados([...materialesSeleccionados, { nombre, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (nombre: string, cantidad: number) => {
    setMaterialesSeleccionados((prev) =>
      prev.map((m) => (m.nombre === nombre ? { ...m, cantidad } : m))
    );
  };

  const aplicarFinalizacion = () => {
    if (!casoActivo) return;
    const actualizado = casos.map((c) =>
      c.id_caso === casoActivo.id_caso ? { ...c, estado: "Finalizado" } : c
    );
    setCasos(actualizado);
    cerrarModal();
  };

  const aplicarCancelacion = () => {
    if (!casoActivo) return;
    const actualizado = casos.map((c) =>
      c.id_caso === casoActivo.id_caso ? { ...c, estado: "Cancelado" } : c
    );
    setCasos(updated => actualizado);
    cerrarModal();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#198754" }}>Listado de Casos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <thead style={{ backgroundColor: "#d9ebe3" }}>
          <tr>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Título</th>
            <th style={{ padding: "12px" }}>Prioridad</th>
            <th style={{ padding: "12px" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={caso.id_caso} style={{ backgroundColor: caso.estado === "Finalizado" ? "#e6f4ea" : caso.estado === "Cancelado" ? "#f8d7da" : "white" }}>
              <td style={{ padding: "10px" }}>{caso.id_caso}</td>
              <td style={{ padding: "10px", color: "#0d6efd", cursor: "pointer" }} onClick={() => abrirModal(caso)}>
                {caso.titulo}
              </td>
              <td style={{ padding: "10px" }}>{caso.prioridad}</td>
              <td style={{ padding: "10px" }}>{caso.estado}</td>
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
            <button
              onClick={cerrarModal}
              style={{
                position: "absolute", top: "1rem", right: "1rem",
                background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#198754"
              }}
            >
              <FaArrowLeft />
            </button>

            <h3 style={{ color: "#198754" }}>📝 Detalle del Caso #{casoActivo.id_caso}</h3>
            <p><strong>📌 Título:</strong> {casoActivo.titulo}</p>
            <p><strong>🧾 Descripción:</strong> {casoActivo.descripcion}</p>
            <p><strong>👤 Empleado:</strong> {casoActivo.empleado}</p>
            <p><strong>⚠️ Prioridad:</strong> {casoActivo.prioridad}</p>
            <p><strong>📍 Estado actual:</strong> {casoActivo.estado}</p>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                onClick={() => setMostrarOpcionesEstado(true)}
                style={{
                  backgroundColor: "#0d6efd",
                  color: "#fff",
                  padding: "0.6rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                🔄 Cambiar estado
              </button>
            </div>

            {mostrarOpcionesEstado && (
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button
                  onClick={() => setMostrarFormularioFinalizar(true)}
                  style={{
                    backgroundColor: "#cde4d4",
                    color: "#198754",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  💾 Finalizar
                </button>
                <button
                  onClick={() => setMostrarFormularioCancelar(true)}
                  style={{
                    backgroundColor: "#f8d7da",
                    color: "#dc3545",
                                      padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          )}

          {mostrarFormularioFinalizar && (
            <div style={{ marginTop: "2rem", backgroundColor: "#eaf4f1", padding: "1rem", borderRadius: "12px" }}>
              <h4 style={{ color: "#198754", marginBottom: "1rem" }}>🛠️ Finalizar caso</h4>

              <label style={{ fontWeight: "bold" }}>🔧 Materiales utilizados:</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                {materialesDisponibles.map((nombre) => {
                  const seleccionado = materialesSeleccionados.find((m) => m.nombre === nombre);
                  return (
                    <div key={nombre} style={{ backgroundColor: "#fff", padding: "0.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!seleccionado}
                          onChange={() => toggleMaterial(nombre)}
                        />{" "}
                        {nombre}
                      </label>
                      {seleccionado && (
                        <input
                          type="number"
                          min={1}
                          value={seleccionado.cantidad}
                          onChange={(e) => actualizarCantidad(nombre, parseInt(e.target.value))}
                          style={{ width: "100%", marginTop: "0.5rem", padding: "0.3rem" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <label style={{ fontWeight: "bold" }}>🧠 ¿Encontraste alguna complicación?</label>
              <textarea
                value={complicacion}
                onChange={(e) => setComplicacion(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  backgroundColor: "#d6d8c8ff", // color suave
                  border: "1px solid #ccdb73ff",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />


              <label style={{ fontWeight: "bold" }}>🗒️ ¿Quieres añadir más detalles?</label>
              <textarea
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  backgroundColor: "#d6d8c8ff", // color suave
                  border: "1px solid #ccdb73ff",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />


              <div style={{ textAlign: "center" }}>
                <button
                  onClick={aplicarFinalizacion}
                  style={{
                    backgroundColor: "#198754",
                    color: "#fff",
                    padding: "0.6rem 2rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  💾 Guardar
                </button>
              </div>
            </div>
          )}

          {mostrarFormularioCancelar && (
            <div style={{ marginTop: "2rem", backgroundColor: "#f8d7da", padding: "1rem", borderRadius: "12px" }}>
              <h4 style={{ color: "#dc3545", marginBottom: "1rem" }}>🛑 Cancelar caso</h4>
              <label style={{ fontWeight: "bold" }}>📄 Razón de cancelación:</label>
              <textarea
                value={razonCancelacion}
                onChange={(e) => setRazonCancelacion(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  backgroundColor: "#cfa3a7ff",
                  border: "1px solid #020202ff",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={aplicarCancelacion}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    padding: "0.6rem 2rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ❌ Confirmar cancelación
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