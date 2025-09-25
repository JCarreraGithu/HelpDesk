import { Login } from "../models/Login.js";
import bcrypt from "bcryptjs"; // Para encriptar/validar password
import { Empleado } from "../models/Empleado.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Login.findOne({
      where: { username },
      include: { model: Empleado, attributes: ["nombre", "apellido", "rol"] }
    });

    if (!usuario) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    // Validar password
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Retornar datos del usuario
    res.json({
      id_empleado: usuario.Empleado?.id_empleado || null,
      nombre: usuario.Empleado.nombre,
      apellido: usuario.Empleado.apellido,
      rol: usuario.Empleado.rol
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
