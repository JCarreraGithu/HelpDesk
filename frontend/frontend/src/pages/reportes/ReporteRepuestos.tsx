import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { jsPDF } from "jspdf";

export default function ReporteRepuestos() {
  const [data, setData] = useState<any[]>([]);
  const [intervalo, setIntervalo] = useState("30d");
  const [loading, setLoading] = useState(false);

  const calcularFechas = () => {
    const fin = new Date();
    const inicio = new Date(fin);
    const map: any = { "7d": 7, "15d": 15, "30d": 30, "90d": 90 };
    if (map[intervalo]) inicio.setDate(fin.getDate() - map[intervalo]);
    else inicio.setFullYear(fin.getFullYear() - 1);
    return {
      fecha_inicio: inicio.toISOString().split("T")[0],
      fecha_fin: fin.toISOString().split("T")[0],
    };
  };

  const cargarDatos = async () => {
    setLoading(true);
    const { fecha_inicio, fecha_fin } = calcularFechas();
    try {
      const res = await fetch("http://localhost:4000/api/reportes/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria: "repuestos",
          tipo_reporte: "mas_usados",
          fecha_inicio,
          fecha_fin,
        }),
      });
      const json = await res.json();
      setData(json.ok ? json.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [intervalo]);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">🧩 Reporte de Repuestos</h3>

      <div className="d-flex gap-3 mb-4">
        <select className="form-select w-auto" value={intervalo} onChange={(e) => setIntervalo(e.target.value)}>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="1y">Último año</option>
        </select>

        <button className="btn btn-primary" onClick={cargarDatos}>
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {data.length > 0 ? (
        <div className="card p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="repuesto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_usos" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-muted">No hay datos disponibles.</p>
      )}
    </div>
  );
}
