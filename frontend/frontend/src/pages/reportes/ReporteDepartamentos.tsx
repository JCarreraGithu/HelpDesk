import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface DepartamentoResumen {
  departamento: string;
  total_casos: number;
}

interface DepartamentoDetalle {
  id_caso: number;
  titulo: string;
  empleado: string;
  departamento: string;
  estado: string;
  prioridad: string;
  fecha_creacion: string;
  fecha_cierre: string | null;
}

export default function ReporteDepartamentos() {
  const [intervalo, setIntervalo] = useState("30d");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [resumen, setResumen] = useState<DepartamentoResumen[]>([]);
  const [detalles, setDetalles] = useState<DepartamentoDetalle[]>([]);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  // 🔹 Calcular fechas según selección
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

    const det = await fetch("http://localhost:4000/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria: "departamentos",
        tipo_reporte: "por_casos",
        fecha_inicio: inicio,
        fecha_fin: fin,
      }),
    });

    const detJson = await det.json();
    if (detJson.ok) {
      setDetalles(detJson.data);

      // Agrupar para gráfico
      const conteo: Record<string, number> = {};
      detJson.data.forEach((c: DepartamentoDetalle) => {
        const dep = c.departamento || "Sin departamento";
        conteo[dep] = (conteo[dep] || 0) + 1;
      });

      const resumenData = Object.entries(conteo).map(([departamento, total_casos]) => ({
        departamento,
        total_casos,
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
    doc.text("Reporte por Departamentos - HelpDesk", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);
    doc.setDrawColor(25, 135, 84);
    doc.line(10, 33, 200, 33);

    if (detalles.length > 0) {
      const agrupado: Record<string, DepartamentoDetalle[]> = {};
      detalles.forEach((fila) => {
        const dep = fila.departamento || "Sin departamento";
        if (!agrupado[dep]) agrupado[dep] = [];
        agrupado[dep].push(fila);
      });

      let y = 40;

      for (const [departamento, casos] of Object.entries(agrupado)) {
        doc.setFillColor(25, 135, 84);
        doc.rect(10, y - 4, 190, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text(departamento.toUpperCase(), 14, y + 1);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [["ID", "Título", "Empleado", "Estado", "Prioridad", "Creación", "Cierre"]],
          body: casos.map((c) => [
            c.id_caso,
            c.titulo,
            c.empleado,
            c.estado,
            c.prioridad,
            c.fecha_creacion,
            c.fecha_cierre || "-",
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

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Sistema HelpDesk - Página ${i} de ${pageCount}`, 105, 290, {
          align: "center",
        });
      }
    } else {
      doc.setFontSize(12);
      doc.text("No hay datos disponibles para este rango de fechas.", 14, 40);
    }

    doc.save(`Reporte_Departamentos.pdf`);
  };

  // 🔹 Exportar Excel
  const exportarExcel = () => {
    if (detalles.length === 0) return;

    const agrupado: Record<string, DepartamentoDetalle[]> = {};
    detalles.forEach((fila) => {
      const dep = fila.departamento || "Sin departamento";
      if (!agrupado[dep]) agrupado[dep] = [];
      agrupado[dep].push(fila);
    });

    const libro = XLSX.utils.book_new();

    Object.entries(agrupado).forEach(([departamento, casos]) => {
      const datos = [
        [`Reporte de Departamento: ${departamento}`],
        [`Generado: ${new Date().toLocaleString()}`],
        [],
        ["ID", "Título", "Empleado", "Estado", "Prioridad", "Fecha Creación", "Fecha Cierre"],
      ];

      casos.forEach((c) => {
        datos.push([
          c.id_caso,
          c.titulo,
          c.empleado,
          c.estado,
          c.prioridad,
          c.fecha_creacion,
          c.fecha_cierre || "-",
        ]);
      });

      const hoja = XLSX.utils.aoa_to_sheet(datos);
      hoja["!cols"] = [
        { wch: 6 },
        { wch: 25 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(libro, hoja, departamento.substring(0, 30));
    });

    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Reporte_Departamentos.xlsx`);
  };

  const toggleExpandir = (departamento: string) => {
    setExpandido((prev) => ({
      ...prev,
      [departamento]: !prev[departamento],
    }));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">🏢 Reporte Detallado - Departamentos</h3>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/dashboard/reportes")}
        >
          ⬅ Volver
        </button>
      </div>

      {/* 🔸 Filtros */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          {/* Menú de intervalo */}
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

              <div className="position-relative">
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
        <h5 className="text-center fw-bold mb-3">Casos por departamento</h5>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={resumen}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="departamento" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value} caso${value !== 1 ? "s" : ""}`} />
            <Legend />
            <Bar dataKey="total_casos" fill="#198754" name="Casos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Tabla agrupada */}
      <div className="table-responsive shadow-sm">
        {(() => {
          const agrupado: Record<string, DepartamentoDetalle[]> = {};
          detalles.forEach((fila) => {
            const dep = fila.departamento || "Sin departamento";
            if (!agrupado[dep]) agrupado[dep] = [];
            agrupado[dep].push(fila);
          });

          return Object.entries(agrupado).map(([departamento, casos]) => {
            const visible = expandido[departamento] ? casos : casos.slice(0, 5);

            return (
              <div key={departamento} className="mb-4 border rounded">
                <div className="bg-success text-white fw-bold p-2 px-3 rounded-top d-flex justify-content-between align-items-center">
                  <span>{departamento.toUpperCase()}</span>
                  {casos.length > 5 && (
                    <button
                      className="btn btn-light btn-sm text-success fw-bold"
                      onClick={() => toggleExpandir(departamento)}
                    >
                      {expandido[departamento] ? "▲ Mostrar menos" : "▼ Mostrar más"}
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
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((fila) => (
                      <tr key={fila.id_caso}>
                        <td>{fila.id_caso}</td>
                        <td>{fila.titulo}</td>
                        <td>{fila.empleado}</td>
                        <td>{fila.estado}</td>
                        <td>{fila.prioridad}</td>
                        <td>{fila.fecha_creacion}</td>
                        <td>{fila.fecha_cierre || "-"}</td>
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
