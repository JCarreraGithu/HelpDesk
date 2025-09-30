import { Repuestos } from "../models/Repuestos.js";

// Crear repuesto
export const crearRepuesto = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio_unitario } = req.body;
    const nuevoRepuesto = await Repuestos.create({ nombre, descripcion, stock, precio_unitario });
    res.status(201).json(nuevoRepuesto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear repuesto" });
  }
};

// Listar todos los repuestos
export const listarRepuestos = async (req, res) => {
  try {
    const repuestos = await Repuestos.findAll();
    res.json(repuestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener repuestos" });
  }
};

// Buscar repuesto por ID
export const buscarRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const repuesto = await Repuestos.findByPk(id);
    if (!repuesto) return res.status(404).json({ mensaje: "Repuesto no encontrado" });
    res.json(repuesto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar repuesto" });
  }
};

// Editar repuesto
export const editarRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, stock, precio_unitario } = req.body;

    const repuesto = await Repuestos.findByPk(id);
    if (!repuesto) return res.status(404).json({ mensaje: "Repuesto no encontrado" });

    if (nombre) repuesto.nombre = nombre;
    if (descripcion) repuesto.descripcion = descripcion;
    if (stock !== undefined) repuesto.stock = stock;
    if (precio_unitario !== undefined) repuesto.precio_unitario = precio_unitario;

    await repuesto.save();
    res.json(repuesto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar repuesto" });
  }
};

// Eliminar repuesto
export const eliminarRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Repuestos.destroy({ where: { id_repuesto: id } });
    if (!eliminado) return res.status(404).json({ mensaje: "Repuesto no encontrado" });
    res.json({ mensaje: "Repuesto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar repuesto" });
  }
};

// Buscar repuesto por nombre parcial
export const buscarRepuestoPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ mensaje: "Se requiere un nombre para buscar" });

    const repuestos = await Repuestos.findAll({
      where: { nombre: { [Op.like]: `%${nombre}%` } }
    });

    res.json(repuestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar repuestos por nombre" });
  }
};