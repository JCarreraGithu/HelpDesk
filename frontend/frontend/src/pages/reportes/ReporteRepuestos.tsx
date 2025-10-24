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
  ResponsiveContainer,
} from "recharts";

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  precio_unitario: number;
  stock: number;
}

export default function ReporteRepuestos() {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [filtro, setFiltro] = useState<string>("");

  // 🔹 Obtener datos del backend
  const obtenerDatos = async () => {
    const response = await fetch("http://localhost:4000/api/reportes/repuestos/totales");
    const data = await response.json();
    setRepuestos(data);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  // 🔹 Aplicar filtros
  const repuestosFiltrados = [...repuestos].sort((a, b) => {
    switch (filtro) {
      case "masStock":
        return b.stock - a.stock;
      case "menosStock":
        return a.stock - b.stock;
      case "precioAlto":
        return b.precio_unitario - a.precio_unitario;
      case "precioBajo":
        return a.precio_unitario - b.precio_unitario;
      default:
        return 0;
    }
  });

  // 🔹 Exportar PDF
  const exportarPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 170, 10, 25, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(25, 135, 84);
    doc.text("Reporte de Repuestos - HelpDesk", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);
    doc.setDrawColor(25, 135, 84);
    doc.line(10, 33, 200, 33);

    if (repuestosFiltrados.length > 0) {
      autoTable(doc, {
        startY: 40,
        head: [["ID", "Nombre", "Precio Unitario", "Stock"]],
        body: repuestosFiltrados.map((r) => [
          r.id_repuesto,
          r.nombre,
          `Q${r.precio_unitario.toFixed(2)}`,
          r.stock,
        ]),
        styles: { fontSize: 8, halign: "center", valign: "middle" },
        headStyles: { fillColor: [25, 135, 84], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        theme: "grid",
        margin: { left: 10, right: 10 },
      });

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
      doc.text("No hay datos disponibles para mostrar.", 14, 40);
    }

    doc.save(`Reporte_Repuestos.pdf`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">🔧 Reporte Detallado - Repuestos</h3>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/dashboard/reportes")}
        >
          ⬅ Volver
        </button>
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="">Ordenar por...</option>
              <option value="masStock">Mayor stock</option>
              <option value="menosStock">Menor stock</option>
              <option value="precioAlto">Precio más alto</option>
              <option value="precioBajo">Precio más bajo</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-success w-100" onClick={exportarPDF}>
              📄 Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Gráfica de stock por repuesto */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="text-center fw-bold mb-3">Stock por Repuesto</h5>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={repuestos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value} unidades`} />
            <Bar dataKey="stock" fill="#198754" name="Stock disponible" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Tabla de repuestos */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-striped text-center align-middle mb-0">
          <thead className="table-secondary">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio Unitario</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {repuestosFiltrados.map((r) => (
              <tr key={r.id_repuesto}>
                <td>{r.id_repuesto}</td>
                <td>{r.nombre}</td>
                <td>Q{r.precio_unitario.toFixed(2)}</td>
                <td>{r.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
