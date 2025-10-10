import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import logoFormImg from "../assets/logoform.png";

interface Prioridad { ID_PRIORIDAD: number; NOMBRE: string; }
interface TipoIncidencia { ID_TIPO: number; TIPO: string; }
interface Incidencia { id_incidencia: number; nombre: string; }

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
  const [fechaCreacion, setFechaCreacion] = useState<Date>(new Date());
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

    const data = {
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
      const res = await axios.post("http://localhost:4000/api/casos", data);
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

  const estilos = {
    contenedor: { display: "flex", gap: "2rem", maxWidth: "1100px", margin: "0 auto", minHeight: "90vh", padding: "2rem", backgroundColor: "#e2e2e2" },
    formularioWrapper: { flex: 5 },
    formulario: { display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#d9d9d9", padding: "2rem", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.2)" },
    filaSelects: { display: "flex", gap: "1rem" },
    campo: { display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1 },
    label: { fontWeight: 600, color: "#333" },
    select: { padding: "0.5rem", borderRadius: "8px", border: "1px solid #198754", background: "#fff", color: "#000" },
    input: { padding: "0.5rem", borderRadius: "8px", border: "1px solid #198754", background: "#fff", color: "#000" },
    textarea: { padding: "0.5rem", borderRadius: "8px", border: "1px solid #0dcaf0", background: "#fff", color: "#000", resize: "vertical", minHeight: "100px" },
    filaFecha: { display: "flex", gap: "1rem", alignItems: "center" },
    inputFecha: { flex: 1, padding: "0.5rem", borderRadius: "8px", border: "1px solid #6c757d", background: "#fff", color: "#000", width: "100%" },
    botonCrear: { marginTop: "1rem", background: "#38a169", color: "#fff", padding: "0.9rem 1.5rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
    imagenContainer: { flex: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },
    imagen: { width: "100%", maxHeight: "100vh", objectFit: "cover", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" },
  };

  return (
    <div style={{ background: "#e2e2e2", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={estilos.contenedor}>
        {/* Formulario */}
        <div style={estilos.formularioWrapper}>
          <form style={estilos.formulario} onSubmit={handleSubmit}>
            {/* Selects */}
            <div style={estilos.filaSelects}>
              <div style={estilos.campo}>
                <label style={estilos.label}>Tipo de Incidencia</label>
                <select value={idTipo ?? ""} onChange={(e) => setIdTipo(Number(e.target.value) || null)} style={estilos.select}>
                  <option value="">Seleccione tipo</option>
                  {tiposIncidencia.map(t => <option key={t.ID_TIPO} value={t.ID_TIPO}>{t.TIPO}</option>)}
                </select>
              </div>
              <div style={estilos.campo}>
                <label style={estilos.label}>Incidencia</label>
                <select value={idIncidencia ?? ""} onChange={(e) => setIdIncidencia(Number(e.target.value) || null)} style={estilos.select}>
                  <option value="">Seleccione incidencia</option>
                  {incidencias.map(i => <option key={i.id_incidencia} value={i.id_incidencia}>{i.nombre}</option>)}
                </select>
              </div>
              <div style={estilos.campo}>
                <label style={estilos.label}>Prioridad</label>
                <select value={idPrioridad ?? ""} onChange={(e) => setIdPrioridad(Number(e.target.value) || null)} style={estilos.select}>
                  <option value="">Seleccione prioridad</option>
                  {prioridades.map(p => <option key={p.ID_PRIORIDAD} value={p.ID_PRIORIDAD}>{p.NOMBRE}</option>)}
                </select>
              </div>
            </div>

            {/* Título */}
            <div style={estilos.campo}>
              <label style={estilos.label}>Título</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Impresora fuera de servicio" style={estilos.input} />
            </div>

            {/* Descripción */}
            <div style={estilos.campo}>
              <label style={estilos.label}>Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe el problema con detalle..." style={estilos.textarea} />
            </div>

            {/* Fecha */}
            <div style={estilos.filaFecha}>
              <div style={estilos.campo}>
                <label style={estilos.label}>Fecha y hora</label>
                <ReactDatePicker
                  selected={fechaCreacion}
                  onChange={(date: Date | null) => { if (date) setFechaCreacion(date); }}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Selecciona fecha y hora"
                  style={estilos.inputFecha}
                />
              </div>
            </div>

            {/* Botón */}
            <button type="submit" disabled={loading} style={estilos.botonCrear}>
              {loading ? "Guardando..." : "Crear Caso"}
            </button>
          </form>
        </div>

        {/* Imagen */}
        <div style={estilos.imagenContainer}>
          <img src={logoFormImg} alt="Helpdesk" style={estilos.imagen} />
        </div>
      </div>
    </div>
  );
}
