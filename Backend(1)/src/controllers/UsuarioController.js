import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear usuario
export const createUsuario = async (req, res) => {
  try {
    const { id_empleado, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      id_empleado,
      username,
      password: hashedPassword,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_empleado, username, password, ultimo_login } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }
    if (id_empleado) usuario.id_empleado = id_empleado;
    if (username) usuario.username = username;
    if (ultimo_login) usuario.ultimo_login = ultimo_login;

    await usuario.save();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
