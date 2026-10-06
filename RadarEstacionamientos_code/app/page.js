import BotonNotificaciones from "@/components/botonNotificaciones";
import MapaCampus from "@/components/MapaCampus";

export default function Inicio() {
  return (
    <main className="pagina">
      <header className="encabezado">
        <h1>Radar de Estacionamientos UCAB</h1>
        <p>Campus Montalbán</p>
      </header>
      <MapaCampus />
      <BotonNotificaciones />
    </main>
  );
}
