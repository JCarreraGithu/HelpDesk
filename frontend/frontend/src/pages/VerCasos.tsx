import CasoCard from '../components/CasoCard';

const casosMock = [
  { id_caso: 1, titulo: 'Impresora bloqueada', empleado: 'Ana Gómez', tipo_incidencia: 'Hardware', prioridad: 'Alta', fecha_creacion: '2025-09-15' }
];

export default function VerCasos() {
  return (
    <>
      <h2>Listado de Casos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Prioridad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>101</td>
            <td>Error de inicio de sesión</td>
            <td>Alta</td>
            <td>Abierto</td>
          </tr>
          <tr>
            <td>102</td>
            <td>Problema con impresora</td>
            <td>Media</td>
            <td>En proceso</td>
          </tr>
          <tr>
            <td>103</td>
            <td>Solicitud de acceso VPN</td>
            <td>Baja</td>
            <td>Cerrado</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}