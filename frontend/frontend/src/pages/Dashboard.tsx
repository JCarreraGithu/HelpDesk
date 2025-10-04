import { Routes, Route } from "react-router-dom";
import Navbar from "../components/NavBar";
import CrearCaso from "./CrearCaso";
import VerCasos from "./VerCasos";
import DetalleCaso from "./DetalleCaso";
import DashboardUsuarios from "./DashboardUsuarios";
import PerfilUsuario from "./PerfilUsuario";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import Empleados from "./Empleados";
import Estadistics from "./Estadistics";


export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  // cargar preferencia desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  // guardar preferencia al cambiar
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Inter', Arial, sans-serif",
        backgroundColor: darkMode ? "#1e1e1e" : "#eef5f4",
        color: darkMode ? "#f5f5f5" : "#2d2d2d",
        fontSize: "1.2rem",
        lineHeight: 1.7,
        transition: "all 0.3s ease",
      }}
    >
      {/* pasamos darkMode y setDarkMode al Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Contenedor de las vistas */}
      <div
        style={{
          flex: 1,
          width: "100%",
          padding: "0.5rem",
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
  <Route path="empleados" element={<Empleados />} />  
   <Route path="estadisticas" element={<Estadistics />} />  
</Routes>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: darkMode ? "#333" : "#4a7c59",
          color: "white",
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "1.1rem",
          marginTop: "auto",
          transition: "all 0.3s ease",
        }}
      >
        © 2025 Help Desk |{" "}
        <a
          href="#"
          style={{
            color: darkMode ? "#b0bec5" : "#d9ebe3",
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
