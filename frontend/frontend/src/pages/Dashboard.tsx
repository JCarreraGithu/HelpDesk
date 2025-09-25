import { Routes, Route } from "react-router-dom";
import Navbar from "../components/NavBar";
import CrearCaso from "./CrearCaso";
import VerCasos from "./VerCasos";
import "./Dashboard.css";
import DetalleCaso from "./DetalleCaso";
import DashboardUsuarios from "./DashboardUsuarios"; 
import PerfilUsuario from "./PerfilUsuario";



export default function Dashboard() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      fontFamily: "'Inter', Arial, sans-serif",
      backgroundColor: "#eef5f4",
      color: "#2d2d2d",
      fontSize: "1.2rem",
      lineHeight: 1.7
    }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "2rem" }}>
        <main style={{
          width: "100%",
          maxWidth: "900px",
          background: "#ffffff",
          padding: "3rem",
          borderRadius: "16px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
        }}>
          <Routes>
            <Route path="ver-casos" element={<VerCasos />} />
            <Route path="crear-caso" element={<CrearCaso />} />
            <Route path="detalle-caso" element={<DetalleCaso />} />
            <Route path="usuarios" element={<DashboardUsuarios />} /> 
            <Route path="perfil" element={<PerfilUsuario />} />
          </Routes>
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: "#4a7c59",
        color: "white",
        textAlign: "center",
        padding: "1.5rem",
        fontSize: "1.1rem",
        marginTop: "auto"
      }}>
        © 2025 Help Desk | <a href="#" style={{ color: "#d9ebe3", fontWeight: "bold", textDecoration: "none" }}>Soporte</a>
      </footer>
    </div>
  );
}
