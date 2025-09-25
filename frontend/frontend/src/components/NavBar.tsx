import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import sesionIcon from "../assets/sesion.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <header className="navbar-header">
        <div className="navbar-left">
          <img src={logo} alt="Logo Help Desk" className="logo" />
          <h1>Help Desk</h1>
        </div>

        {/* Ícono de cerrar sesión */}
        <button onClick={() => navigate("/")} className="logout-button">
          <img src={sesionIcon} alt="Cerrar sesión" className="logout-icon" />
        </button>
      </header>

      {/* NAV */}
      <nav>
        <Link to="/dashboard/ver-casos" className="active">Casos</Link>
        <Link to="/dashboard/crear-caso">Nuevo Reporte</Link>
      </nav>
    </>
  );
}