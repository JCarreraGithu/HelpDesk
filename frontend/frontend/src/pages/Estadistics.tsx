// src/views/Estadistics.tsx
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

interface StatCard {
  nombre: string;
  valor: number;
  color: string;
}

export default function Estadistics() {
  const [cards, setCards] = useState<StatCard[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    // Cards resumen
    setCards([
      { nombre: "Casos Abiertos", valor: 12, color: "#2b6cb0" },
      { nombre: "Casos Cerrados", valor: 34, color: "#48bb78" },
      { nombre: "Incidencias Urgentes", valor: 5, color: "#f56565" },
      { nombre: "Usuarios Activos", valor: 20, color: "#ed8936" },
    ]);

    // Gráfica de barras: Casos por tipo
    setBarData([
      { tipo: "Hardware", casos: 12 },
      { tipo: "Software", casos: 20 },
      { tipo: "Red", casos: 10 },
      { tipo: "Otro", casos: 9 },
    ]);

    // Gráfica de pastel: Distribución de prioridades
    setPieData([
      { name: "Alta", value: 5 },
      { name: "Media", value: 18 },
      { name: "Baja", value: 42 },
    ]);
  }, []);

  const pieColors = ["#f56565", "#ecc94b", "#48bb78"];

  return (
    <div style={{ padding: "2rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#2d3748" }}>📊 Dashboard de Estadísticas</h1>

      {/* Cards de resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {cards.map((c, idx) => (
          <div
            key={idx}
            style={{
              background: c.color,
              color: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", margin: 0 }}>{c.valor}</h2>
            <p style={{ marginTop: ".5rem", fontWeight: 600 }}>{c.nombre}</p>
          </div>
        ))}
      </div>

      {/* Gráfica de barras */}
      <div style={{ marginBottom: "2rem", background: "#f0f4f8", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginBottom: "1rem", color: "#2b6cb0" }}>Casos por tipo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="casos" fill="#2b6cb0" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de pastel */}
      <div style={{ background: "#f0f4f8", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginBottom: "1rem", color: "#48bb78" }}>Distribución de prioridades</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
