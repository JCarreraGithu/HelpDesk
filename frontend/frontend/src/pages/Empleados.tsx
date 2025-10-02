import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface Empleado {
  id_departamento: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
  activo: string;
  id_puesto: number;
}

const departamentos = [
  { id: 1, nombre: "Soporte Técnico" },
  { id: 2, nombre: "Sistemas" },
  { id: 21, nombre: "Soporte Técnico" },
  { id: 22, nombre: "Sistemas" },
  { id: 23, nombre: "Recursos Humanos" },
  { id: 24, nombre: "Finanzas" },
  { id: 25, nombre: "Ventas" },
  { id: 26, nombre: "Marketing" },
  { id: 27, nombre: "Logística" },
  { id: 28, nombre: "Compras" },
  { id: 29, nombre: "Desarrollo" },
  { id: 30, nombre: "Legal" },
];

const puestos = [
  { id: 1, nombre: "Técnico de Soporte" },
  { id: 2, nombre: "Analista de Sistemas" },
  { id: 3, nombre: "Supervisor" },
  { id: 4, nombre: "Administrador" },
  { id: 5, nombre: "Desarrollador" },
  { id: 6, nombre: "Montacarguista" },
];

export default function FormularioEmpleado({ onGuardar, onCerrar }: { onGuardar: (data: Empleado) => void, onCerrar: () => void }) {
  const [empleado, setEmpleado] = useState<Empleado>({
    id_departamento: 1,
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    rol: "AGENTE",
    activo: "S",
    id_puesto: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmpleado(prev => ({ ...prev, [name]: name.includes("id_") ? parseInt(value) : value }));
  };

  const handleSubmit = () => {
    if (!empleado.nombre || !empleado.apellido || !empleado.correo) {
      alert("Nombre, Apellido y Correo son obligatorios");
      return;
    }
    onGuardar(empleado);
  };

  return (
    <div style={{
      background: "#fff", padding: "1rem 1.5rem", borderRadius: "12px",
      width: "350px", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
    }}>
      <button onClick={onCerrar} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", border: "none", background: "transparent", cursor: "pointer" }}>
        <FaTimes />
      </button>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Agregar Empleado</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={empleado.nombre}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={empleado.apellido}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={empleado.correo}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={empleado.telefono}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <select
          name="id_departamento"
          value={empleado.id_departamento}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          {departamentos.map(d => (
            <option key={d.id} value={d.id}>{d.nombre}</option>
          ))}
        </select>

        <select
          name="id_puesto"
          value={empleado.id_puesto}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          {puestos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>

        <select
          name="rol"
          value={empleado.rol}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="AGENTE">AGENTE</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <select
          name="activo"
          value={empleado.activo}
          onChange={handleChange}
          style={{ padding: "0.4rem", fontSize: "0.9rem", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="S">Activo</option>
          <option value="N">Inactivo</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#198754", color: "#fff", padding: "0.5rem",
            borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "0.5rem"
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
