// POST /api/exportar-maqueta (solo en desarrollo). LA RUTA: le pasa la petición a ExportadorDeMaqueta.
import { ExportadorDeMaqueta } from "../../../conexion_app/ExportadorDeMaqueta.js";

export const dynamic = "force-dynamic";

const exportador = new ExportadorDeMaqueta();
export const POST = (request) => exportador.exportar(request);
