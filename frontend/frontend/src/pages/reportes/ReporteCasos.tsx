import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Caso {
  id_caso: number;
  titulo: string;
  tecnico: string;
  empleado: string;
  estado: string;
  prioridad: string;
  tipo?: string;
  fecha_creacion: string;
  fecha_cierre: string | null;
}

interface Opcion {
  nombre: string;
}

export default function ReporteCasos() {
  const [tipoReporte, setTipoReporte] = useState("totales");
  const [filtro, setFiltro] = useState<string | null>(null);
  const [intervalo, setIntervalo] = useState("30d");
  const [casos, setCasos] = useState<Caso[]>([]);
  const [opcionesFiltro, setOpcionesFiltro] = useState<Opcion[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const colores = ["#2563eb", "#16a34a", "#dc2626", "#facc15", "#9333ea", "#14b8a6", "#f97316"];

  // 🔹 Calcular rango de fechas
  const getFechas = () => {
    const fin = new Date();
    const inicio = new Date(fin);
    const map: any = { "7d": 7, "15d": 15, "30d": 30, "90d": 90, "1y": 365 };
    inicio.setDate(fin.getDate() - (map[intervalo] || 30));
    const format = (d: Date) => d.toISOString().split("T")[0];
    return { inicio: format(inicio), fin: format(fin) };
  };

  // 🔹 Obtener datos del reporte
  const obtenerDatos = async () => {
    const { inicio, fin } = getFechas();
    const body = {
      categoria: "casos",
      tipo_reporte: tipoReporte,
      p_filtro: filtro,
      fecha_inicio: inicio,
      fecha_fin: fin,
    };
    const res = await fetch("http://localhost:4000/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.ok) setCasos(json.data || []);
  };

  // 🔹 Obtener opciones de filtro
  const obtenerOpcionesFiltro = async () => {
    let url = "";
    if (tipoReporte === "por_prioridad")
      url = "http://localhost:4000/api/config/prioridades";
    else if (tipoReporte === "por_estado")
      url = "http://localhost:4000/api/config/estados-caso";
    else if (tipoReporte === "por_tipo")
      url = "http://localhost:4000/api/config/tipos-incidencia";
    else {
      setOpcionesFiltro([]);
      return;
    }

    try {
      const res = await fetch(url);
      const json = await res.json();
      const datos = Array.isArray(json) ? json : json.data || [];
      const opciones = datos.map((item: any) => ({
        nombre:
          item.NOMBRE ||
          item.nombre ||
          item.tipo ||
          item.TIPO ||
          item.estado ||
          item.ESTADO,
      }));
      setOpcionesFiltro(opciones);
    } catch (err) {
      console.error("Error cargando opciones:", err);
      setOpcionesFiltro([]);
    }
  };

  useEffect(() => {
    obtenerOpcionesFiltro();
  }, [tipoReporte]);

  useEffect(() => {
    obtenerDatos();
  }, [tipoReporte, filtro, intervalo]);

  // 🔹 Exportar PDF con estilo HelpDesk
  const exportarPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const logoPath = logo;

    try {
      const img = new Image();
      img.src = logoPath;
      doc.addImage(img, "PNG", 170, 10, 25, 25);
    } catch (err) {
      console.warn("⚠️ No se pudo cargar el logo:", err);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(25, 135, 84);
    doc.text("Reporte de Casos - HelpDesk", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Tipo de reporte: ${tipoReporte}`, 14, 28);
    doc.text(`Filtro aplicado: ${filtro || "Ninguno"}`, 14, 33);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 38);

    doc.setDrawColor(25, 135, 84);
    doc.setLineWidth(0.5);
    doc.line(10, 42, 200, 42);

    let y = 48;

    if (casos.length > 0) {
      const columnas = [
        { header: "ID", dataKey: "id_caso" },
        { header: "Título", dataKey: "titulo" },
        { header: "Técnico", dataKey: "tecnico" },
        { header: "Empleado", dataKey: "empleado" },
        { header: "Estado", dataKey: "estado" },
        { header: "Prioridad", dataKey: "prioridad" },
        { header: "Creación", dataKey: "fecha_creacion" },
        { header: "Cierre", dataKey: "fecha_cierre" },
      ];

      const filas = casos.map((c) => ({
        id_caso: c.id_caso,
        titulo: c.titulo,
        tecnico: c.tecnico,
        empleado: c.empleado,
        estado: c.estado,
        prioridad: c.prioridad,
        fecha_creacion: c.fecha_creacion,
        fecha_cierre: c.fecha_cierre || "-",
      }));

      autoTable(doc, {
        startY: y,
        head: [columnas.map((c) => c.header)],
        body: filas.map((fila) => columnas.map((c) => fila[c.dataKey])),
        styles: {
          fontSize: 8,
          halign: "center",
          valign: "middle",
          textColor: [33, 37, 41],
        },
        headStyles: {
          fillColor: [25, 135, 84],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [243, 243, 243] },
        margin: { left: 10, right: 10 },
        theme: "grid",
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,
        didDrawPage: () => {
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text(
            "Sistema HelpDesk - Reporte generado automáticamente",
            14,
            doc.internal.pageSize.height - 10
          );
        },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("No hay datos disponibles para este rango de fechas.", 14, y);
    }

    doc.save(`Reporte_Casos_${tipoReporte}.pdf`);
  };

  // 🔹 Datos para gráficas
  const tituloGrafica =
    tipoReporte === "por_estado"
      ? "Casos por Estado"
      : tipoReporte === "por_prioridad"
      ? "Casos por Prioridad"
      : tipoReporte === "por_tipo"
      ? "Casos por Tipo"
      : "Casos Totales";

  const dataGrafica = casos.reduce((acc: any[], c) => {
    let key =
      tipoReporte === "por_estado"
        ? c.estado
        : tipoReporte === "por_tipo"
        ? c.tipo
        : c.prioridad;

    if (!key) key = "Sin dato";
    const found = acc.find((a) => a.nombre === key);
    if (found) found.cantidad++;
    else acc.push({ nombre: key, cantidad: 1 });
    return acc;
  }, []);

  // 🔹 Control de registros visibles
  const casosVisibles = mostrarTodos ? casos : casos.slice(0, 10);

  return (
    <div className="container py-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">📄 Reporte de Casos</h3>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/dashboard/reportes")}
        >
          ⬅ Volver a Reportes
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Tipo de reporte:</label>
            <select
              className="form-select"
              value={tipoReporte}
              onChange={(e) => {
                setTipoReporte(e.target.value);
                setFiltro(null);
              }}
            >
              <option value="totales">Totales</option>
              <option value="por_estado">Por Estado</option>
              <option value="por_prioridad">Por Prioridad</option>
              <option value="por_tipo">Por Tipo</option>
              <option value="promedio_resolucion">Promedio de Resolución</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Filtro (opcional):</label>
            {opcionesFiltro.length > 0 ? (
              <select
                className="form-select"
                value={filtro || ""}
                onChange={(e) =>
                  setFiltro(e.target.value === "" ? null : e.target.value)
                }
              >
                <option value="">Todos</option>
                {opcionesFiltro.map((op, i) => (
                  <option key={i} value={op.nombre}>
                    {op.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="form-control"
                type="text"
                placeholder="Ej: Alta, Cerrado..."
                value={filtro || ""}
                onChange={(e) =>
                  setFiltro(e.target.value.trim() === "" ? null : e.target.value)
                }
              />
            )}
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

      {/* Gráficas */}
      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="mb-3 text-center">{tituloGrafica}</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataGrafica}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="mb-3 text-center">Distribución de Casos</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataGrafica}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dataGrafica.map((_, i) => (
                    <Cell key={i} fill={colores[i % colores.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla con límite de 10 registros */}
      <div className="table-responsive shadow-sm mb-3">
        <table className="table table-bordered table-striped text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Técnico</th>
              <th>Empleado</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Fecha Creación</th>
              <th>Fecha Cierre</th>
            </tr>
          </thead>
          <tbody>
            {casosVisibles.length > 0 ? (
              casosVisibles.map((fila) => (
                <tr key={fila.id_caso}>
                  <td>{fila.id_caso}</td>
                  <td>{fila.titulo}</td>
                  <td>{fila.tecnico}</td>
                  <td>{fila.empleado}</td>
                  <td>{fila.estado}</td>
                  <td>{fila.prioridad}</td>
                  <td>{fila.fecha_creacion}</td>
                  <td>{fila.fecha_cierre || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-muted">
                  No hay registros en este rango de fechas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {casos.length > 10 && (
          <div className="bg-success text-center py-2 rounded-bottom">
            <button
              className="btn btn-light btn-sm text-success fw-bold"
              onClick={() => setMostrarTodos(!mostrarTodos)}
            >
              {mostrarTodos ? "▲ Mostrar menos" : "▼ Mostrar más"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
