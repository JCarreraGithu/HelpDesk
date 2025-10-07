import { Departamento } from "../models/Departamento.js";

// ✅ Obtener todos los departamentos
export const getDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();
    res.json(departamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener departamentos" });
  }
};

// ✅ Obtener un departamento por ID
export const getDepartamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = await Departamento.findByPk(id);

    if (!departamento) {
      return res.status(404).json({ mensaje: "Departamento no encontrado" });
    }

    res.json(departamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar el departamento" });
  }
};

// ✅ Buscar por nombre (coincidencia parcial)
export const buscarDepartamentoPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    const departamentos = await Departamento.findAll({
      where: {
        nombre: { [Op.like]: `%${nombre}%` },
      },
    });

    res.json(departamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar por nombre" });
  }
};

// ✅ Crear nuevo departamento
export const crearDepartamento = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Departamento.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ mensaje: "El nombre ya existe" });
    }

    const nuevoDepartamento = await Departamento.create({
      nombre,
      descripcion,
    });

    res.status(201).json(nuevoDepartamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el departamento" });
  }
};

// ✅ Actualizar departamento
export const actualizarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const departamento = await Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ mensaje: "Departamento no encontrado" });
    }

    await departamento.update({ nombre, descripcion });
    res.json({ mensaje: "Departamento actualizado correctamente", departamento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el departamento" });
  }
};

// ✅ Eliminar departamento
export const eliminarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;

    const departamento = await Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ mensaje: "Departamento no encontrado" });
    }

    await departamento.destroy();
    res.json({ mensaje: "Departamento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el departamento" });
  }
};
