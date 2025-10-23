import { useEffect, useState } from "react";
import axios from "axios";

interface GestionRepuestosProps {
  idCaso: number;
  idEmpleado: number;
  onClose: () => void;
  onSolicitudesChange: (items: SolicitudItem[]) => void;
}

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: number;
}

interface SolicitudItem {
  id_repuesto: number;
  cantidad: number;
  comentario: string;
}

const GestionRepuestos: React.FC<GestionRepuestosProps> = ({
  idCaso,
  idEmpleado,
  onClose,
  onSolicitudesChange
}) => {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [solicitudes, setSolicitudes] = useState<SolicitudItem[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/repuestos");
        setRepuestos(res.data);
      } catch (error) {
        console.error("Error al cargar repuestos:", error);
      }
    };
    cargar();
  }, []);

  const handleAgregar = () => {
    if (!repuestoSeleccionado || cantidad <= 0) return;

    const nuevaLista = [
      ...solicitudes,
      {
        id_repuesto: repuestoSeleccionado,
        cantidad,
        comentario: ""
      }
    ];

    setSolicitudes(nuevaLista);
    onSolicitudesChange(nuevaLista);

    setRepuestoSeleccionado(null);
    setCantidad(1);
  };

  const handleEliminar = (index: number) => {
    const copia = [...solicitudes];
    copia.splice(index, 1);
    setSolicitudes(copia);
    onSolicitudesChange(copia);
  };

  const handleComentarioChange = (index: number, texto: string) => {
    const copia = [...solicitudes];
    copia[index].comentario = texto;
    setSolicitudes(copia);
    onSolicitudesChange(copia);
  };

  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #198754",
    backgroundColor: "#2d2d2d",
    color: "#fff",
    outline: "none",
    width: "100%",
    fontSize: "0.9rem"
  };

  const selectStyle = {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #0dcaf0",
    backgroundColor: "#2d2d2d",
    color: "#fff",
    outline: "none",
    width: "100%",
    fontSize: "0.9rem",
    cursor: "pointer"
  };

  return (
    <div>
      <h2 style={{ color: "#198754", fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>
        🧰 Solicitud de Repuestos
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <select
          value={repuestoSeleccionado ?? ""}
          onChange={(e) => setRepuestoSeleccionado(Number(e.target.value))}
          style={selectStyle}
        >
          <option value="">-- Selecciona un repuesto --</option>
          {repuestos.map((r) => (
            <option key={r.id_repuesto} value={r.id_repuesto}>
              {r.nombre} (Stock: {r.stock})
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          placeholder="Cantidad requerida"
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleAgregar}
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "1rem"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0b5ed7")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d6efd")}
      >
        Añadir repuesto
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
        {solicitudes.map((item, index) => {
          const repuesto = repuestos.find((r) => r.id_repuesto === item.id_repuesto);
          const excedido = item.cantidad > (repuesto?.stock ?? 0);

          return (
            <div key={index} style={{
              position: "relative",
              border: "1px solid #198754",
              borderRadius: "12px",
              padding: "1rem",
              backgroundColor: "#2d2d2d",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}>
              <button
                onClick={() => handleEliminar(index)}
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  color: "#ff4d4f",
                  background: "transparent",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{repuesto?.nombre}</h4>
              <p style={{ fontSize: "0.9rem" }}>Cantidad solicitada: {item.cantidad}</p>
              <p style={{ fontSize: "0.9rem" }}>Stock disponible: {repuesto?.stock}</p>

              <textarea
                style={{
                  marginTop: "0.5rem",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #198754",
                  backgroundColor: "#2d2d2d",
                  color: "#fff",
                  padding: "0.5rem",
                  fontSize: "0.85rem",
                  resize: "none"
                }}
                placeholder="Comentario (opcional)"
                value={item.comentario}
                onChange={(e) => handleComentarioChange(index, e.target.value)}
              />

              {excedido && (
                <p style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#fff3cd",
                  color: "#856404",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "0.85rem"
                }}>
                  ⚠️ La cantidad excede el stock disponible. Se generará solicitud especial.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GestionRepuestos;