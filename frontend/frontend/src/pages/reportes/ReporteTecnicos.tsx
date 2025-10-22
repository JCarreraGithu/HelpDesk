import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TecnicoResumen {
  tecnico: string;
  total_casos?: number;
  promedio_segundos?: number;
}

interface TecnicoDetalle {
  id_caso: number;
  titulo: string;
  tecnico: string;
  empleado: string;
  estado: string;
  prioridad: string;
  fecha_creacion: string;
  fecha_cierre: string | null;
}

export default function ReporteTecnicos() {
  const [tipoReporte, setTipoReporte] = useState("por_casos");
  const [intervalo, setIntervalo] = useState("30d");
  const [resumen, setResumen] = useState<TecnicoResumen[]>([]);
  const [detalles, setDetalles] = useState<TecnicoDetalle[]>([]);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  // 🔹 Calcular rango de fechas
  const calcularFechas = () => {
    const fin = new Date();
    const inicio = new Date(fin);
    const map: any = { "7d": 7, "15d": 15, "30d": 30, "90d": 90, "1y": 365 };
    inicio.setDate(fin.getDate() - (map[intervalo] || 30));
    const f = (d: Date) => d.toISOString().split("T")[0];
    return { inicio: f(inicio), fin: f(fin) };
  };

  // 🔹 Formato legible de tiempo (segundos → h/m)
  const formatoTiempo = (segundos: number) => {
    if (!segundos || segundos <= 0) return "0s";
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  // 🔹 Diferencia entre fechas
  const calcularDiferenciaSegundos = (inicio: string, fin: string | null) => {
    if (!fin) return 0;
    const fechaInicio = new Date(inicio).getTime();
    const fechaFin = new Date(fin).getTime();
    return Math.max(0, (fechaFin - fechaInicio) / 1000);
  };

  // 🔹 Obtener datos
  const obtenerDatos = async () => {
    const { inicio, fin } = calcularFechas();

    const res = await fetch("http://localhost:4000/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria: "tecnicos",
        tipo_reporte: tipoReporte,
        fecha_inicio: inicio,
        fecha_fin: fin,
      }),
    });

    const json = await res.json();
    if (json.ok) {
      setResumen(json.data);

      const det = await fetch("http://localhost:4000/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria: "tecnicos",
          tipo_reporte: "por_casos",
          fecha_inicio: inicio,
          fecha_fin: fin,
        }),
      });
      const detJson = await det.json();
      if (detJson.ok) setDetalles(detJson.data);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [tipoReporte, intervalo]);

  // 🔹 PDF (no tocado)
  const exportarPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 170, 10, 25, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(25, 135, 84);
    doc.text("Reporte de Técnicos - HelpDesk", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Tipo de reporte: ${tipoReporte}`, 14, 28);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 33);
    doc.setDrawColor(25, 135, 84);
    doc.line(10, 38, 200, 38);

    let y = 45;

    const agrupado: Record<string, TecnicoDetalle[]> = {};
    detalles.forEach((fila) => {
      const tecnico = fila.tecnico || "Sin técnico";
      if (!agrupado[tecnico]) agrupado[tecnico] = [];
      agrupado[tecnico].push(fila);
    });

    for (const [tecnico, casos] of Object.entries(agrupado)) {
      doc.setFillColor(25, 135, 84);
      doc.rect(10, y - 4, 190, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(tecnico.toUpperCase(), 14, y + 1);
      y += 8;

      autoTable(doc, {
        startY: y,
        head: [["ID", "Título", "Empleado", "Estado", "Prioridad", "Creación", "Cierre", "Tiempo"]],
        body: casos.map((c) => [
          c.id_caso,
          c.titulo,
          c.empleado,
          c.estado,
          c.prioridad,
          c.fecha_creacion,
          c.fecha_cierre || "-",
          c.fecha_cierre
            ? formatoTiempo(calcularDiferenciaSegundos(c.fecha_creacion, c.fecha_cierre))
            : "-",
        ]),
        styles: { fontSize: 8, halign: "center", valign: "middle" },
        headStyles: { fillColor: [25, 135, 84], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        theme: "grid",
        margin: { left: 10, right: 10 },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`Reporte_Tecnicos_${tipoReporte}.pdf`);
  };

  const toggleExpandir = (tecnico: string) => {
    setExpandido((prev) => ({
      ...prev,
      [tecnico]: !prev[tecnico],
    }));
  };

  // 🔹 Render principal (la gráfica se mantiene igual)
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">📈 Reporte Detallado - Técnicos</h3>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/dashboard/reportes")}
        >
          ⬅ Volver a Reportes
        </button>
      </div>

      {/* 🔸 Filtros */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label fw-bold">Tipo de reporte:</label>
            <select
              className="form-select"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
            >
              <option value="por_casos">Casos por Técnico</option>
              <option value="por_promedio">Promedio de Resolución</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Intervalo:</label>
            <select
              className="form-select"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
            >
              <option value="7d">Últimos 7 días</option>
              <option value="15d">Últimos 15 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-success w-100" onClick={exportarPDF}>
              📄 Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Gráfica (idéntica a tu versión original) */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="text-center fw-bold mb-3">
          {tipoReporte === "por_promedio"
            ? "Promedio de resolución por técnico"
            : "Casos por técnico"}
        </h5>

        {(() => {
          const grouped = resumen.reduce((acc, item) => {
            const tecnico = item.tecnico || "Sin técnico";
            if (!acc[tecnico]) acc[tecnico] = { tecnico, total_casos: 0, promedio_segundos: 0 };
            if (tipoReporte === "por_casos") acc[tecnico].total_casos++;
            if (tipoReporte === "por_promedio" && item.promedio_segundos)
              acc[tecnico].promedio_segundos = item.promedio_segundos;
            return acc;
          }, {} as Record<string, TecnicoResumen>);

          const data = Object.values(grouped).sort((a, b) =>
            tipoReporte === "por_promedio"
              ? a.promedio_segundos - b.promedio_segundos
              : b.total_casos - a.total_casos
          );

          return (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tecnico" />
                <YAxis
                  label={{
                    value:
                      tipoReporte === "por_promedio"
                        ? "Tiempo promedio (segundos)"
                        : "Cantidad de casos",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) =>
                    tipoReporte === "por_promedio"
                      ? formatoTiempo(value)
                      : `${value} caso${value !== 1 ? "s" : ""}`
                  }
                />
                <Legend />
                <Bar
                  dataKey={tipoReporte === "por_promedio" ? "promedio_segundos" : "total_casos"}
                  fill="#198754"
                  name={
                    tipoReporte === "por_promedio"
                      ? "Tiempo promedio"
                      : "Total de casos"
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          );
        })()}
      </div>

      {/* 🔹 Tabla agrupada por técnico */}
      <div className="table-responsive shadow-sm">
        {(() => {
          const agrupado: Record<string, TecnicoDetalle[]> = {};
          detalles.forEach((fila) => {
            const tecnico = fila.tecnico || "Sin técnico";
            if (!agrupado[tecnico]) agrupado[tecnico] = [];
            agrupado[tecnico].push(fila);
          });

          return Object.entries(agrupado).map(([tecnico, casos]) => {
            const visible = expandido[tecnico] ? casos : casos.slice(0, 5);

            return (
              <div key={tecnico} className="mb-4 border rounded">
                <div className="bg-success text-white fw-bold p-2 px-3 rounded-top d-flex justify-content-between align-items-center">
                  <span>{tecnico.toUpperCase()}</span>
                  {casos.length > 5 && (
                    <button
                      className="btn btn-light btn-sm text-success fw-bold"
                      onClick={() => toggleExpandir(tecnico)}
                    >
                      {expandido[tecnico] ? "▲ Mostrar menos" : "▼ Mostrar más"}
                    </button>
                  )}
                </div>

                <table className="table table-bordered table-striped text-center align-middle mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Empleado</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Fecha Creación</th>
                      <th>Fecha Cierre</th>
                      <th>Tiempo Resolución</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((fila) => {
                      const segundos = calcularDiferenciaSegundos(
                        fila.fecha_creacion,
                        fila.fecha_cierre
                      );
                      return (
                        <tr key={fila.id_caso}>
                          <td>{fila.id_caso}</td>
                          <td>{fila.titulo}</td>
                          <td>{fila.empleado}</td>
                          <td>{fila.estado}</td>
                          <td>{fila.prioridad}</td>
                          <td>{fila.fecha_creacion}</td>
                          <td>{fila.fecha_cierre || "-"}</td>
                          <td>
                            {fila.fecha_cierre
                              ? formatoTiempo(segundos)
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
