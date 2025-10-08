import { Departamento } from "../models/Departamento.js";

// Listar todos los departamentos
export const getDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener departamento por ID
export const getDepartamentoById = async (req, res) => {
  try {
    const departamento = await Departamento.findByPk(req.params.id);
    if (!departamento) return res.status(404).json({ msg: "Departamento no encontrado" });
    res.json(departamento);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Crear departamento
export const createDepartamento = async (req, res) => {
  try {
    const nuevoDepartamento = await Departamento.create(req.body);
    res.status(201).json(nuevoDepartamento);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Actualizar departamento
export const updateDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = await Departamento.findByPk(id);
    if (!departamento) return res.status(404).json({ msg: "Departamento no encontrado" });

    await departamento.update(req.body);
    res.json({ msg: "Departamento actualizado", departamento });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Eliminar departamento
export const deleteDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = await Departamento.findByPk(id);
    if (!departamento) return res.status(404).json({ msg: "Departamento no encontrado" });

    await departamento.destroy();
    res.json({ msg: "Departamento eliminado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
