import { useEffect, useState } from "react";
import axios from "axios";

// 🖼️ Importar íconos
import alertIcon from "../assets/alert.jpeg";
import clockIcon from "../assets/clock.png";
import fileIcon from "../assets/file.png";
import flagIcon from "../assets/flag.png";
import messageIcon from "../assets/message.png";

interface Prioridad {
  ID_PRIORIDAD: number;
  NOMBRE: string;
}

interface TipoIncidencia {
  ID_TIPO: number;
  TIPO: string;
}

export default function CrearCaso() {
  const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
  const [tiposIncidencia, setTiposIncidencia] = useState<TipoIncidencia[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idPrioridad, setIdPrioridad] = useState<number | "">("");
  const [idTipo, setIdTipo] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);
  const idEmpleadoLogueado = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPrioridades, resTipos] = await Promise.all([
          axios.get("http://localhost:4000/api/config/prioridades"),
          axios.get("http://localhost:4000/api/config/tipos-incidencia"),
        ]);
        setPrioridades(resPrioridades.data);
        setTiposIncidencia(resTipos.data);
      } catch (error) {
        console.error("Error cargando opciones:", error);
        setMensaje({ tipo: "error", texto: "No se pudieron cargar opciones de configuración." });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idPrioridad || !idTipo || !titulo.trim() || !descripcion.trim()) {
      setMensaje({ tipo: "error", texto: "⚠️ Completa todos los campos." });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/casos", {
        id_empleado_solicita: idEmpleadoLogueado,
        id_tipo_incidencia: idTipo,
        titulo,
        descripcion,
        id_prioridad: idPrioridad,
      });

      setMensaje({ tipo: "success", texto: "Caso creado correctamente" });
      setTitulo("");
      setDescripcion("");
      setIdPrioridad("");
      setIdTipo("");
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Error al crear el caso" });
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
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h1 style={{ textAlign: "left", fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#2d3748" }}>
        📝 Nuevo Caso
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Tipo de Incidencia */}
          <div style={{ background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
            <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <img src={fileIcon} alt="Tipo" style={{ width: "20px", height: "20px" }} />
              Tipo de Incidencia
            </label>
            <select
              value={idTipo}
              onChange={(e) => setIdTipo(Number(e.target.value))}
              style={{
                width: "70%",
                maxWidth: "500px",
                padding: ".7rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
              }}
            >
              <option value="">Seleccione un tipo</option>
              {tiposIncidencia.map((t) => (
                <option key={t.ID_TIPO} value={t.ID_TIPO}>
                  {t.TIPO}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div style={{ background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
            <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <img src={flagIcon} alt="Prioridad" style={{ width: "20px", height: "20px" }} />
              Prioridad
            </label>
            <select
              value={idPrioridad}
              onChange={(e) => setIdPrioridad(Number(e.target.value))}
              style={{
                width: "70%",
                maxWidth: "500px",
                padding: ".7rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
              }}
            >
              <option value="">Seleccione prioridad</option>
              {prioridades.map((p) => (
                <option key={p.ID_PRIORIDAD} value={p.ID_PRIORIDAD}>
                  {p.NOMBRE}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Título */}
        <div style={{ background: "#edf2f7", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <img src={messageIcon} alt="Título" style={{ width: "20px", height: "20px" }} />
            Título del caso
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Impresora fuera de servicio"
            style={{
              width: "70%",
              maxWidth: "500px",
              padding: ".8rem",
              borderRadius: "6px",
              border: "1px solid #a0aec0",
            }}
          />
        </div>

        {/* Descripción */}
        <div style={{ background: "#edf2f7", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <img src={alertIcon} alt="Descripción" style={{ width: "20px", height: "20px" }} />
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el problema con detalle..."
            rows={3}
            style={{
              width: "70%",
              maxWidth: "500px",
              padding: ".8rem",
              borderRadius: "6px",
              border: "1px solid #a0aec0",
              resize: "vertical",
            }}
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
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              justifyContent: "center",
            }}
          >
            <img src={clockIcon} alt="Guardar" style={{ width: "20px", height: "20px" }} />
            {loading ? "Guardando..." : "Crear Caso"}
          </button>
        </div>
      </form>

      {/* Notificación flotante */}
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
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <img
            src={mensaje.tipo === "success" ? clockIcon : alertIcon}
            alt="Estado"
            style={{ width: "20px", height: "20px" }}
          />
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}