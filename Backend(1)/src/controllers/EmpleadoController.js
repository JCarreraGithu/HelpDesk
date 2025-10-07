import { Empleado } from "../models/Empleado.js";
import { Puesto } from "../models/Puestos.js";

// Listar todos los empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: { model: Puesto, attributes: ["nombre"] },
      attributes: [
        "id_empleado",
        "nombre",
        "apellido",
        "correo",
        "telefono",
        "id_puesto",
        "rol",
        "activo"
      ]
    });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener empleado por ID
export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id, {
      include: { model: Puesto, attributes: ["nombre", "descripcion"] }
    });
    if (!empleado) return res.status(404).json({ msg: "Empleado no encontrado" });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Crear empleado
export const createEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = await Empleado.create(req.body);
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// Activar / Desactivar empleado
export const toggleActivoEmpleado = async (req, res) => {
  try {
    const { activo } = req.body; // "S" o "N"
    if (!["S", "N"].includes(activo)) return res.status(400).json({ msg: "Valor inválido" });

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ msg: "Empleado no encontrado" });

    await empleado.update({ activo });
    res.json({ msg: `Empleado ${activo === "S" ? "activado" : "desactivado"}`, empleado });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener solo técnicos (ejemplo id_puesto = 2)
export const getTecnicos = async (req, res) => {
  try {
    const tecnicos = await Empleado.findAll({
      where: { id_puesto: 2 }, // ID del puesto técnico
      include: { model: Puesto, attributes: ["nombre"] },
      attributes: [
        "id_empleado",
        "nombre",
        "apellido",
        "correo",
        "telefono",
        "id_puesto",
        "rol",
        "activo"
      ]
    });
    res.json(tecnicos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Buscar empleado por nombre
export const getEmpleadoByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ msg: "Debe enviar el nombre a buscar" });

    const empleados = await Empleado.findAll({
      where: { nombre },
      include: { model: Puesto, attributes: ["nombre"] },
      attributes: [
        "id_empleado",
        "nombre",
        "apellido",
        "correo",
        "telefono",
        "id_puesto",
        "rol",
        "activo"
      ]
    });

    if (empleados.length === 0) return res.status(404).json({ msg: "No se encontraron empleados" });

    res.json(empleados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // ⚡ Solo actualiza los campos que realmente llegaron
    await empleado.update(data);

    res.json({
      message: "Empleado actualizado correctamente",
      empleado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar empleado" });
  }
};
