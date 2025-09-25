import { Usuario } from "../models/Usuarios.js";
import { Empleado } from "../models/Empleado.js";
import bcrypt from "bcryptjs";

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const { id_empleado, username, password, activo = "S" } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      id_empleado,
      username,
      password: hashedPassword,
      activo,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear usuario" });
  }
};

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: { model: Empleado, attributes: ["nombre", "apellido", "rol"] },
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

// Buscar usuario por ID
export const buscarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({
      where: { id_usuario: id },
      include: { model: Empleado, attributes: ["nombre", "apellido", "rol"] },
    });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar usuario" });
  }
};

// Editar usuario
export const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, activo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    if (password) usuario.password = await bcrypt.hash(password, 10);
    if (username) usuario.username = username;
    if (activo) usuario.activo = activo;

    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.destroy({ where: { id_usuario: id } });
    if (!eliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};
