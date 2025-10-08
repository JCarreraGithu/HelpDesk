import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Swal from "sweetalert2";

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: string;
}

interface ModalCerrarCasoProps {
  idCaso: number;
  idEmpleado: number;
  estadoActual: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCerrarCaso({
  idCaso,
  idEmpleado,
  estadoActual,
  onClose,
  onSuccess,
}: ModalCerrarCasoProps) {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [seleccionados, setSeleccionados] = useState<{ id_repuesto: number; cantidad: number }[]>([]);
  const [detalles, setDetalles] = useState("");
  const [complicacion, setComplicacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [repuestosOpen, setRepuestosOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/repuestos")
      .then((res) => setRepuestos(res.data))
      .catch(() => setErrorMsg("No se pudieron cargar los repuestos"));
  }, []);

  const toggleRepuesto = (id: number) => {
    const existe = seleccionados.find((r) => r.id_repuesto === id);
    if (existe) {
      setSeleccionados(seleccionados.filter((r) => r.id_repuesto !== id));
    } else {
      setSeleccionados([...seleccionados, { id_repuesto: id, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    setSeleccionados((prev) =>
      prev.map((r) => (r.id_repuesto === id ? { ...r, cantidad } : r))
    );
  };

  const handleCerrarCaso = async () => {
    if (estadoActual === "Cerrado") {
      setErrorMsg("Este caso ya está cerrado");
      return;
    }

    if (!detalles.trim()) {
      setErrorMsg("Debes escribir los detalles de la solución");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      await axios.put(`http://localhost:4000/api/casos/cerrar/${idCaso}`, {
        id_empleado: idEmpleado,
        detalles,
        complicacion,
        materiales: seleccionados,
      });

      setExito(true);
      onSuccess();
    } catch (error) {
      console.error(error);
      setErrorMsg("No se pudo cerrar el caso");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #198754",
    fontSize: "0.9rem",
    backgroundColor: "#3b3b3b",
    color: "white",
    width: "100%",
    boxShadow: "0 0 6px rgba(25,135,84,0.3)",
    outline: "none",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        style={{
          background: "#2d2d2d",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          padding: "1.5rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {!exito ? (
          <>
            <h2 style={{ color: "#198754", textAlign: "center", fontSize: "1.5rem", fontWeight: "600" }}>
              Cerrar Caso #{idCaso}
            </h2>

            {errorMsg && (
              <div
                style={{
                  background: "#721c24",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Detalles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ color: "white", fontWeight: "bold" }}>Detalles de la solución</label>
              <textarea
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }}
                placeholder="Describe la solución del caso..."
              />
            </div>

            {/* Complicaciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ color: "white", fontWeight: "bold" }}>Complicaciones (opcional)</label>
              <textarea
                value={complicacion}
                onChange={(e) => setComplicacion(e.target.value)}
                style={{ ...inputStyle, resize: "vertical", minHeight: "50px" }}
                placeholder="Describe complicaciones si hubo..."
              />
            </div>

            {/* Repuestos */}
            <div>
              <button
                onClick={() => setRepuestosOpen(!repuestosOpen)}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#383838",
                  color: "white",
                }}
              >
                Repuestos utilizados {repuestosOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {repuestosOpen && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    border: "1px solid #555",
                    borderRadius: "8px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "#3b3b3b",
                    padding: "0.5rem",
                  }}
                >
                  {repuestos.map((r) => {
                    const seleccionado = seleccionados.find((s) => s.id_repuesto === r.id_repuesto);
                    return (
                      <div
                        key={r.id_repuesto}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.3rem 0.5rem",
                          borderBottom: "1px solid #555",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                              type="checkbox"
                              checked={!!seleccionado}
                              onChange={() => toggleRepuesto(r.id_repuesto)}
                            />
                            <span style={{ color: "white", fontWeight: "500" }}>{r.nombre}</span>
                          </div>
                          <span style={{ fontSize: "0.8rem", color: "#aaa" }}>
                            {r.descripcion} | Stock: {r.stock}
                          </span>
                        </div>
                        {seleccionado && (
                          <input
                            type="number"
                            min={1}
                            value={seleccionado.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(r.id_repuesto, Number(e.target.value))
                            }
                            style={{
                              width: "50px",
                              borderRadius: "6px",
                              border: "1px solid #198754",
                              textAlign: "center",
                              background: "#2d2d2d",
                              color: "white",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Botones */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                onClick={onClose}
                style={{ ...buttonStyle, background: "#6c757d", color: "white" }}
              >
                Cancelar
              </button>
             <button
  onClick={estadoActual === "Cerrado" ? undefined : handleCerrarCaso}
  style={{
    ...buttonStyle,
    background: "#198754",
    color: "white",
    cursor: estadoActual === "Cerrado" ? "not-allowed" : "pointer",
    opacity: estadoActual === "Cerrado" ? 0.6 : 1,
  }}
>
  {estadoActual === "Cerrado" ? "El caso ya está cerrado" : loading ? "Cerrando..." : "Cerrar Caso"}
</button>

            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#28a745" }}>✅ Caso cerrado correctamente</h2>
            <p style={{ marginTop: "1rem" }}>El caso #{idCaso} ha sido cerrado y registrado en el historial.</p>
            <button
              onClick={onClose}
              style={{ ...buttonStyle, marginTop: "1rem", background: "#198754", color: "white" }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
