import estilos from "../../formularios.module.css";

// Campos comunes para agregar y para modificar un edificio.
export default function CamposEdificio({ edificio }) {
  const [latitud, longitud] = edificio?.ubicacion ?? ["", ""];
  return (
    <>
      <label className={estilos.campo}>
        Nombre
        <input type="text" name="nombre" defaultValue={edificio?.nombre ?? ""} required maxLength={80} />
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
