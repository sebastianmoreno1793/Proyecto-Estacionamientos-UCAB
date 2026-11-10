// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// HU 6.1 · Campos comunes de un edificio: nombre, latitud y longitud.
import estilos from "@/estilos/formularios.module.css";

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// Muestra los campos de un edificio (nombre, latitud y longitud); lo usan NuevoEdificio y FilaEdificio. HU 6.1.
// Si la acción devolvió un error, `valores` trae lo que escribió el administrador para no hacerle escribir todo otra vez.
export default function CamposEdificio({ edificio, valores }) {
  const [latitudGuardada, longitudGuardada] = edificio?.ubicacion ?? ["", ""];
  const nombre = valores?.nombre ?? edificio?.nombre ?? "";
  const latitud = valores?.latitud ?? latitudGuardada;
  const longitud = valores?.longitud ?? longitudGuardada;
  return (
    <>
      <label className={estilos.campo}>
        Nombre
        <input type="text" name="nombre" defaultValue={nombre} required maxLength={80} />
      </label>
      <label className={estilos.campo}>
        Latitud (opcional)
        <input type="text" name="latitud" inputMode="decimal" defaultValue={latitud} placeholder="10.4642" />
      </label>
      <label className={estilos.campo}>
        Longitud (opcional)
        <input type="text" name="longitud" inputMode="decimal" defaultValue={longitud} placeholder="-66.9762" />
      </label>
    </>
  );
}
