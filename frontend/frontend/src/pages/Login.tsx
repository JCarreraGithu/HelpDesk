import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-illustration.png";
import userIcon from "../assets/user.png";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // limpiar errores previos

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: correo, // en tu BD el campo se llama username
          password: password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.mensaje || "Error en el login");
        return;
      }

      const data = await response.json();
      console.log("Usuario autenticado:", data);

      // Guardar datos en localStorage (ej: para usarlos después)
      localStorage.setItem("usuario", JSON.stringify(data));

      // Redirigir al dashboard principal
      navigate("/dashboard/ver-casos");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Mitad izquierda con fondo verde e imagen */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#198754",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={loginImage}
          alt="Ilustración de inicio de sesión"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Mitad derecha con formulario */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <div
          className="shadow"
          style={{
            width: "70%",
            maxWidth: "700px",
            minWidth: "350px",
            padding: "4vw",
            height: "80%",
            borderRadius: "12px",
            backgroundColor: "#DCDCDC", // gris suave
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Ícono de usuario */}
          <div className="text-center mb-3">
            <img
              src={userIcon}
              alt="Ícono de usuario"
              style={{ width: "60px", height: "60px" }}
            />
          </div>

          <h3 className="text-center mb-4 text-success">Iniciar Sesión</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div
              className="mb-3"
              style={{ maxWidth: "250px", margin: "0 auto" }}
            >
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                placeholder="juan.perez"
              />
            </div>

            <div
              className="mb-3"
              style={{ maxWidth: "250px", margin: "0 auto" }}
            >
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </div>

            <div style={{ maxWidth: "250px", margin: "0 auto" }}>
              <button type="submit" className="btn btn-success w-100">
                Ingresar
              </button>
            </div>

            <div className="text-center mt-3">
              <small>¿Necesitas una cuenta? Contacta al administrador.</small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
