import { Usuario } from "../models/Usuarios.js";
import bcrypt from "bcryptjs";
import { Empleado } from "../models/Empleado.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: { username }, // esto es correcto
      include: { model: Empleado, attributes: ["nombre", "apellido", "rol"] },
    });

    if (!usuario) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Actualizar ultimo_login opcional
    await usuario.update({ ultimo_login: new Date() });

 res.json({
    id_usuario: usuario.id_usuario, 
  id_empleado: usuario.id_empleado,
  nombre: usuario.Empleado.nombre,
  apellido: usuario.Empleado.apellido,
  rol: usuario.Empleado.rol,
  username: usuario.username // <-- agregar esto
});


  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
