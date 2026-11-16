// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Mensaje «Cambios guardados.»
// Vista «interfaz» · Confirmación de Administrar › Puestos.
export default function MensajeCambiosGuardados({ mensaje }) {
  return (
    <p className="oculto-visual" role="status">
      {mensaje}
    </p>
  );
}
