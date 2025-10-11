import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCog, FaTimes } from "react-icons/fa";
import tecnicoImg from "../assets/tecnico.png";

interface ModalAsignarTecnicoProps {
  idCaso: number;
  usuario: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface Tecnico {
  id_empleado: number;
  nombre: string;
  apellido: string;
  tipo?: string;
}

export default function ModalAsignarTecnico({
  idCaso,
  usuario,
  onClose,
  onSuccess,
}: ModalAsignarTecnicoProps) {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | null>(null);
  const [comentario, setComentario] = useState<string>("Asignando técnico a este caso");
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/empleados/tecnicos")
      .then((res) => {
        const tipos = ["Técnico de Hardware", "Técnico de Software", "Técnico General"];
        const tecnicosConTipo = res.data.map((t: any, index: number) => ({
          ...t,
          tipo: tipos[index % tipos.length],
        }));
        setTecnicos(tecnicosConTipo);
      })
      .catch((err) => console.error("Error cargando técnicos:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAsignar = async () => {
    if (!tecnicoSeleccionado) {
      setErrorMsg("⚠️ Selecciona un técnico antes de continuar");
      return;
    }

    setErrorMsg(""); // Limpia error anterior si existe
    const tecnico = tecnicos.find((t) => t.id_empleado === tecnicoSeleccionado);

    try {
      await axios.put(`http://localhost:4000/api/casos/asignar-tecnico/${idCaso}`, {
        id_tecnico: tecnicoSeleccionado,
        id_empleado: usuario.id_empleado,
        comentario,
      });

      setMensajeExito(`✅ Caso asignado correctamente a ${tecnico?.nombre} ${tecnico?.apellido}`);
      setTecnicoSeleccionado(null);
      setComentario("Asignando técnico a este caso");

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (error) {
      setErrorMsg("❌ No se pudo asignar el técnico");
    }
  };

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #198754",
    backgroundColor: "#2d2d2d",
    color: "white",
    outline: "none",
    width: "100%",
    marginBottom: "1rem",
    transition: "all 0.2s ease-in-out",
  };

  const selectStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #0dcaf0",
    backgroundColor: "#2d2d2d",
    color: "white",
    outline: "none",
    width: "100%",
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        style={{
          background: "#2d2d2d",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          padding: "1.5rem",
          width: "650px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
        }}
      >
        {/* 🔹 Columna izquierda */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Título y cerrar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                color: "#198754",
                fontSize: "1.25rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaUserCog /> Asignar Técnico
            </h2>
            <button
              onClick={onClose}
              style={{ color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* 🔹 Mensaje de error dentro del modal */}
          {errorMsg && (
            <div
              style={{
                background: "#721c24",
                color: "white",
                padding: "0.5rem",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* 🔹 Mensaje de éxito */}
          {mensajeExito && (
            <div
              style={{
                backgroundColor: "#198754",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {mensajeExito}
            </div>
          )}

          {/* 🔹 Formulario */}
          {loading ? (
            <p style={{ textAlign: "center", color: "#ccc", fontStyle: "italic" }}>Cargando técnicos...</p>
          ) : (
            <>
              <label style={{ color: "#fff", fontWeight: 600, marginBottom: "0.3rem" }}>Selecciona un técnico:</label>
              <select
                value={tecnicoSeleccionado || ""}
                onChange={(e) => setTecnicoSeleccionado(Number(e.target.value))}
                style={selectStyle}
              >
                <option value="">-- Seleccionar Técnico --</option>
                {tecnicos.map((t) => (
                  <option key={t.id_empleado} value={t.id_empleado}>
                    {t.nombre} {t.apellido} — {t.tipo}
                  </option>
                ))}
              </select>

              <label style={{ color: "#fff", fontWeight: 600, marginBottom: "0.3rem" }}>Comentario:</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                style={{ ...inputStyle, height: "100px", resize: "none" }}
                placeholder="Agregar comentario..."
              />
            </>
          )}

          {/* 🔹 Botones */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={onClose}
              style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a6268")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c757d")}
            >
              Cancelar
            </button>
            <button
              onClick={handleAsignar}
              style={{ ...buttonStyle, backgroundColor: "#198754", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#157347")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#198754")}
            >
              Asignar
            </button>
          </div>
        </div>

        {/* 🔹 Imagen derecha */}
        <div style={{ flex: 0.8, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={tecnicoImg}
            alt="Técnico"
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
            }}
          />
        </div>
      </div>
    </div>
  );
}
