import { Routes, Route } from "react-router-dom";
import Navbar from "../components/NavBar";
import CrearCaso from "./CrearCaso";
import VerCasos from "./VerCasos";
import DetalleCaso from "./DetalleCaso";
import DashboardUsuarios from "./DashboardUsuarios";
import PerfilUsuario from "./PerfilUsuario";
import "./Dashboard.css"; // Se mantiene al final de los imports de módulos y componentes

export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Inter', Arial, sans-serif",
        backgroundColor: "#eef5f4",
        color: "#2d2d2d",
        fontSize: "1.2rem",
        lineHeight: 1.7,
      }}
    >
      <Navbar />

      {/* Contenedor de las vistas */}
      <div
        style={{
          flex: 1,
          width: "100%",
          padding: "0.5rem", // un poquito de espacio a los lados
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <Routes>
          <Route path="ver-casos" element={<VerCasos />} />
          <Route path="crear-caso" element={<CrearCaso />} />
          <Route path="detalle-caso" element={<DetalleCaso />} />
          <Route path="usuarios" element={<DashboardUsuarios />} />
          <Route path="perfil" element={<PerfilUsuario />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#4a7c59",
          color: "white",
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "1.1rem",
          marginTop: "auto",
        }}
      >
        © 2025 Help Desk |{" "}
        <a
          href="#"
          style={{
            color: "#d9ebe3",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Soporte
        </a>
      </footer>
    </div>
  );
}
