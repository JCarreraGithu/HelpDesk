import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import sesionIcon from "../assets/sesion.png";
import lupaIcon from "../assets/lupa.png";
import notiIcon from "../assets/noti.png";
import userIcon from "../assets/log0.png";
import confiIcon from "../assets/confi.png";
import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchId, setSearchId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [showNoti, setShowNoti] = useState(false);
  const [showOpciones, setShowOpciones] = useState(false);

  const opcionesRef = useRef<HTMLDivElement>(null);

  const leidasStorageKey = "notificacionesLeidas";
  const notificacionesLeidas = JSON.parse(localStorage.getItem(leidasStorageKey) || "[]");

  const usuarioLogeado = localStorage.getItem("usuarioLogeado");
  const idEmpleadoLogeado = usuarioLogeado ? JSON.parse(usuarioLogeado).id_empleado : null;

  const handleSearch = async () => {
    try {
      let url = "";
      if (searchId.trim()) url = `http://localhost:4000/api/casos/id/${searchId.trim()}`;
      else if (searchTitle.trim()) url = `http://localhost:4000/api/casos/titulo/${encodeURIComponent(searchTitle.trim())}`;
      else return;

      const res = await fetch(url);
      if (!res.ok) {
        alert("Caso no encontrado");
        return;
      }

      const data = await res.json();
      const casoData = Array.isArray(data) ? data[0] : data;
      if (!casoData) {
        alert("Caso no encontrado");
        return;
      }

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

  const fetchNotificaciones = async () => {
    if (!idEmpleadoLogeado) return;
    try {
      const res = await fetch(`http://localhost:4000/api/notificaciones/${idEmpleadoLogeado}`);
      if (!res.ok) throw new Error("Error al obtener notificaciones");
      const data = await res.json();
      const pendientes = data.filter((n: any) => !notificacionesLeidas.includes(n.ID_NOTIFICACION));
      setNotificaciones(pendientes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(() => fetchNotificaciones(), 5000);
    return () => clearInterval(interval);
  }, []);

  const marcarLeida = (id: number) => {
    const nuevasLeidas = [...notificacionesLeidas, id];
    localStorage.setItem(leidasStorageKey, JSON.stringify(nuevasLeidas));
    setNotificaciones(notificaciones.filter((n) => n.ID_NOTIFICACION !== id));
  };

  const notiNoLeidas = notificaciones.length;

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
          <button onClick={() => setShowInput(!showInput)} className="search-button">
            <img src={lupaIcon} alt="Buscar" className="search-icon" />
          </button>
          {showInput && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="ID del caso"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
                autoFocus
              />
              <input
                type="text"
                placeholder="Título del caso"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
              />
              <button onClick={handleSearch} style={{ cursor: "pointer" }}>Buscar</button>
            </div>
          )}
        </div>

        <div className="navbar-right">
          <button onClick={() => setShowConfig(!showConfig)} className="config-button">
            <img src={confiIcon} alt="Configuración" className="config-icon" />
          </button>

          <button onClick={() => navigate("/dashboard/perfil")} className="user-button">
            <img src={userIcon} alt="Perfil" className="user-icon" />
          </button>

          <button className="noti-button" onClick={() => setShowNoti(!showNoti)}>
            <img src={notiIcon} alt="Notificaciones" className="noti-icon" />
            <span className="noti-badge">{notiNoLeidas}</span>
          </button>

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

      {/* Panel de notificaciones */}
      {showNoti && (
        <div
          className="noti-panel"
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            width: "360px",
            maxHeight: "450px",
            backgroundColor: "#f9fafa",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            borderRadius: "14px",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#eceff1",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "15px", color: "#333" }}>Notificaciones</h4>
            {notificaciones.length > 0 && (
              <button
                onClick={() => setNotificaciones([])}
                style={{
                  border: "none",
                  background: "#e57373",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                }}
              >
                Limpiar todas
              </button>
            )}
          </div>

          <div
            style={{
              padding: "12px",
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {notificaciones.length === 0 ? (
              <p style={{ textAlign: "center", color: "#777", fontStyle: "italic", margin: "20px 0" }}>
                No hay notificaciones
              </p>
            ) : (
              notificaciones.map((n, idx) => {
                const colores = ["#e3f2fd", "#e8f5e9", "#fff3e0"];
                const color = colores[idx % colores.length];
                return (
                  <div
                    key={n.ID_NOTIFICACION}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "10px 12px",
                      backgroundColor: color,
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ flex: 1, marginRight: "10px" }}>
                      <p style={{ margin: 0, fontSize: "14px", color: "#222", fontWeight: 500 }}>
                        {n.MENSAJE}
                      </p>
                      <small style={{ fontSize: "11px", color: "#555" }}>
                        {n.FECHA ? new Date(n.FECHA).toLocaleString() : ""}
                      </small>
                    </div>
                    <button
                      onClick={() => marcarLeida(n.ID_NOTIFICACION)}
                      style={{
                        border: "none",
                        background: "#ef5350",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "13px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                      }}
                      title="Eliminar notificación"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Navegación principal */}
      <nav style={{ display: "flex", gap: "16px", position: "relative", padding: "10px 20px" }}>
        <Link
          to="/dashboard/ver-casos"
          className={location.pathname === "/dashboard/ver-casos" ? "active" : ""}
        >
          Ver Casos
        </Link>
        <Link
          to="/dashboard/crear-caso"
          className={location.pathname === "/dashboard/crear-caso" ? "active" : ""}
        >
          Nuevo Reporte
        </Link>
        <Link
          to="/dashboard/usuarios"
          className={location.pathname === "/dashboard/usuarios" ? "active" : ""}
        >
          Usuarios
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
              <Link
                to="/dashboard/empleados"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "white",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#333",
                  textDecoration: "none",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
              >
                Empleados
              </Link>
              <Link
                to="#"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "white",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#333",
                  textDecoration: "none",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
              >
                Otra opción
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
