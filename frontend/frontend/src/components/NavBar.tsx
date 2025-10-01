import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import sesionIcon from "../assets/sesion.png";
import lupaIcon from "../assets/lupa.png";
import notiIcon from "../assets/noti.png";
import userIcon from "../assets/log0.png";
import confiIcon from "../assets/confi.png";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNoti, setShowNoti] = useState(false);

  // Persistencia frontend de notificaciones leídas
  const leidasStorageKey = "notificacionesLeidas";
  const notificacionesLeidas = JSON.parse(localStorage.getItem(leidasStorageKey) || "[]");

  // ID del empleado logueado
  const usuarioLogeado = localStorage.getItem("usuarioLogeado");
  const idEmpleadoLogueado = usuarioLogeado ? JSON.parse(usuarioLogeado).id_empleado : null;

  const handleSearch = async () => {
    try {
      let url = "";
      if (searchId.trim()) {
        url = `http://localhost:4000/api/casos/id/${searchId.trim()}`;
      } else if (searchTitle.trim()) {
        url = `http://localhost:4000/api/casos/titulo/${encodeURIComponent(searchTitle.trim())}`;
      } else return;

      const res = await fetch(url);
      if (!res.ok) {
        alert("Caso no encontrado");
        return;
      }

      const data = await res.json();

      let casoData;
      if (Array.isArray(data)) {
        if (data.length === 0) {
          alert("Caso no encontrado");
          return;
        }
        casoData = data[0];
      } else {
        casoData = data;
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

  // Cargar notificaciones desde backend y filtrar ya leídas
  const fetchNotificaciones = async () => {
    if (!idEmpleadoLogueado) return;
    try {
      const res = await fetch(`http://localhost:4000/api/notificaciones/${idEmpleadoLogueado}`);
      if (!res.ok) throw new Error("Error al obtener notificaciones");
      const data = await res.json();
      const pendientes = data.filter(n => !notificacionesLeidas.includes(n.ID_NOTIFICACION));
      setNotificaciones(pendientes);
      setShowNoti(!showNoti);
    } catch (err) {
      console.error(err);
    }
  };

  // Marcar notificación como leída (frontend)
  const marcarLeida = (id: number) => {
    const nuevasLeidas = [...notificacionesLeidas, id];
    localStorage.setItem(leidasStorageKey, JSON.stringify(nuevasLeidas));
    setNotificaciones(notificaciones.filter(n => n.ID_NOTIFICACION !== id));
  };

  // Cantidad de notificaciones no leídas
  const notiNoLeidas = notificaciones.length;

  return (
    <>
      <header className="navbar-header">
        {/* Izquierda */}
        <div className="navbar-left">
          <img src={logo} alt="Logo Help Desk" className="logo" />
          <h1>Help Desk</h1>
        </div>

        {/* Centro */}
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

        {/* Derecha */}
        <div className="navbar-right">
          <button onClick={() => setShowConfig(!showConfig)} className="config-button">
            <img src={confiIcon} alt="Configuración" className="config-icon" />
          </button>

          <button onClick={() => navigate("/dashboard/perfil")} className="user-button">
            <img src={userIcon} alt="Perfil" className="user-icon" />
          </button>

          <button className="noti-button" onClick={fetchNotificaciones}>
            <img src={notiIcon} alt="Notificaciones" className="noti-icon" />
            {notiNoLeidas > 0 && <span className="noti-badge">{notiNoLeidas}</span>}
          </button>

          <button onClick={() => navigate("/")} className="logout-button">
            <img src={sesionIcon} alt="Cerrar sesión" className="logout-icon" />
          </button>
        </div>

        {/* Panel de configuración */}
        {showConfig && (
          <div className="config-panel">
            <h4>Configuración</h4>
            <label><input type="checkbox" /> Modo nocturno</label>
            <label><input type="checkbox" /> Animaciones</label>
            <label><input type="checkbox" /> Compactar vista</label>
          </div>
        )}
      </header>

{/* Panel de notificaciones mejorado con fondo gris claro */}
{showNoti && (
  <div
    className="noti-panel"
    style={{
      position: "absolute",
      top: "60px",
      right: "20px",
      width: "340px",
      maxHeight: "420px",
      backgroundColor: "#f5f6f8", // gris claro
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      borderRadius: "14px",
      overflow: "hidden",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      animation: "fadeIn 0.25s ease-out",
    }}
  >
    {/* Header */}
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#eceff1", // un gris un poco más fuerte para separar
      }}
    >
      <h4 style={{ margin: 0, fontSize: "15px", color: "#333" }}>Notificaciones</h4>
      {notificaciones.length > 0 && (
        <button
          onClick={() => limpiarTodas()}
          style={{
            border: "none",
            background: "transparent",
            color: "#666",
            cursor: "pointer",
            fontSize: "13px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#d33")}
          onMouseLeave={(e) => (e.target.style.color = "#666")}
        >
          Limpiar
        </button>
      )}
    </div>

    {/* Lista */}
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
        notificaciones.map((n) => (
          <div
            key={n.ID_NOTIFICACION}
            className="noti-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "10px 12px",
              backgroundColor: "#fff", // blanco sobre gris
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              boxShadow: "inset 0 0 4px rgba(0,0,0,0.03)",
              transition: "background 0.25s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            <div style={{ flex: 1, marginRight: "10px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#222", fontWeight: 500 }}>
                {n.MENSAJE}
              </p>
              <small style={{ fontSize: "11px", color: "#999" }}>
                {n.FECHA ? new Date(n.FECHA).toLocaleString() : ""}
              </small>
            </div>
            <button
              onClick={() => marcarLeida(n.ID_NOTIFICACION)}
              style={{
                border: "none",
                background: "transparent",
                color: "#999",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                lineHeight: "1",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#d33")}
              onMouseLeave={(e) => (e.target.style.color = "#999")}
              title="Marcar como leída"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  </div>
)}



      {/* Navegación */}
      <nav>
        <Link to="/dashboard/ver-casos" className="active">Casos</Link>
        <Link to="/dashboard/crear-caso">Nuevo Reporte</Link>
        <Link to="/dashboard/usuarios">Usuarios</Link>
      </nav>
    </>
  );
}
