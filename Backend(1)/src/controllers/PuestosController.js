import { Puesto } from "../models/Puestos.js";
import { Op } from "sequelize";

// ✅ Obtener todos los puestos
export const getPuestos = async (req, res) => {
  try {
    const puestos = await Puesto.findAll();
    res.json(puestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener puestos" });
  }
};

// ✅ Obtener un puesto por ID
export const getPuestoById = async (req, res) => {
  try {
    const { id } = req.params;
    const puesto = await Puesto.findByPk(id);

    if (!puesto) {
      return res.status(404).json({ mensaje: "Puesto no encontrado" });
    }

    res.json(puesto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar el puesto" });
  }
};

// ✅ Buscar por nombre (coincidencia parcial)
export const buscarPuestoPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    const puestos = await Puesto.findAll({
      where: {
        nombre: { [Op.like]: `%${nombre}%` },
      },
    });

    res.json(puestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar por nombre" });
  }
};

// ✅ Crear nuevo puesto
export const crearPuesto = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Puesto.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ mensaje: "El nombre ya existe" });
    }

    const nuevoPuesto = await Puesto.create({ nombre, descripcion });
    res.status(201).json(nuevoPuesto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el puesto" });
  }
};

// ✅ Actualizar puesto
export const actualizarPuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const puesto = await Puesto.findByPk(id);
    if (!puesto) {
      return res.status(404).json({ mensaje: "Puesto no encontrado" });
    }

    await puesto.update({ nombre, descripcion });
    res.json({ mensaje: "Puesto actualizado correctamente", puesto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el puesto" });
  }
};

// ✅ Eliminar puesto
export const eliminarPuesto = async (req, res) => {
  try {
    const { id } = req.params;

    const puesto = await Puesto.findByPk(id);
    if (!puesto) {
      return res.status(404).json({ mensaje: "Puesto no encontrado" });
    }

    await puesto.destroy();
    res.json({ mensaje: "Puesto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el puesto" });
  }
};
