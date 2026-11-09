"use client";

// Las cuatro pestañas (Inicio, Mapa, Reportar, Perfil) y cuál está activa.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "./Iconos";

// Qué pestaña queda marcada: la de la ruta exacta, y Perfil para todo lo que se abre desde ahí
// (administración). La sugerencia (/sugerencia) es parte del Inicio.
function estaActiva(href, ruta) {
  if (ruta === href) return true;
  if (href === "/") return ruta === "/sugerencia";
  if (href === "/perfil") return ruta.startsWith("/admin");
  return false;
}

export default function Pestanas({ enlaces }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Menú principal" className="pestanas">
      {enlaces.map(({ href, texto, icono }) => (
        <Link key={href} href={href} className="pestana" aria-current={estaActiva(href, ruta) ? "page" : undefined}>
          <Icono nombre={icono} />
          <span>{texto}</span>
        </Link>
      ))}
    </nav>
  );
}
