// Vista «interfaz» · Mensaje «datos no válidos»: lo que hay que corregir antes de enviar (lo decide el
// validador del front) o lo que respondió el back. Como el «DatosNoValidos» del ejemplo de la profesora.
export default function MensajeDatosNoValidos({ error, className = "mensaje-error" }) {
  return (
    <p className={className} role="alert">
      {error}
    </p>
  );
}
