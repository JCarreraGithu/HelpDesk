export default function CrearCaso() {
  return (
    <div>
      <h2>Crear Nuevo Caso</h2>
      <form>
        <input placeholder="Título" /><br />
        <textarea placeholder="Descripción" /><br />
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}


// API: http://localhost:4000/api/casos
//json:
/**
 * {
  "id_empleado_solicita": 2,
  "id_tipo_incidencia": 1,
  "titulo": "Impresora bloqueada",
  "descripcion": "La impresora del área de finanzas no imprime",
  "id_prioridad": 1,
  "id_sla": 1
}

 * 
 */