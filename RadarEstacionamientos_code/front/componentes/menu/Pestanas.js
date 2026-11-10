"use client";

// Las cuatro pestañas (Inicio, Mapa, Reportar, Perfil) y cuál está activa.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "@/componentes/comunes/Iconos";

// Dice si una pestaña queda marcada: la de la ruta exacta; además Perfil para todo /admin
// (administración) e Inicio para /sugerencia, que es parte del Inicio.
function estaActiva(href, ruta) {
  if (ruta === href) return true;
  if (href === "/") return ruta === "/sugerencia";
  if (href === "/perfil") return ruta.startsWith("/admin");
  return false;
}

// Muestra las cuatro pestañas (Inicio, Mapa, Reportar, Perfil) y marca la activa según la ruta; la usa MenuPrincipal.
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
