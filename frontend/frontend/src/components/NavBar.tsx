import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <header>
        <img src={logo} alt="Logo Help Desk" className="logo" />
        <h1>Help Desk</h1>
      </header>

      <nav>
        <Link to="/dashboard/ver-casos" className="active">Casos</Link>
        <Link to="/dashboard/crear-caso">Nuevo Reporte</Link>
        <button onClick={() => navigate("/")} className="nav-button">
          Cerrar Sesión
        </button>
      </nav>
    </>
  );
}