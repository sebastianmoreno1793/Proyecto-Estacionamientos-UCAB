// @HU-2.1 Registrar mis vehículos · Samuel — Mensaje «Vehículo AB123CD registrado.»
// Vista «interfaz» · Confirmación de Mis vehículos.
export default function MensajeVehiculoRegistrado({ mensaje }) {
  return (
    <p role="status" style={{ width: "100%" }}>
      {mensaje}
    </p>
  );
}
