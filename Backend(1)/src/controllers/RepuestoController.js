import Repuesto from "../models/Repuesto.js";

// GET all
export const getAllRepuestos = async (req, res) => {
  const repuestos = await Repuesto.findAll();
  res.json(repuestos);
};

// GET by id
export const getRepuestoById = async (req, res) => {
  const repuesto = await Repuesto.findByPk(req.params.id);
  if (!repuesto) return res.status(404).json({ msg: "Repuesto no encontrado" });
  res.json(repuesto);
};

// POST
export const createRepuesto = async (req, res) => {
  const { nombre, descripcion, stock, precio_unitario } = req.body;
  const nuevo = await Repuesto.create({ nombre, descripcion, stock, precio_unitario });
  res.json(nuevo);
};

// PUT
export const updateRepuesto = async (req, res) => {
  const { id } = req.params;
  const repuesto = await Repuesto.findByPk(id);
  if (!repuesto) return res.status(404).json({ msg: "Repuesto no encontrado" });

  const { nombre, descripcion, stock, precio_unitario } = req.body;
  await repuesto.update({ nombre, descripcion, stock, precio_unitario });
  res.json(repuesto);
};

// DELETE
export const deleteRepuesto = async (req, res) => {
  const { id } = req.params;
  const repuesto = await Repuesto.findByPk(id);
  if (!repuesto) return res.status(404).json({ msg: "Repuesto no encontrado" });

  await repuesto.destroy();
  res.json({ msg: "Repuesto eliminado correctamente" });
};
