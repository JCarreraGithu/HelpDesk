import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FormularioEmpleado from "./FormularioEmpleado";
import empleadoImg from "../assets/empleado.png";
import lupaIcon from "../assets/lupa.png";
import todosIcon from "../assets/todos.png";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const puestosDisponibles = [
  { id: 1, nombre: "Técnico de Soporte" },
  { id: 2, nombre: "Analista de Sistemas" },
  { id: 3, nombre: "Supervisor" },
  { id: 4, nombre: "Administrador" },
  { id: 5, nombre: "Desarrollador" },
  { id: 6, nombre: "Montacarguista" },
];

const Empleados = () => {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/empleados");
      const data = await res.json();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setEmpleados([]);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const darDeBajaEmpleado = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/empleados/activo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: "N" }),
      });
      if (!res.ok) throw new Error("Error al dar de baja");
      await fetchEmpleados();
      MySwal.fire({
        icon: "success",
        title: "Empleado dado de baja",
        confirmButtonColor: "#198754",
      });
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo dar de baja al empleado.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const buscarEmpleado = async () => {
    if (!busqueda.trim()) return fetchEmpleados();
    try {
      const res = await fetch(`http://localhost:4000/api/empleados/buscar/nombre?nombre=${busqueda}`);
      if (!res.ok) {
        MySwal.fire({
          icon: "warning",
          title: "Empleado no encontrado",
          confirmButtonColor: "#0d6efd",
        });
        setEmpleados([]);
        return;
      }
      const data = await res.json();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      MySwal.fire({ icon: "error", title: "Error", confirmButtonColor: "#dc3545" });
    }
  };

  const actualizarEmpleado = async (id: number, payload: any) => {
    try {
      const res = await fetch(`http://localhost:4000/api/empleados/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      await fetchEmpleados();
      MySwal.fire({
        icon: "success",
        title: "Empleado actualizado",
        confirmButtonColor: "#198754",
      });
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar al empleado",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const mostrarDetalleEmpleado = (emp: any) => {
    let isEditMode = false;

    const renderHtml = () => {
      const containerStyle = `
        display:flex; 
        gap:20px; 
        align-items:center; 
        text-align:left; 
        max-width:600px; 
        margin:auto; 
        background:#f0f0f0; 
        padding:20px; 
        border-radius:12px; 
        box-shadow:0 4px 15px rgba(0,0,0,0.2);
      `;

      if (!isEditMode) {
        return `
          <div style="${containerStyle}">
            <div style="text-align:center;">
              <img src="${empleadoImg}" alt="Empleado" 
                style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid #0d6efd;" />
              <br/>
              <button id="verFotoBtn" style="margin-top:10px; background:#0d6efd; color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">
                🔍 Ver Foto
              </button>
            </div>
            <div style="flex:1; font-size:15px; line-height:1.6;">
              <p>📧 Correo: ${emp.correo}</p>
              <p>📞 Teléfono: ${emp.telefono}</p>
              <p>💼 Puesto: ${emp.Puesto?.nombre || "N/A"}</p>
              <p>🛠 Rol: ${emp.rol}</p>
              <p>✅ Activo: ${emp.activo}</p>
              <button id="editarBtn" style="margin-top:10px; background:#198754; color:white; border:none; border-radius:8px; padding:8px 14px; cursor:pointer;">
                Editar
              </button>
              <button id="darBajaBtn" style="margin-top:10px; background:#dc3545; color:white; border:none; border-radius:8px; padding:8px 14px; cursor:pointer;">
                Dar de baja
              </button>
            </div>
          </div>
        `;
      } else {
        return `
          <div style="${containerStyle}">
            <div style="text-align:center;">
              <img src="${empleadoImg}" alt="Empleado" 
                style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid #0d6efd;" />
              <br/>
              <button id="verFotoBtn" style="margin-top:10px; background:#0d6efd; color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">
                🔍 Ver Foto
              </button>
            </div>
            <div style="flex:1; font-size:15px; line-height:1.6;">
              <p>📧 Correo:<br/><input type="text" id="correoInput" value="${emp.correo}" 
                style="width:100%; padding:8px; margin-top:4px; border-radius:6px; border:1px solid #ccc; font-size:14px;"/></p>
              
              <p>📞 Teléfono:<br/>
                <input type="text" id="telefonoInput" value="${emp.telefono}" 
                style="width:100%; padding:8px; margin-top:4px; border-radius:6px; border:1px solid #ccc; font-size:14px;"/>
                <span id="telefonoError" style="color:red; font-size:12px; display:block; margin-top:4px;"></span>
              </p>

              <p>💼 Puesto:<br/>
                <select id="puestoSelect" style="width:100%; padding:8px; margin-top:4px; border-radius:6px; border:1px solid #ccc; font-size:14px;">
                  <option value="">Seleccione el nuevo puesto</option>
                  ${puestosDisponibles.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("")}
                </select>
              </p>

              <p>🛠 Rol:<br/>
                <select id="rolSelect" style="width:100%; padding:8px; margin-top:4px; border-radius:6px; border:1px solid #ccc; font-size:14px;">
                  <option value="">Seleccione el nuevo rol</option>
                  <option value="USUARIO">USUARIO</option>
                  <option value="AGENTE">AGENTE</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </p>

              <motion.button id="guardarBtn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style="margin-top:10px; background:#198754; color:white; border:none; border-radius:8px; padding:8px 14px; cursor:pointer;">
                Guardar
              </motion.button>
            </div>
          </div>
        `;
      }
    };

    const swalInstance = MySwal.fire({
      title: `<h2 style="margin-bottom:15px; color:#0d6efd">${emp.nombre} ${emp.apellido}</h2>`,
      html: renderHtml(),
      showCloseButton: true,
      showConfirmButton: false,
      width: "750px",
      didOpen: () => {
        const verFotoBtn = document.getElementById("verFotoBtn");
        verFotoBtn?.addEventListener("click", () => {
          MySwal.fire({
            title: `${emp.nombre} ${emp.apellido}`,
            imageUrl: empleadoImg,
            imageWidth: 400,
            imageHeight: 400,
            confirmButtonColor: "#0d6efd",
          });
        });

        const darBajaBtn = document.getElementById("darBajaBtn");
        darBajaBtn?.addEventListener("click", async () => {
          MySwal.close();
          await darDeBajaEmpleado(emp.id_empleado);
        });

        const editarBtn = document.getElementById("editarBtn");
        editarBtn?.addEventListener("click", () => {
          isEditMode = true;
          swalInstance.update({ html: renderHtml() });

          // Validación teléfono
          const telefonoInput = document.getElementById("telefonoInput") as HTMLInputElement;
          const telefonoError = document.getElementById("telefonoError") as HTMLSpanElement;

          telefonoInput.addEventListener("input", (e) => {
            const input = e.target as HTMLInputElement;
            if (/^\d*$/.test(input.value)) {
              telefonoError.textContent = "";
            } else {
              telefonoError.textContent = "Solo caracteres numéricos";
              input.value = input.value.replace(/\D/g, "");
            }
          });

          // Guardar cambios
          const guardarBtn = document.getElementById("guardarBtn");
          guardarBtn?.addEventListener("click", async () => {
            const updatedData = {
              correo: (document.getElementById("correoInput") as HTMLInputElement).value,
              telefono: (document.getElementById("telefonoInput") as HTMLInputElement).value,
              id_puesto: Number((document.getElementById("puestoSelect") as HTMLSelectElement).value),
              rol: (document.getElementById("rolSelect") as HTMLSelectElement).value,
            };
            MySwal.close();
            await actualizarEmpleado(emp.id_empleado, updatedData);
          });
        });
      },
    });
  };

  return (
    <div style={{ backgroundColor: "#C0C0C0", padding: "1rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input type="text" placeholder="Buscar por nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ width: "250px", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #ccc", fontSize: "0.9rem" }} />
        <img src={lupaIcon} alt="Buscar" onClick={buscarEmpleado} style={{ width: "40px", height: "40px", cursor: "pointer" }} title="Buscar" />
        <button onClick={fetchEmpleados} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0d6efd", color: "white", border: "none", borderRadius: "8px", padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: "0.9rem" }}>
          <img src={todosIcon} alt="Ver Todos" style={{ width: "35px", height: "35px" }} />
          Ver todos
        </button>
      </div>

      <motion.button onClick={() => setMostrarModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        style={{ backgroundColor: "#198754", color: "white", padding: "0.7rem 1.5rem", border: "none", borderRadius: "10px", marginBottom: "1rem", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}>
        <span style={{ fontSize: "1.6rem", fontWeight: "bold" }}>➕</span>
        <span>Dar click para ingresar un nuevo empleado</span>
      </motion.button>

      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0px 4px 15px rgba(0,0,0,0.2)", minWidth: "600px", maxWidth: "900px", width: "90%" }}>
            <FormularioEmpleado onClose={() => setMostrarModal(false)} onSave={fetchEmpleados} />
          </div>
        </div>
      )}

      <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
        <thead><tr style={{ background: "#f1f1f1" }}><th>ID</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>Teléfono</th><th>Puesto</th><th>Rol</th><th>Activo</th></tr></thead>
        <tbody>
          {empleados.length > 0 ? empleados.map(emp => (
            <tr key={emp.id_empleado}>
              <td>{emp.id_empleado}</td>
              <td style={{ color: "#0d6efd", cursor: "pointer", fontWeight: "bold" }} onClick={() => mostrarDetalleEmpleado(emp)}>{emp.nombre}</td>
              <td>{emp.apellido}</td>
              <td>{emp.correo}</td>
              <td>{emp.telefono}</td>
              <td>{emp.Puesto?.nombre}</td>
              <td>{emp.rol}</td>
              <td>{emp.activo}</td>
            </tr>
          )) : <tr><td colSpan={8} style={{ textAlign: "center" }}>No hay empleados</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Empleados;
