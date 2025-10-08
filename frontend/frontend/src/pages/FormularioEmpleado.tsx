import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import empleadoImg from "../assets/empleado.png";

interface FormularioEmpleadoProps {
  onClose: () => void;
  onSave: () => void;
}

const FormularioEmpleado: React.FC<FormularioEmpleadoProps> = ({ onClose, onSave }) => {
  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    id_departamento: "",
    id_puesto: "",
    rol: "",
    activo: "S",
  });

  const [departamentos, setDepartamentos] = useState<{ id_departamento: number; nombre: string }[]>([]);
  const [puestos, setPuestos] = useState<{ id_puesto: number; nombre: string }[]>([]);

  // Cargar departamentos y puestos desde el backend
  useEffect(() => {
    fetch("http://localhost:4000/api/departamentos")
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error(err));

    fetch("http://localhost:4000/api/puestos")
      .then(res => res.json())
      .then(data => setPuestos(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      if (/^\d*$/.test(value)) {
        setEmpleado({ ...empleado, [name]: value });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Solo números",
          text: "Ingrese solo caracteres numéricos en el campo teléfono.",
          confirmButtonColor: "#198754",
          background: "#2d2d2d",
          color: "white",
          iconColor: "#ffc107",
        });
      }
      return;
    }

    setEmpleado({ ...empleado, [name]: value });
  };

  const handleSubmit = () => {
    // Validar campos obligatorios
    if (
      !empleado.nombre.trim() ||
      !empleado.apellido.trim() ||
      !empleado.correo.trim() ||
      !empleado.telefono.trim() ||
      !empleado.id_departamento ||
      !empleado.id_puesto ||
      !empleado.rol
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos obligatorios.",
        confirmButtonColor: "#198754",
      });
      return;
    }

    const empleadoEnviar = {
      ...empleado,
      id_departamento: Number(empleado.id_departamento),
      id_puesto: Number(empleado.id_puesto),
      activo: "S",
    };

    fetch("http://localhost:4000/api/empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleadoEnviar),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Empleado agregado",
          timer: 1200,
          showConfirmButton: false,
        });
        onSave();
        onClose();
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar el empleado. Revise los datos o consulte al administrador.",
          confirmButtonColor: "#198754",
        });
      });
  };

  const estilosInputs = {
    nombre: { padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #198754", fontSize: "0.9rem", backgroundColor: "#3b3b3b", color: "white", width: "60%", boxShadow: "0 0 6px rgba(25,135,84,0.3)", outline: "none" },
    apellido: { padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #555", fontSize: "0.9rem", backgroundColor: "#444", color: "white", width: "60%", outline: "none" },
    correo: { padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #0dcaf0", fontSize: "0.9rem", backgroundColor: "#2d2d2d", color: "white", width: "50%", boxShadow: "0 0 6px rgba(13,202,240,0.3)", outline: "none" },
    telefono: { padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #ffc107", fontSize: "0.9rem", backgroundColor: "#383838", color: "white", width: "50%", outline: "none", boxShadow: "0 0 5px rgba(255,193,7,0.3)" },
    selectRol: { padding: "0.45rem 0.75rem", borderRadius: "8px", border: "1px solid #198754", backgroundColor: "#3b3b3b", color: "white", width: "60%", cursor: "pointer" },
    selectDepto: { padding: "0.45rem 0.75rem", borderRadius: "8px", border: "1px solid #0dcaf0", backgroundColor: "#2d2d2d", color: "white", width: "60%", cursor: "pointer" },
    selectPuesto: { padding: "0.45rem 0.75rem", borderRadius: "8px", border: "1px solid #ffc107", backgroundColor: "#383838", color: "white", width: "60%", cursor: "pointer" },
  };

  const buttonStyle = { padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.95rem", transition: "all 0.2s ease-in-out" };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "2rem", padding: "1.5rem", background: "#2d2d2d", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.3)", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        <h3 style={{ textAlign: "center", color: "#198754" }}>Agregar Empleado</h3>
        <Campo texto="👤 Nombre:" name="nombre" value={empleado.nombre} onChange={handleChange} style={estilosInputs.nombre} />
        <Campo texto="📝 Apellido:" name="apellido" value={empleado.apellido} onChange={handleChange} style={estilosInputs.apellido} />
        <Campo texto="📧 Correo:" name="correo" value={empleado.correo} onChange={handleChange} style={estilosInputs.correo} />
        <Campo texto="📞 Teléfono:" name="telefono" value={empleado.telefono} onChange={handleChange} style={estilosInputs.telefono} />
        <SelectCampo texto="🔑 Rol:" name="rol" value={empleado.rol} onChange={handleChange} style={estilosInputs.selectRol} options={[
          { value: "", text: "Seleccione un rol" },
          { value: "USUARIO", text: "USUARIO" },
          { value: "AGENTE", text: "AGENTE" },
          { value: "SUPERVISOR", text: "SUPERVISOR" },
          { value: "ADMIN", text: "ADMIN" },
        ]} />
        <SelectCampo texto="🏢 Departamento:" name="id_departamento" value={empleado.id_departamento} onChange={handleChange} style={estilosInputs.selectDepto} options={[
          { value: "", text: "Seleccione un departamento" },
          ...departamentos.map(d => ({ value: d.id_departamento, text: d.nombre })),
        ]} />
        <SelectCampo texto="💼 Puesto:" name="id_puesto" value={empleado.id_puesto} onChange={handleChange} style={estilosInputs.selectPuesto} options={[
          { value: "", text: "Seleccione un puesto" },
          ...puestos.map(p => ({ value: p.id_puesto, text: p.nombre })),
        ]} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#5a6268")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#6c757d")}>Volver</button>
          <button onClick={handleSubmit} style={{ ...buttonStyle, backgroundColor: "#198754", color: "white" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#157347")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#198754")}>Guardar</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={empleadoImg} alt="Empleado" style={{ width: "180px", height: "180px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }} />
      </div>
    </div>
  );
};

interface CampoProps {
  texto: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style: React.CSSProperties;
}

const Campo: React.FC<CampoProps> = ({ texto, name, value, onChange, style }) => (
  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
    <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>{texto}</span>
    <input name={name} placeholder={`Escriba el ${name}`} value={value} onChange={onChange} style={style}
      onFocus={e => (e.target.style.border = "2px solid #198754")}
      onBlur={e => (e.target.style.border = style.border ?? "1px solid #555")} />
  </div>
);

interface SelectCampoProps {
  texto: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style: React.CSSProperties;
  options: { value: string | number; text: string }[];
}

const SelectCampo: React.FC<SelectCampoProps> = ({ texto, name, value, onChange, style, options }) => (
  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
    <span style={{ width: "120px", color: "#fff", fontWeight: "bold" }}>{texto}</span>
    <select name={name} value={value} onChange={onChange} style={style}>
      {options.map((opt, i) => (
        <option key={i} value={opt.value} disabled={opt.value === ""}>{opt.text}</option>
      ))}
    </select>
  </div>
);

export default FormularioEmpleado;
