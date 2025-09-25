// src/pages/DetalleCaso.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  sla?: any;
  historial?: Historial[];
}

export default function DetalleCaso() {
  const location = useLocation();
  const casoDesdeState = location.state?.caso;

  const [caso, setCaso] = useState<CasoDetalle | null>(
    casoDesdeState || null
  );

  useEffect(() => {
    if (!casoDesdeState) {
      const data = localStorage.getItem("casoDetalle");
      if (data) setCaso(JSON.parse(data));
    } else {
      setCaso(casoDesdeState);
    }
  }, [casoDesdeState]);

  if (!caso) {
    return <p>Cargando caso...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Detalle del Caso #{caso.id_caso}</h2>
      <div style={{ marginBottom: "1.5rem" }}>
        <strong>Título:</strong> {caso.titulo} <br />
        <strong>Descripción:</strong> {caso.descripcion} <br />
        <strong>Empleado:</strong> {caso.empleado || "N/A"} <br />
        <strong>Tipo de incidencia:</strong> {caso.tipo_incidencia || "N/A"} <br />
        <strong>Prioridad:</strong> {caso.prioridad || "N/A"} <br />
        <strong>Fecha de creación:</strong>{" "}
        {caso.fecha_creacion
          ? new Date(caso.fecha_creacion).toLocaleString()
          : "N/A"}{" "}
        <br />
      </div>

      <h3>Historial</h3>
      {caso.historial && caso.historial.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>ID</th>
              <th>Fecha</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Empleado</th>
            </tr>
          </thead>
          <tbody>
            {caso.historial.map((h) => (
              <tr key={h.id_historial} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{h.id_historial}</td>
                <td>{new Date(h.fecha).toLocaleString()}</td>
                <td>{h.comentario}</td>
                <td>{h.estado}</td>
                <td>{h.empleado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay historial disponible.</p>
      )}
    </div>
  );
}
