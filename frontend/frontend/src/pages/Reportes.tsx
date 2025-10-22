import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Reportes() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Datos de ejemplo para gráficas generales (mock)
  const casosPorTipo = [
    { tipo: "Hardware", cantidad: 12 },
    { tipo: "Software", cantidad: 20 },
    { tipo: "Red", cantidad: 8 },
    { tipo: "Otro", cantidad: 5 },
  ];

  const prioridades = [
    { prioridad: "Alta", cantidad: 5 },
    { prioridad: "Media", cantidad: 18 },
    { prioridad: "Baja", cantidad: 12 },
  ];

  const tecnicos = [
    { tecnico: "María", promedio: 55 },
    { tecnico: "Laura", promedio: 24 },
    { tecnico: "Daniel", promedio: 8 },
    { tecnico: "Jimmy", promedio: 9 },
  ];

  const colores = ["#2563eb", "#16a34a", "#dc2626", "#facc15", "#9333ea"];

  // Cerrar el menú si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const irACategoria = (categoria: string) => {
    setShowMenu(false);
    navigate(`/dashboard/reportes/${categoria}`);
  };

  return (
    <div className="container py-4">
      {/* Encabezado + menú */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">📊 Reportería del Sistema</h3>

        <div className="position-relative" ref={menuRef}>
          <button
            className="btn btn-success dropdown-toggle"
            onClick={() => setShowMenu((v) => !v)}
            aria-expanded={showMenu}
          >
            Seleccionar categoría
          </button>

          {showMenu && (
            <div
              className="dropdown-menu show shadow-sm"
              style={{ position: "absolute", right: 0, zIndex: 1000, borderRadius: 8 }}
            >
              <button className="dropdown-item" onClick={() => irACategoria("tecnicos")}>
                Reportes de Técnicos
              </button>
              <button className="dropdown-item" onClick={() => irACategoria("casos")}>
                Reportes de Casos
              </button>
              <button className="dropdown-item" onClick={() => irACategoria("empleados")}>
                Reportes de Empleados
              </button>
              <button className="dropdown-item" onClick={() => irACategoria("departamentos")}>
                Reportes por Departamentos
              </button>
              <button className="dropdown-item" onClick={() => irACategoria("satisfaccion")}>
                Resultados de Satisfacción
              </button>
              <button className="dropdown-item" onClick={() => irACategoria("repuestos")}>
                Reportes de Repuestos
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-muted mb-4">
        Visualiza indicadores generales de desempeño. Luego elige una categoría para ver reportes detallados con filtros.
      </p>

      {/* 1) Casos por tipo */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">Casos por tipo</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={casosPorTipo}>
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2) Distribución de prioridades */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">Distribución de prioridades</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={prioridades}
              dataKey="cantidad"
              nameKey="prioridad"
              outerRadius={120}
              label
            >
              {prioridades.map((_, i) => (
                <Cell key={i} fill={colores[i % colores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3) Promedio de resolución por técnico */}
      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">Promedio de resolución por técnico</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tecnicos}>
            <XAxis dataKey="tecnico" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="promedio" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
