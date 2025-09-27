import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function CrearCaso() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Crear Nuevo Caso
      </h2>
      <form className="flex flex-col gap-6">
        {/* ID Empleado Solicita */}
        <div className="flex items-center bg-white border border-gray-300 rounded-2xl p-5 h-16 gap-4">
          <img src="/src/assets/userr.png" alt="Empleado" className="w-6 h-6" />
          <input
            type="number"
            placeholder="ID Empleado Solicita"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
          />
        </div>

        {/* ID Tipo Incidencia */}
        <div className="flex items-center bg-white border border-gray-300 rounded-2xl p-5 h-16 gap-4">
          <img src="/src/assets/alert.jpeg" alt="Tipo Incidencia" className="w-6 h-6" />
          <input
            type="number"
            placeholder="ID Tipo Incidencia"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
          />
        </div>

        {/* Título */}
        <div className="flex items-center bg-white border border-gray-300 rounded-2xl p-5 h-16 gap-4">
          <img src="/src/assets/file.png" alt="Título" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Título"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
          />
        </div>

        {/* Descripción */}
        <div className="flex items-start bg-white border border-gray-300 rounded-2xl p-5 gap-4">
          <img src="/src/assets/message.png" alt="Descripción" className="w-6 h-6 mt-1" />
          <textarea
            placeholder="Descripción"
            rows={4}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base resize-none"
          />
        </div>

        {/* ID Prioridad */}
        <div className="flex items-center bg-white border border-gray-300 rounded-2xl p-5 h-16 gap-4">
          <img src="/src/assets/flag.png" alt="Prioridad" className="w-6 h-6" />
          <input
            type="number"
            placeholder="ID Prioridad"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
          />
        </div>

        {/* ID SLA */}
        <div className="flex items-center bg-white border border-gray-300 rounded-2xl p-5 h-16 gap-4">
          <img src="/src/assets/clock.png" alt="SLA" className="w-6 h-6" />
          <input
            type="number"
            placeholder="ID SLA"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition duration-200 text-lg flex items-center justify-center gap-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Crear
        </button>
      </form>
    </div>
  );
}


// API: http://localhost:4000/api/casos
//json:
/**
 * {
  "id_empleado_solicita": 2,
  "id_tipo_incidencia": 1,
  "titulo": "Impresora bloqueada",
  "descripcion": "La impresora del área de finanzas no imprime",
  "id_prioridad": 1,
  "id_sla": 1
}

 * 
 */