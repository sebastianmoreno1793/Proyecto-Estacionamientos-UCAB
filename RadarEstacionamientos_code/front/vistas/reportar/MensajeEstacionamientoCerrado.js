// @HU-9.1 Crear una incidencia · Sebastian — Mensaje «estacionamiento cerrado»: el administrador lo cerró mientras se llenaba el formulario
// Vista «interfaz» · Aviso de que en ese estacionamiento no se pueden reportar incidencias (regla de negocio del back, 409).
export default function MensajeEstacionamientoCerrado({ error }) {
  return (
    <p className="mensaje-error" role="alert">
      {error} Elige otro estacionamiento de la lista.
    </p>
  );
}
