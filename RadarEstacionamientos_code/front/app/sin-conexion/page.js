// Pantalla que muestra la PWA cuando no hay internet y la página no está guardada (D-008).
import Link from "next/link";
import estilos from "../formularios.module.css";

export const metadata = { title: "Sin conexión" };

// Página que muestra el service worker (D-008) cuando no hay red y la página pedida no está
// guardada. No muestra cifras: la ocupación sin red sería vieja y engañaría al conductor.
export default function SinConexion() {
  return (
    <main className={estilos.pagina}>
      <h1>Sin conexión</h1>
      <p className={estilos.ayuda}>
        El Radar necesita internet para mostrar los puestos libres en vivo. Cuando vuelva la señal,
        intenta de nuevo.
      </p>
      <Link href="/" className="boton-principal">
        Intentar de nuevo
      </Link>
    </main>
  );
}
