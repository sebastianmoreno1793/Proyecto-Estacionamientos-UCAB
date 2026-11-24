// Vista «interfaz» · Mensaje de que la acción salió bien («Cambios guardados.», «Se agregó…»).
export default function MensajeHecho({ mensaje, className }) {
  return (
    <p className={className} role="status">
      {mensaje}
    </p>
  );
}
