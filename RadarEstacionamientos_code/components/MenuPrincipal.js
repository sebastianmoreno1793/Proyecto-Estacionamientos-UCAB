import EnlacesMenu from "./EnlacesMenu";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";

// Menú de la app, en todas las páginas. Lo de personal autorizado (incidencias, placas,
// capacidad) solo aparece para el administrador.
export default async function MenuPrincipal() {
  const usuario = await obtenerUsuarioActual();
  const enlaces = [
    { href: "/", texto: "Mapa", icono: "🗺️" },
    { href: "/incidencias/nueva", texto: "Reportar incidencia", icono: "⚠️" },
  ];
  if (esAdministrador(usuario)) {
    enlaces.push(
      { href: "/incidencias", texto: "Incidencias", icono: "📋" },
      { href: "/admin/actividad", texto: "Actividad de la garita", icono: "🚧" },
      { href: "/admin/estacionamientos", texto: "Estacionamientos", icono: "🛠️" },
    );
  }

  return (
    <header className="menu">
      <a href="/" className="menu-marca">
        Radar de Estacionamientos UCAB <span>Campus Montalbán</span>
      </a>
      <EnlacesMenu enlaces={enlaces} />
      {usuario && (
        <span className="menu-usuario" title={usuario.correo}>
          👤 {usuario.rol}
        </span>
      )}
    </header>
  );
}
