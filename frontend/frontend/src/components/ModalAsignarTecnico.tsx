import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface ModalAsignarTecnicoProps {
  idCaso: number;
  usuario: any; // 🟢 Recibe usuario logeado
  onClose: () => void;
  onSuccess: () => void;
}

interface Tecnico {
  id_empleado: number;
  nombre: string;
  apellido: string;
}

export default function ModalAsignarTecnico({ idCaso, usuario, onClose, onSuccess }: ModalAsignarTecnicoProps) {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | null>(null);
  const [comentario, setComentario] = useState<string>("Asignando técnico a este caso");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/empleados/tecnicos")
      .then((res) => setTecnicos(res.data))
      .catch((err) => console.error("Error cargando técnicos:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAsignar = async () => {
    if (!tecnicoSeleccionado) {
      Swal.fire("Atención", "Selecciona un técnico antes de continuar", "warning");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/casos/asignar-tecnico/${idCaso}`, {
        id_tecnico: tecnicoSeleccionado,
        id_empleado: usuario.id_empleado,
        comentario: comentario
      });

      Swal.fire("✅ Éxito", "Técnico asignado correctamente", "success");
      onSuccess();
    } catch (error) {
      Swal.fire("❌ Error", "No se pudo asignar el técnico", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] animate-fadeIn">
        <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">
          Asignar Técnico al Caso
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando técnicos...</p>
        ) : (
          <>
            <select
              value={tecnicoSeleccionado || ""}
              onChange={(e) => setTecnicoSeleccionado(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mb-4 focus:ring focus:ring-blue-300"
            >
              <option value="">Seleccionar Técnico</option>
              {tecnicos.map((t) => (
                <option key={t.id_empleado} value={t.id_empleado}>
                  {t.nombre} {t.apellido}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Agregar comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:ring focus:ring-blue-300"
            />
          </>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={handleAsignar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Asignar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
