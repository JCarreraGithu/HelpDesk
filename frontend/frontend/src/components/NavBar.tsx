import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import sesionIcon from "../assets/sesion.png";
import lupaIcon from "../assets/lupa.png";
import userIcon from "../assets/Log0.png";
import confiIcon from "../assets/confi.png";
import { useState, useEffect, useRef } from "react";
import estadisticasIcon from "../assets/estadisticas.png";
import ticketIcon from "../assets/ticket.png";
import reporteIcon from "../assets/reporte.png";
import usuariosIcon from "../assets/Log0.png";
import Notificaciones from "./Notificaciones";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchId, setSearchId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [showOpciones, setShowOpciones] = useState(false);
  const opcionesRef = useRef<HTMLDivElement>(null);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado") || "null");
  const idEmpleado = usuario?.id_empleado || null;

  const handleSearch = async () => {
    try {
      let url = "";
      if (searchId.trim()) url = `http://localhost:4000/api/casos/id/${searchId.trim()}`;
      else if (searchTitle.trim()) url = `http://localhost:4000/api/casos/titulo/${encodeURIComponent(searchTitle.trim())}`;
      else return;

      const res = await fetch(url);
      if (!res.ok) return alert("Caso no encontrado");

      const data = await res.json();
      const casoData = Array.isArray(data) ? data[0] : data;
      if (!casoData) return alert("Caso no encontrado");

      setSearchId("");
      setSearchTitle("");
      localStorage.setItem("casoDetalle", JSON.stringify(casoData));
      navigate("/dashboard/detalle-caso", { state: { caso: casoData } });
    } catch (err) {
      console.error(err);
      alert("Error al buscar el caso");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Cerrar dropdown si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (opcionesRef.current && !opcionesRef.current.contains(event.target as Node)) {
        setShowOpciones(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Header superior */}
      <header className="navbar-header">
        <div className="navbar-left">
          <img src={logo} alt="Logo Help Desk" className="logo" />
          <h1>Help Desk</h1>
        </div>

        <div className="navbar-center">
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <img src={lupaIcon} alt="Buscar" style={{ width: "24px", height: "24px" }} />
            <input
              type="text"
              placeholder="ID del caso"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
              autoFocus
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              placeholder="Título del caso"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button
              onClick={handleSearch}
              style={{
                cursor: "pointer",
                padding: "6px 12px",
                backgroundColor: "#198754",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="navbar-right">
          <button onClick={() => setShowConfig(!showConfig)} className="config-button">
            <img src={confiIcon} alt="Configuración" className="config-icon" />
          </button>

         <button
  onClick={() => navigate("/dashboard/perfil")}
  className="user-button"
  style={{
    borderRadius: "50%",
    padding: "6px",
    backgroundColor:
      location.pathname === "/dashboard/perfil" ? "#198754" : "transparent",
    boxShadow:
      location.pathname === "/dashboard/perfil"
        ? "0 0 10px rgba(25, 135, 84, 0.6)"
        : "none",
    transition: "all 0.3s ease-in-out",
  }}
>
  <img
    src={userIcon}
    alt="Perfil"
    className="user-icon"
    style={{
      width: "42px",
      height: "42px",
      filter:
        location.pathname === "/dashboard/perfil"
          ? "drop-shadow(0 0 4px #00ff88)"
          : "none",
      transform:
        location.pathname === "/dashboard/perfil" ? "scale(1.1)" : "scale(1)",
      transition: "all 0.3s ease-in-out",
    }}
  />
</button>




          {/* Componente de Notificaciones */}
          <Notificaciones idEmpleado={idEmpleado} />

          <button onClick={() => navigate("/")} className="logout-button">
            <img src={sesionIcon} alt="Cerrar sesión" className="logout-icon" />
          </button>
        </div>
      </header>

      {/* Panel de configuración */}
      {showConfig && (
        <div className="config-panel">
          <h4>Configuración</h4>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider round"></span>
            <span style={{ marginLeft: "8px" }}>Modo nocturno</span>
          </label>
          <label><input type="checkbox" /> Animaciones</label>
          <label><input type="checkbox" /> Compactar vista</label>
        </div>
      )}

      {/* Navegación principal */}
      <nav style={{ display: "flex", gap: "16px", position: "relative", padding: "10px 20px" }}>
        <Link
          to="/dashboard/ver-casos"
          className={location.pathname === "/dashboard/ver-casos" ? "active" : ""}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}
        >
          Ver
          <img
            src={ticketIcon}
            alt="Ticket"
            style={{ width: "56px", height: "56px", transition: "transform 0.2s, filter 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        <Link
          to="/dashboard/crear-caso"
          className={location.pathname === "/dashboard/crear-caso" ? "active" : ""}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}
        >
          Nuevo
          <img
            src={reporteIcon}
            alt="Reporte"
            style={{ width: "46px", height: "46px", transition: "transform 0.2s, filter 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        <Link
          to="/dashboard/estadisticas"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            backgroundColor: location.pathname === "/dashboard/estadisticas" ? "#198754" : "#f0f0f0",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "6px",
          }}
        >
          <img src={estadisticasIcon} alt="Estadísticas" style={{ width: "24px", height: "24px" }} />
        </Link>

        <Link
          to="/dashboard/usuarios"
          className={location.pathname === "/dashboard/usuarios" ? "active" : ""}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}
        >
          Usuarios
          <img
            src={usuariosIcon}
            alt="Usuarios"
            style={{ width: "46px", height: "46px", transition: "transform 0.2s, filter 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Más Opciones */}
        <div
          ref={opcionesRef}
          style={{ position: "relative" }}
          onMouseEnter={() => setShowOpciones(true)}
          onMouseLeave={() => setShowOpciones(false)}
        >
          <Link
            to="/dashboard/empleados"
            style={{
              backgroundColor: location.pathname.startsWith("/dashboard/empleados") ? "#198754" : "#f0f0f0",
              color: location.pathname.startsWith("/dashboard/empleados") ? "#fff" : "#333",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Más Opciones ▾
          </Link>

          {showOpciones && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                overflow: "hidden",
                marginTop: "4px",
                minWidth: "180px",
                zIndex: 1000,
              }}
            >
              <Link to="/dashboard/empleados" style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "#333" }}>Empleados</Link>
              <Link to="#" style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "#333" }}>Otra opción</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
