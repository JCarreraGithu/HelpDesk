import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Repuesto {
  id_repuesto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: string;
}

interface ModalCerrarCasoProps {
  idCaso: number;
  idEmpleado: number;
  estadoActual: string; // 🟢 nuevo: recibimos el estado del caso
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCerrarCaso({
  idCaso,
  idEmpleado,
  estadoActual,
  onClose,
  onSuccess,
}: ModalCerrarCasoProps) {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [seleccionados, setSeleccionados] = useState<{ id_repuesto: number; cantidad: number }[]>([]);
  const [detalles, setDetalles] = useState("");
  const [complicacion, setComplicacion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/repuestos")
      .then((res) => setRepuestos(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los repuestos", "error"));
  }, []);

  const toggleRepuesto = (id: number) => {
    const existe = seleccionados.find((r) => r.id_repuesto === id);
    if (existe) {
      setSeleccionados(seleccionados.filter((r) => r.id_repuesto !== id));
    } else {
      setSeleccionados([...seleccionados, { id_repuesto: id, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    setSeleccionados((prev) =>
      prev.map((r) => (r.id_repuesto === id ? { ...r, cantidad } : r))
    );
  };

  const handleCerrarCaso = async () => {
    if (estadoActual === "Cerrado") {
      Swal.fire("Atención", "Este caso ya está cerrado", "warning");
      return; // 🚫 no permitir cerrar
    }

    if (!detalles.trim()) {
      Swal.fire("Atención", "Debes escribir los detalles de la solución", "warning");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/casos/cerrar/${idCaso}`, {
        id_empleado: idEmpleado,
        detalles,
        complicacion,
        materiales: seleccionados,
      });

      Swal.fire("Éxito", "Caso cerrado correctamente", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cerrar el caso", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative animate-fade-in">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Cerrar Caso #{idCaso}</h2>

        {/* Detalles de la solución */}
        <label className="block mb-2 font-medium">Detalles de la solución</label>
        <textarea
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4 focus:ring focus:ring-blue-300"
          placeholder="Describe la solución del caso..."
          rows={3}
        ></textarea>

        {/* Complicaciones */}
        <label className="block mb-2 font-medium">Complicaciones (opcional)</label>
        <textarea
          value={complicacion}
          onChange={(e) => setComplicacion(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4 focus:ring focus:ring-blue-300"
          placeholder="Describe complicaciones si hubo..."
          rows={2}
        ></textarea>

        {/* Repuestos */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Repuestos utilizados</h3>
        <div className="max-h-40 overflow-y-auto border rounded-lg p-3 mb-4">
          {repuestos.map((r) => {
            const seleccionado = seleccionados.find((s) => s.id_repuesto === r.id_repuesto);
            return (
              <div key={r.id_repuesto} className="flex items-center justify-between py-1 border-b last:border-none">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!seleccionado}
                    onChange={() => toggleRepuesto(r.id_repuesto)}
                  />
                  <span className="font-medium">{r.nombre}</span>
                </div>
                {seleccionado && (
                  <input
                    type="number"
                    min={1}
                    value={seleccionado.cantidad}
                    onChange={(e) => actualizarCantidad(r.id_repuesto, Number(e.target.value))}
                    className="w-16 border rounded-md text-center"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
            disabled={loading || estadoActual === "Cerrado"} // 🚫 deshabilitado si ya está cerrado
            onClick={handleCerrarCaso}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50`}
          >
            {loading ? "Cerrando..." : "Cerrar Caso"}
          </button>
        </div>
      </div>
    </div>
  );
}
