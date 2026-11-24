// Puente /api/base/<ruta> → app base. LA RUTA: solo le pasa la petición a PuenteAppBase
// (conexion_app/PuenteAppBase.js), que decide qué se reenvía y con qué credenciales.
import { PuenteAppBase } from "../../../../conexion_app/PuenteAppBase.js";

export const dynamic = "force-dynamic";

const puente = new PuenteAppBase();
const reenviar = (request, contexto) => puente.reenviar(request, contexto);

export { reenviar as GET, reenviar as POST, reenviar as PATCH };
