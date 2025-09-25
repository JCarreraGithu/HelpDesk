import { useEffect, useState } from "react";
import userPlaceholder from "../assets/user-placeholder.png"; // avatar por defecto
import { FaUser, FaIdBadge, FaUserCircle, FaUserTag } from "react-icons/fa";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<any>(null);
  const [showAvatar, setShowAvatar] = useState(false); // para mostrar modal

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogeado");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  if (!usuario)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>
    );

  const campos = [
    { label: "Nombre", value: `${usuario.nombre} ${usuario.apellido}`, icon: <FaUser /> },
    { label: "Rol", value: usuario.rol, icon: <FaUserTag /> },
    { label: "ID Empleado", value: usuario.id_empleado, icon: <FaIdBadge /> },
    { label: "Username", value: usuario.username || "No asignado", icon: <FaUserCircle /> },
  ];

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        backgroundColor: "#C0C0C0",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg, #f9fafc, #e6f0eb)",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "'Inter', Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Avatar */}
        <img
          src={userPlaceholder}
          alt="Avatar Usuario"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            marginBottom: "1.5rem",
            objectFit: "cover",
            border: "4px solid #198754",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => setShowAvatar(true)}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <h2
          style={{
            marginBottom: "2rem",
            color: "#198754",
            fontSize: "2rem",
            borderBottom: "2px solid #198754",
            paddingBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Perfil de Usuario
        </h2>

        {/* Tarjetas de datos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          {campos.map((campo) => (
            <div
              key={campo.label}
              style={{
                backgroundColor: "#ffffff",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ fontSize: "1.8rem", color: "#198754" }}>{campo.icon}</div>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{campo.label}:</p>
                <p style={{ margin: 0, color: "#555" }}>{campo.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Botón */}
        <div style={{ marginTop: "2.5rem" }}>
          <button
            style={{
              backgroundColor: "#198754",
              color: "#fff",
              padding: "0.8rem 2.2rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.1rem",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onClick={() => alert("Función de editar perfil aún no implementada")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#157347";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#198754";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
            }}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Modal para ver avatar */}
      {showAvatar && (
        <div
          onClick={() => setShowAvatar(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <img
            src={userPlaceholder}
            alt="Avatar grande"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}
