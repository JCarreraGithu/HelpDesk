import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function MenuReportes() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="fw-bold mb-0">📊 Reportería del Sistema</h3>

      <div className="position-relative" ref={menuRef}>
        <button
          className="btn btn-success dropdown-toggle"
          onClick={() => setShowMenu((v) => !v)}
        >
          Seleccionar categoría
        </button>

        {showMenu && (
          <div
            className="dropdown-menu show shadow-sm"
            style={{
              position: "absolute",
              right: 0,
              zIndex: 1000,
              borderRadius: 8,
            }}
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
              Reportes de Departamentos
            </button>
            <button className="dropdown-item" onClick={() => irACategoria("satisfaccion")}>
              Reportes de Satisfacción
            </button>
            <button className="dropdown-item" onClick={() => irACategoria("repuestos")}>
              Reportes de Repuestos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
