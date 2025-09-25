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
  const [showInput, setShowInput] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleSearch = () => {
    if (searchId.trim()) {
      console.log("Buscar caso con ID:", searchId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
            <input
              type="text"
              placeholder="ID del caso"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
              autoFocus
            />
          )}
        </div>

        {/* Derecha */}
        <div className="navbar-right">
          <button onClick={() => setShowConfig(!showConfig)} className="config-button">
            <img src={confiIcon} alt="Configuración" className="config-icon" />
          </button>
          <button onClick={() => navigate("/dashboard/usuario")} className="user-button">
            <img src={userIcon} alt="Usuario" className="user-icon" />
          </button>
          <button className="noti-button">
            <img src={notiIcon} alt="Notificaciones" className="noti-icon" />
          </button>
          <button onClick={() => navigate("/")} className="logout-button">
            <img src={sesionIcon} alt="Cerrar sesión" className="logout-icon" />
          </button>
        </div>

        {/* Panel de configuración */}
        {showConfig && (
          <div className="config-panel">
            <h4>Configuración</h4>
            <label>
              <input type="checkbox" /> Modo nocturno
            </label>
            <label>
              <input type="checkbox" /> Animaciones
            </label>
            <label>
              <input type="checkbox" /> Compactar vista
            </label>
          </div>
        )}
      </header>

      <nav>
        <Link to="/dashboard/ver-casos" className="active">Casos</Link>
        <Link to="/dashboard/crear-caso">Nuevo Reporte</Link>
      </nav>
    </>
  );
}