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

interface Incidencia {
  id_incidencia: number;
  nombre: string;
  id_tipo_incidencia: number;
}

export default function CrearCaso() {
  const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
  const [tiposIncidencia, setTiposIncidencia] = useState<TipoIncidencia[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idPrioridad, setIdPrioridad] = useState<number | null>(null);
  const [idTipo, setIdTipo] = useState<number | null>(null);
  const [idIncidencia, setIdIncidencia] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  const usuarioLogeado = localStorage.getItem("usuarioLogeado");
const idEmpleadoLogueado = usuarioLogeado ? JSON.parse(usuarioLogeado).id_empleado : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPrioridades, resTipos, resIncidencias] = await Promise.all([
          axios.get("http://localhost:4000/api/config/prioridades"),
          axios.get("http://localhost:4000/api/config/tipos-incidencia"),
          axios.get("http://localhost:4000/api/config/incidencias"),
        ]);
        setPrioridades(resPrioridades.data);
        setTiposIncidencia(resTipos.data);
        setIncidencias(resIncidencias.data);
      } catch (error) {
        console.error("Error cargando opciones:", error);
        setMensaje({ tipo: "error", texto: "No se pudieron cargar opciones de configuración." });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idPrioridad || !idTipo || !idIncidencia || !titulo.trim() || !descripcion.trim()) {
      setMensaje({ tipo: "error", texto: "⚠️ Completa todos los campos." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id_empleado_solicita: idEmpleadoLogueado,
        id_tipo_incidencia: idTipo,
        id_incidencia: idIncidencia,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        id_prioridad: idPrioridad,
      };

      console.log("Enviando al backend:", payload);

      await axios.post("http://localhost:4000/api/casos", payload);

      setMensaje({ tipo: "success", texto: "Caso creado correctamente" });
      setTitulo("");
      setDescripcion("");
      setIdPrioridad(null);
      setIdTipo(null);
      setIdIncidencia(null);
    } catch (error: any) {
      console.error("Error del backend:", error.response?.data || error.message);
      setMensaje({
        tipo: "error",
        texto: "Error al crear el caso: " + (error.response?.data?.mensaje || error.message),
      });
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
    <div style={{ background: "#D3D3D3", maxWidth: "1900px", margin: "2rem auto", padding: "1rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h1 style={{ textAlign: "left", fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#2d3748" }}>
        📝 Nuevo Caso
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Tipo de Incidencia */}
          <div style={{ background: "#E0E0E0", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
            <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <img src={fileIcon} alt="Tipo" style={{ width: "20px", height: "20px" }} />
              Tipo de Incidencia
            </label>
            <select
              value={idTipo ?? ""}
              onChange={(e) => setIdTipo(e.target.value ? Number(e.target.value) : null)}
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
                <option key={t.ID_TIPO} value={t.ID_TIPO}>{t.TIPO}</option>
              ))}
            </select>
          </div>

          {/* Incidencia */}
          <div style={{ background: "#E0E0E0", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
            <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <img src={fileIcon} alt="Incidencia" style={{ width: "20px", height: "20px" }} />
              Incidencia
            </label>
            <select
              value={idIncidencia ?? ""}
              onChange={(e) => setIdIncidencia(e.target.value ? Number(e.target.value) : null)}
              style={{
                width: "70%",
                maxWidth: "500px",
                padding: ".7rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
              }}
            >
              <option value="">Seleccione una incidencia</option>
              {incidencias.map((i) => (
                <option key={i.id_incidencia} value={i.id_incidencia}>{i.nombre}</option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div style={{ background: "#E0E0E0", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
            <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <img src={flagIcon} alt="Prioridad" style={{ width: "20px", height: "20px" }} />
              Prioridad
            </label>
            <select
              value={idPrioridad ?? ""}
              onChange={(e) => setIdPrioridad(e.target.value ? Number(e.target.value) : null)}
              style={{
                width: "70%",
                maxWidth: "500px",
                padding: ".7rem",
                borderRadius: "6px",
                border: "1px solid #E0E0E0",
              }}
            >
              <option value="">Seleccione prioridad</option>
              {prioridades.map((p) => (
                <option key={p.ID_PRIORIDAD} value={p.ID_PRIORIDAD}>{p.NOMBRE}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Título */}
        <div style={{ background: "#E0E0E0", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <img src={messageIcon} alt="Título" style={{ width: "20px", height: "20px" }} />
            Título del caso
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Impresora fuera de servicio"
            style={{ width: "70%", maxWidth: "500px", padding: ".8rem", borderRadius: "6px", border: "1px solid #a0aec0" }}
          />
        </div>

        {/* Descripción */}
        <div style={{ background: "#E0E0E0", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <img src={alertIcon} alt="Descripción" style={{ width: "20px", height: "20px" }} />
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el problema con detalle..."
            rows={3}
            style={{ width: "70%", maxWidth: "500px", padding: ".8rem", borderRadius: "6px", border: "1px solid #a0aec0", resize: "vertical" }}
          />
        </div>

        {/* Botón */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#E0E0E0" : "#2b6cb0",
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
        <div style={{
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
        }}>
          <img src={mensaje.tipo === "success" ? clockIcon : alertIcon} alt="Estado" style={{ width: "20px", height: "20px" }} />
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}
