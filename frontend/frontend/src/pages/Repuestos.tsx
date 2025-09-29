import { useState, useEffect } from "react";
import axios from "axios";

// 🖼️ Íconos (puedes cambiarlos si ya tienes otros en assets)
import boxIcon from "../assets/file.png";
import alertIcon from "../assets/alert.jpeg";
import moneyIcon from "../assets/clock.png";

export default function Repuestos() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || precioUnitario <= 0) {
      setMensaje({ tipo: "error", texto: "⚠️ Nombre y precio unitario son obligatorios" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/repuestos", {
        nombre,
        descripcion,
        stock,
        precio_unitario: precioUnitario,
      });

      setMensaje({ tipo: "success", texto: "✅ Repuesto registrado correctamente" });

      // limpiar campos
      setNombre("");
      setDescripcion("");
      setStock(0);
      setPrecioUnitario(0);
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "❌ Error al registrar repuesto" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h1 style={{ textAlign: "left", fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#2d3748" }}>
        📦 Registrar Repuesto
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: ".5rem" }}>
            <img src={boxIcon} alt="Nombre" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ejemplo: Tarjeta madre ASUS"
            style={{
              width: "70%",
              maxWidth: "500px",
              padding: ".7rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e0",
            }}
            required
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: ".5rem" }}>
            <img src={alertIcon} alt="Descripción" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles del repuesto..."
            rows={3}
            style={{
              width: "70%",
              maxWidth: "500px",
              padding: ".7rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e0",
              resize: "vertical",
            }}
          />
        </div>

        {/* Stock */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: ".5rem" }}>
            📊 Stock
          </label>
          <input
            type="number"
            value={stock}
            min={0}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="0"
            style={{
              width: "200px",
              padding: ".7rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e0",
            }}
          />
        </div>

        {/* Precio Unitario */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: ".5rem" }}>
            <img src={moneyIcon} alt="Precio" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
            Precio Unitario
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(Number(e.target.value))}
            placeholder="0.00"
            style={{
              width: "200px",
              padding: ".7rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e0",
            }}
            required
          />
        </div>

        {/* Botón */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#a0aec0" : "#2b6cb0",
              color: "#fff",
              padding: "0.9rem 1.5rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
          >
            {loading ? "Guardando..." : "Registrar Repuesto"}
          </button>
        </div>
      </form>

      {/* Notificación */}
      {mensaje && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: mensaje.tipo === "success" ? "#48bb78" : "#f56565",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}
