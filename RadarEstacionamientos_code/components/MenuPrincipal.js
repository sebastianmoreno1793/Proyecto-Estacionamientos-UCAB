import Link from "next/link";
import EnlacesMenu from "./EnlacesMenu";
import { salir } from "@/app/cuenta/acciones";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";

// Menú de la app, en todas las páginas (D-007): la marca en Azul Carnet arriba y las pestañas,
// que en el celular bajan a una barra fija como en iOS (máximo 5). Lo de personal autorizado
// (incidencias, placas, capacidad) solo aparece para el administrador. La Garita se abre desde
// «Administrar» para no pasar de 5 pestañas.
export default async function MenuPrincipal() {
  const usuario = await obtenerUsuarioActual();
  const enlaces = [
    { href: "/", texto: "Mapa", icono: "mapa" },
    { href: "/sugerencia", texto: "Sugerir", icono: "sugerir" }, // HU 7.2
    { href: "/incidencias/nueva", texto: "Reportar", icono: "reportar" },
  ];
  if (esAdministrador(usuario)) {
    enlaces.push(
      { href: "/incidencias", texto: "Incidencias", icono: "incidencias" },
      { href: "/admin/estacionamientos", texto: "Administrar", icono: "admin" },
    );
  }

  return (
    <header className="menu">
      <a href="/" className="menu-marca">
        <img src="/icono-192.png" alt="" width={32} height={32} />
        <span>
          <strong>Radar UCAB</strong>
          <small>Campus Montalbán</small>
        </span>
      </a>
      {/* Sin sesión las pestañas solo llevarían a /entrar: no se muestran. */}
      {usuario && <EnlacesMenu enlaces={enlaces} />}
      {usuario && (
        <div className="menu-usuario">
          <span title={usuario.correo}>{usuario.rol}</span>
          <Link href="/vehiculos">Mis vehículos</Link>
          <form action={salir}>
            <button type="submit">Salir</button>
          </form>
        </div>
      )}
    </header>
  );
}
