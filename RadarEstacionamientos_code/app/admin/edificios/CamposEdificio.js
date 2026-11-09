import estilos from "../../formularios.module.css";

// Campos comunes para agregar y para modificar un edificio. `valores` trae lo que escribió el
// administrador cuando la acción devolvió un error, para no hacerle escribir todo otra vez.
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
