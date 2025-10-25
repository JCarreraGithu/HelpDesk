import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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

interface Encuesta {
  id_encuesta: number;
  id_caso: number;
  usuario_reporta: string;
  calificacion: number;
  calif_tiempo_respuesta: number;
  calif_trato_tecnico: number;
  calif_solucion: number;
  calif_comunicacion: number;
  recomendaria: string;
  comentario: string;
  fecha_respuesta: string;
}

interface Resumen {
  usuario_reporta: string;
  total_encuestas: number;
}

export default function ReporteEncuestas() {
  const [intervalo, setIntervalo] = useState("30d");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [resumen, setResumen] = useState<Resumen[]>([]);
  const [detalles, setDetalles] = useState<Encuesta[]>([]);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  // 🔹 Calcular fechas según selección o intervalo
  const calcularFechas = () => {
    if (fechaSeleccionada) {
      const f = (d: Date) => d.toISOString().split("T")[0];
      const fecha = f(fechaSeleccionada);
      return { inicio: fecha, fin: fecha };
    }

    const fin = new Date();
    const inicio = new Date(fin);
    const map: any = { "7d": 7, "15d": 15, "30d": 30, "90d": 90, "1y": 365 };
    inicio.setDate(fin.getDate() - (map[intervalo] || 30));
    const f = (d: Date) => d.toISOString().split("T")[0];
    return { inicio: f(inicio), fin: f(fin) };
  };

  // 🔹 Obtener datos del backend
  const obtenerDatos = async () => {
    const { inicio, fin } = calcularFechas();

    const res = await fetch("http://localhost:4000/api/reportes/Encuestas/Encuestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo_reporte: "general",
        fecha_inicio: inicio,
        fecha_fin: fin,
      }),
    });

    const json = await res.json();
    if (json.ok) {
      setDetalles(json.data);

      // Agrupar para gráfico
      const conteo: Record<string, number> = {};
      json.data.forEach((c: Encuesta) => {
        const tecnico = c.usuario_reporta || "Sin técnico";
        conteo[tecnico] = (conteo[tecnico] || 0) + 1;
      });

      const resumenData = Object.entries(conteo).map(([usuario_reporta, total_encuestas]) => ({
        usuario_reporta,
        total_encuestas,
      }));

      setResumen(resumenData);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [intervalo, fechaSeleccionada]);

  // 🔹 Exportar PDF
  const exportarPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 170, 10, 25, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(25, 135, 84);
    doc.text("Reporte de Encuestas de Satisfacción - HelpDesk", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);
    doc.setDrawColor(25, 135, 84);
    doc.line(10, 33, 200, 33);

    if (detalles.length > 0) {
      const agrupado: Record<string, Encuesta[]> = {};
      detalles.forEach((fila) => {
        const tecnico = fila.usuario_reporta || "Sin técnico";
        if (!agrupado[tecnico]) agrupado[tecnico] = [];
        agrupado[tecnico].push(fila);
      });

      let y = 40;

      for (const [tecnico, encuestas] of Object.entries(agrupado)) {
        doc.setFillColor(25, 135, 84);
        doc.rect(10, y - 4, 190, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text(tecnico.toUpperCase(), 14, y + 1);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [["ID", "Caso", "Calificación", "Tiempo", "Trato", "Solución", "Comunicación", "Recom.", "Comentario", "Fecha"]],
          body: encuestas.map((e) => [
            e.id_encuesta,
            e.id_caso,
            e.calificacion,
            e.calif_tiempo_respuesta,
            e.calif_trato_tecnico,
            e.calif_solucion,
            e.calif_comunicacion,
            e.recomendaria,
            e.comentario || "-",
            e.fecha_respuesta,
          ]),
          styles: { fontSize: 7, halign: "center", valign: "middle" },
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

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Sistema HelpDesk - Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
      }
    } else {
      doc.setFontSize(12);
      doc.text("No hay encuestas disponibles para este rango de fechas.", 14, 40);
    }

    doc.save(`Reporte_Encuestas.pdf`);
  };

  // 🔹 Exportar Excel
  const exportarExcel = () => {
    if (detalles.length === 0) return;

    const agrupado: Record<string, Encuesta[]> = {};
    detalles.forEach((fila) => {
      const tecnico = fila.usuario_reporta || "Sin técnico";
      if (!agrupado[tecnico]) agrupado[tecnico] = [];
      agrupado[tecnico].push(fila);
    });

    const libro = XLSX.utils.book_new();

    Object.entries(agrupado).forEach(([tecnico, encuestas]) => {
      const datos = [
        [`Reporte de Técnico: ${tecnico}`],
        [`Generado: ${new Date().toLocaleString()}`],
        [],
        ["ID", "Caso", "Calificación", "Tiempo Resp.", "Trato Téc.", "Solución", "Comunicación", "Recomendaria", "Comentario", "Fecha"],
      ];

      encuestas.forEach((e) => {
        datos.push([
          e.id_encuesta,
          e.id_caso,
          e.calificacion,
          e.calif_tiempo_respuesta,
          e.calif_trato_tecnico,
          e.calif_solucion,
          e.calif_comunicacion,
          e.recomendaria,
          e.comentario || "-",
          e.fecha_respuesta,
        ]);
      });

      const hoja = XLSX.utils.aoa_to_sheet(datos);
      hoja["!cols"] = Array(10).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(libro, hoja, tecnico.substring(0, 30));
    });

    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Reporte_Encuestas.xlsx`);
  };

  const toggleExpandir = (tecnico: string) => {
    setExpandido((prev) => ({
      ...prev,
      [tecnico]: !prev[tecnico],
    }));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">🧾 Reporte Detallado - Encuestas de Satisfacción</h3>
        <button className="btn btn-secondary" onClick={() => (window.location.href = "/dashboard/reportes")}>
          ⬅ Volver
        </button>
      </div>

      {/* 🔸 Filtros */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label fw-bold">Intervalo:</label>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select"
                value={intervalo}
                onChange={(e) => {
                  setIntervalo(e.target.value);
                  setFechaSeleccionada(null);
                }}
              >
                <option value="7d">Últimos 7 días</option>
                <option value="15d">Últimos 15 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </select>

              <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => setFechaSeleccionada(date)}
                className="form-control"
                placeholderText="📅"
                dateFormat="yyyy-MM-dd"
                showPopperArrow={false}
                customInput={
                  <button className="btn btn-outline-secondary" title="Seleccionar día">
                    <i className="bi bi-calendar-date"></i>
                  </button>
                }
              />
            </div>
          </div>

          <div className="col-md-4 d-flex align-items-end gap-2">
            <button className="btn btn-success w-50" onClick={exportarPDF}>
              📄 PDF
            </button>
            <button className="btn btn-outline-success w-50" onClick={exportarExcel}>
              🧾 Excel
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Gráfica */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="text-center fw-bold mb-3">Encuestas por técnico</h5>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={resumen}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usuario_reporta" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value} encuesta${value !== 1 ? "s" : ""}`} />
            <Legend />
            <Bar dataKey="total_encuestas" fill="#198754" name="Encuestas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Tabla agrupada */}
      <div className="table-responsive shadow-sm">
        {(() => {
          const agrupado: Record<string, Encuesta[]> = {};
          detalles.forEach((fila) => {
            const tecnico = fila.usuario_reporta || "Sin técnico";
            if (!agrupado[tecnico]) agrupado[tecnico] = [];
            agrupado[tecnico].push(fila);
          });

          return Object.entries(agrupado).map(([tecnico, encuestas]) => {
            const visible = expandido[tecnico] ? encuestas : encuestas.slice(0, 5);

            return (
              <div key={tecnico} className="mb-4 border rounded">
                <div className="bg-success text-white fw-bold p-2 px-3 rounded-top d-flex justify-content-between align-items-center">
                  <span>{tecnico.toUpperCase()}</span>
                  {encuestas.length > 5 && (
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
                      <th>ID Caso</th>
                      <th>Calificación</th>
                      <th>Tiempo Resp.</th>
                      <th>Trato Téc.</th>
                      <th>Solución</th>
                      <th>Comunicación</th>
                      <th>Recomend.</th>
                      <th>Comentario</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((fila) => (
                      <tr key={fila.id_encuesta}>
                        <td>{fila.id_encuesta}</td>
                        <td>{fila.id_caso}</td>
                        <td>{fila.calificacion}</td>
                        <td>{fila.calif_tiempo_respuesta}</td>
                        <td>{fila.calif_trato_tecnico}</td>
                        <td>{fila.calif_solucion}</td>
                        <td>{fila.calif_comunicacion}</td>
                        <td>{fila.recomendaria}</td>
                        <td>{fila.comentario || "-"}</td>
                        <td>{fila.fecha_respuesta}</td>
                      </tr>
                    ))}
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
