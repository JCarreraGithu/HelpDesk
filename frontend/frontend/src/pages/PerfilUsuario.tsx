import { useEffect, useState } from "react";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogeado");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Nombre: {usuario.nombre} {usuario.apellido}</p>
      <p>Rol: {usuario.rol}</p>
      <p>ID Empleado: {usuario.id_empleado}</p>
      <p>Username: {usuario.username}</p>
    </div>
  );
}
