import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 🖼️ Íconos
import alertIcon from "../assets/alert.jpeg";
import clockIcon from "../assets/clock.png";
import fileIcon from "../assets/file.png";
import flagIcon from "../assets/flag.png";
import messageIcon from "../assets/message.png";

interface Prioridad { ID_PRIORIDAD: number; NOMBRE: string; }
interface TipoIncidencia { ID_TIPO: number; TIPO: string; }
interface Incidencia { id_incidencia: number; nombre: string; id_tipo_incidencia: number; }

export default function CrearCaso() {
  const navigate = useNavigate();
  const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
  const [tiposIncidencia, setTiposIncidencia] = useState<TipoIncidencia[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idPrioridad, setIdPrioridad] = useState<number | null>(null);
  const [idTipo, setIdTipo] = useState<number | null>(null);
  const [idIncidencia, setIdIncidencia] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar opciones de configuración",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idPrioridad || !idTipo || !idIncidencia || !titulo.trim() || !descripcion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Completa todos los campos",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const payload = {
      id_empleado_solicita: idEmpleadoLogueado,
      id_tipo_incidencia: idTipo,
      id_incidencia: idIncidencia,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      id_prioridad: idPrioridad,
    };

    const confirm = await Swal.fire({
      title: "Crear caso?",
      text: "Se creará un nuevo caso en el sistema",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/casos", payload);
      localStorage.setItem("casoDetalle", JSON.stringify({ id_caso: res.data.id_caso }));
      Swal.fire({
        icon: "success",
        title: "Caso creado",
        text: "Se creó correctamente el caso",
        timer: 1800,
        showConfirmButton: false,
      });
      navigate("/dashboard/detalle-caso");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el caso: " + (error.response?.data?.mensaje || error.message),
      });
    } finally {
      setLoading(false);
    }
  };

 const inputStyle = {
  width: "70%",
  maxWidth: "500px",
  padding: ".7rem",
  borderRadius: "8px",
  border: "1px solid #cbd5e0",
  background: "#f0f4f8", // gris claro
  color: "#1a202c",      // texto gris oscuro
  transition: "all 0.2s",
};

  return (
    <div style={{ background: "#f4f6f8", padding: "2rem", fontFamily: "'Segoe UI', Tahoma, sans-serif", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", color: "#2d3748" }}>
        📝 Nuevo Caso
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Grid de selects */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          {/** Tipo */}
          <div style={{ padding: "1rem", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem", fontWeight: 600 }}>
              <img src={fileIcon} alt="" style={{ width: "20px", height: "20px" }} /> Tipo de Incidencia
            </label>
            <select value={idTipo ?? ""} onChange={(e) => setIdTipo(Number(e.target.value) || null)} style={inputStyle}>
              <option value="">Seleccione tipo</option>
              {tiposIncidencia.map(t => <option key={t.ID_TIPO} value={t.ID_TIPO}>{t.TIPO}</option>)}
            </select>
          </div>

          {/** Incidencia */}
          <div style={{ padding: "1rem", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem", fontWeight: 600 }}>
              <img src={fileIcon} alt="" style={{ width: "20px", height: "20px" }} /> Incidencia
            </label>
            <select value={idIncidencia ?? ""} onChange={(e) => setIdIncidencia(Number(e.target.value) || null)} style={inputStyle}>
              <option value="">Seleccione incidencia</option>
              {incidencias.map(i => <option key={i.id_incidencia} value={i.id_incidencia}>{i.nombre}</option>)}
            </select>
          </div>

          {/** Prioridad */}
          <div style={{ padding: "1rem", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem", fontWeight: 600 }}>
              <img src={flagIcon} alt="" style={{ width: "20px", height: "20px" }} /> Prioridad
            </label>
            <select value={idPrioridad ?? ""} onChange={(e) => setIdPrioridad(Number(e.target.value) || null)} style={inputStyle}>
              <option value="">Seleccione prioridad</option>
              {prioridades.map(p => <option key={p.ID_PRIORIDAD} value={p.ID_PRIORIDAD}>{p.NOMBRE}</option>)}
            </select>
          </div>
        </div>

        {/* Título */}
        <div style={{ padding: "1rem", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem", fontWeight: 600 }}>
            <img src={messageIcon} alt="" style={{ width: "20px", height: "20px" }} /> Título
          </label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Impresora fuera de servicio" style={inputStyle} />
        </div>

        {/* Descripción */}
        <div style={{ padding: "1rem", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem", fontWeight: 600 }}>
            <img src={alertIcon} alt="" style={{ width: "20px", height: "20px" }} /> Descripción
          </label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el problema con detalle..." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* Botón */}
<div style={{ display: "flex", justifyContent: "flex-end" }}>
  <button type="submit" disabled={loading} style={{
    background: "#38a169",  // verde
    color: "#fff",
    padding: "0.9rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s"
  }}
  onMouseOver={(e) => (e.currentTarget.style.background = "#2f855a")}
  onMouseOut={(e) => (e.currentTarget.style.background = "#38a169")}
  >
    <img src={clockIcon} alt="" style={{ width: "20px", height: "20px" }} />
    {loading ? "Guardando..." : "Crear Caso"}
  </button>
</div>
      </form>
    </div>
  );
}
