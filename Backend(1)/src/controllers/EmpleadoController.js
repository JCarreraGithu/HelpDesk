import { Empleado } from "../models/Empleado.js";

// Mostrar todos los empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Buscar por ID
export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ msg: "Empleado no encontrado" });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Buscar por nombre
export const getEmpleadoByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ msg: "Debe enviar el nombre a buscar" });

    const empleados = await Empleado.findAll({
      where: { nombre }
    });

    if (empleados.length === 0) return res.status(404).json({ msg: "No se encontraron empleados" });

    res.json(empleados);
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

// Actualizar empleado
export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ msg: "Empleado no encontrado" });

    await empleado.update(req.body);
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Activar o desactivar un empleado
export const toggleActivoEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body; // enviar { "activo": "S" } o { "activo": "N" }

    if (!['S','N'].includes(activo)) return res.status(400).json({ msg: "Valor de 'activo' inválido" });

    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ msg: "Empleado no encontrado" });

    await empleado.update({ activo });
    res.json({ msg: `Empleado ${activo === 'S' ? 'activado' : 'dado de baja'}`, empleado });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

