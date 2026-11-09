import Link from "next/link";
import EnlacesMenu from "./EnlacesMenu";
import { obtenerUsuarioActual } from "@/lib/sesion";
import { inicialesDe } from "@/lib/usuarios/reglas";

// Encabezado y barra de pestañas (D-007 v2): el mismo en web y en teléfono.
// Cuatro pestañas para todos. Lo de administración (incidencias, garita, capacidad, edificios)
// se abre desde Perfil y solo lo ve el administrador.
const ENLACES = [
  { href: "/", texto: "Inicio", icono: "inicio" },
  { href: "/mapa", texto: "Mapa", icono: "mapa" },
  { href: "/incidencias/nueva", texto: "Reportar", icono: "reportar" },
  { href: "/perfil", texto: "Perfil", icono: "perfil" },
];

export default async function MenuPrincipal() {
  const usuario = await obtenerUsuarioActual();

  return (
    <header className="menu">
      <a href="/" className="menu-marca">
        <img src="/icono-192.png" alt="" width={32} height={32} />
        <strong>Radar UCAB</strong>
      </a>
      {usuario && (
        <Link href="/perfil" className="menu-avatar" aria-label="Tu perfil">
          {inicialesDe(usuario.correo)}
        </Link>
      )}
      {/* Sin sesión las pestañas solo llevarían a /entrar: no se muestran. */}
      {usuario && <EnlacesMenu enlaces={ENLACES} />}
    </header>
  );
}
