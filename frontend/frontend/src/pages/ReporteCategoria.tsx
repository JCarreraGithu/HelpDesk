import { useParams } from "react-router-dom";
import ReporteTecnicos from "./reportes/ReporteTecnicos.tsx";
import ReporteCasos from "./reportes/ReporteCasos.tsx";
import ReporteSatisfaccion from "./reportes/ReporteSatisfaccion.tsx";
import ReporteRepuestos from "./reportes/reporteRepuestos.tsx";
import ReporteDepartamentos from "./reportes/ReporteDepartamentos.tsx";
import ReporteEmpleados from "./reportes/ReporteEmpleados.tsx";


export default function ReporteCategoria() {
  const { categoria } = useParams();

  if (categoria === "tecnicos") return <ReporteTecnicos />;

  // Placeholder de las demás (luego las creamos)
  if (categoria === "casos") return <ReporteCasos />;
  if (categoria === "empleados") return <ReporteEmpleados/>;
  if (categoria === "departamentos") return <ReporteDepartamentos />;
  if (categoria === "satisfaccion")return <ReporteSatisfaccion />;
  if (categoria === "repuestos") return <ReporteRepuestos />;
  return <div className="container py-4">⚠️ Categoría no encontrada.</div>;
}
